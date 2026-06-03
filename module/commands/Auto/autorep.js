import {
  join,
  resolve as resolvePath
} from 'path';
import {
  readFileSync,
  writeFileSync,
  existsSync
} from 'fs';

const config = {
  name: "autorep",
  version: "1.0.0",
  descriptions: "Auto rep làm mấy con đĩ nứng lồn cay cú",
  credits: "Nhật Ngáo",
  permissions: [2]
}

const pathAutoRep = join(resolvePath(process.cwd(),'resources','Data', 'autorep.json'));
function onLoad() {
  if (!existsSync(pathAutoRep)) {
    writeFileSync(pathAutoRep, JSON.stringify({}), 'utf-8');
  }
}
async function Running( {
  args, message
}) {
  let data = JSON.parse(readFileSync(pathAutoRep, 'utf-8'));
  if (!data[message.threadID]) data[message.threadID] = {
    enable: true,
    content: '',
    mention: ''
  };
  const select = args.join(" ")?.toLowerCase();
  const taggg = args.join(" ");

  const sub = (args[0] || '').toLowerCase();
  if (sub === 'off' || sub === 'offline' || sub === 'stop') {
    data[message.threadID].enable = false;
    data[message.threadID].index = 0;
    data[message.threadID].content = "";
    data[message.threadID].mention = "";
    message.reply('Đã tắt chế độ chọc tức');
  } else {
    const mentionKeys = message?.mentions ? Object.keys(message.mentions) : [];
    const mention = mentionKeys[0];
    let arraytag = [];
    let name = mention ? message.mentions[mention] : '';
    arraytag.push({
      id: mention,
      tag: name
    });
    if (!mention) {
      return message.reply('Vui lòng tag đứa bạn muốn chọc tức');
    } else {
      data[message.threadID].enable = true;
      data[message.threadID].index = 0;
      data[message.threadID].content = select.replace(`${Object.values(message.mentions)[0]}`, '');
      data[message.threadID].mention = mention;
      message.reply('Đã bật chế độ chọc tức');
    }
  }
  writeFileSync(pathAutoRep, JSON.stringify(data, null, 4), 'utf-8');
}
export default {
  config,
  Running,
  onLoad
}