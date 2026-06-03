const config = {
  name: "spam",
  version: "1.1.0",
  aliases: ['spamv1',
    'spv1',
    'spam1'],
  descriptions: "Đị𝐭 𝐌ẹ 𝐂á𝐜 𝐂𝐨𝐧 𝐓𝐫á𝐧𝐡 𝐑𝐚 𝐁ố 𝐕ũ 𝐓ớ𝐢 𝐑ồ𝐢 Đâ𝐲",
  credits: "Thành Vũ",
  permissions: [2],
  extra: {
    "time": 2000//time mặc định spam khọng nên thay đổi nếu đéo muốn bị khóa mõm
  }
}
if (!global.Spam) {
  global.Spam = [];
}
async function Running( {
  message, args, extra
}) {
  const isStop = args[0]?.toLowerCase() === 'stop';
  if (isStop) {
    const stoper = global.Spam.indexOf(message.threadID);
    if (stoper > -1) {
      global.Spam.splice(stoper, 1);
      return message.send(global.config.GBOTWAR_MESSAGE.SPAM_STOP);
    } else {
      return message.reply('Mày có đang spam đéo đâu! Dừng cái lồn gì vậy?');
    }
  } else {
    const spamContent = args.join(' ');
    if (spamContent.length === 0) {
      return message.send(global.config.GBOTWAR_MESSAGE.SPAM_START);
    }
    if (global.Spam.indexOf(message.threadID) > -1) {
      return message.reply('Mày bị óc lồn à? Muốn bị khóa mõm hay gì ?');
    } else {
      global.Spam.push(message.threadID);
      while (global.Spam.indexOf(message.threadID) > -1) {
        message.send(spamContent).catch(e => {
          message.reply(e);
          console.error(e);
        });
        await new Promise(resolve => {
          setTimeout(resolve, extra.time);
        });
      }
    }
  }
}
export default {
  config,
  Running
}