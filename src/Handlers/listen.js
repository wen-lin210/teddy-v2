import moment from 'moment-timezone';
import handleEvents from './events.js';
import { isTermux } from '../Core/helpers/runtime.js';
import {
  handleDatabase
} from './database.js';


export default async function handleListen() {
  const {
    handleCommand,
    handleReaction,
    handleMessage,
    handleReply,
    handleUnsend,
    handleEvent
  } = await handleEvents();
  const eventlog_excluded = ["typ",
    "presence",
    "read_receipt"];
  const logger = global.modules.get('console');

  function handleEventLog(event) {
    const {
      LOG_LEVEL,
      timezone
    } = global.config;

    if (LOG_LEVEL == 0) return;
    if (eventlog_excluded.includes(event.type)) return;
    const {
      type,
      threadID,
      body,
      senderID
    } = event;
    if (global.config.GBOTWAR_OPTIONS.LISTEN_CONSOLE === true) {
      if (LOG_LEVEL == 1) {
        let time = moment().tz(timezone).format('YYYY-MM-DD_HH:mm:ss');

        if (type == 'message' || type == 'message_reply') {
          logger.custom(`${threadID} • ${senderID} • ${body ? body : 'Photo, video, sticker, etc.'}`, `${time}`);
        }
      } else if (LOG_LEVEL == 2) {
        console.log(event);
      }
    }
    return;
  }

  return (err, event) => {
    if (err) {
      if (err.type === 'stop_listen') {
        logger.error('MQTT Listen bị dừng: ' + (err.error || 'Unknown'));
      } else {
        logger.error('Listen error: ' + (err.error || err.message || JSON.stringify(err)));
      }
      return;
    }
    if (!event || !event.type) return;

    if (global.maintain && !global.config.MODERATORS.some(e => e == event.senderID || e == event.userID)) return;

    // Termux: skip logging để tiết kiệm CPU
    if (!isTermux) {
      handleEventLog(event);
    }

    if (global.config.ALLOW_INBOX !== true && event.isGroup === false) return;
    (async () => {
      if (!eventlog_excluded.includes(event.type)) {
        await handleDatabase({
          ...event
        });
      }
      switch (event.type) {
        case "message":
        case "message_reply": {
          const eventWithArgs = {
            ...event,
            args: event.args || (event.body ? event.body.trim().split(/\s+/) : [])
          };
          handleMessage(eventWithArgs);
          handleReply(eventWithArgs);
          handleCommand(eventWithArgs);
          break;
        }
        case "message_reaction":
          handleReaction({
            ...event
          });
          break;
        case "message_unsend":
          handleUnsend({
            ...event
          });
          break;
        case "event":
        case "change_thread_image":
          handleEvent({
            ...event
          });
          break;
        case "typ":
          break;
        case "presence":
          break;
        case "read_receipt":
          break;
        case "ready":
          logger.success('MQTT Listen đã sẵn sàng');
          break;
        default:
          break;
      }
    })();
  }
}