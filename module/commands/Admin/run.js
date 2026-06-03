const config = {
    name: "run",
    aliases: ["eval", "execute", "exec"],
    permissions: [2],
    description: "Run bot scripts",
    usage: "<script>",
    credits: "XaviaTeam",
    isAbsolute: true
}

function Running({ message, args }) {
    if (global.config?.GBOTWAR_OPTIONS?.ALLOW_EVAL_COMMAND !== true) {
        return message.reply("Lệnh này đã bị tắt ở chế độ Termux tối giản.");
    }

    if (!args.length) {
        return message.reply("Thiếu nội dung script cần chạy.");
    }

    eval(args.join(" "));
    message.reply("Done!");
}

export default {
    config,
    Running
}
