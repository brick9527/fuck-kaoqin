const { SMTPClient } = require("emailjs");
const { CronJob } = require("cron");
const http = require("http");

const ServerConfig = {
  backHost: "",
  backPort: 14332,
  host: "smtp.exmail.qq.com",
  port: 465,
  user: "",
  password: "",
  notices: [""],
};

const client = new SMTPClient({
  host: ServerConfig.host,
  port: ServerConfig.port,
  user: ServerConfig.user,
  password: ServerConfig.password,
  ssl: {
    rejectUnauthorized: false,
  },
});

let noticeFlags = [];

function createFlags() {
  noticeFlags = [];
  ServerConfig.notices.forEach((notice) => {
    const flag = Math.floor(100000 * Math.random());
    noticeFlags.push({
      notice,
      flag,
    });
    console.log(`生成标识 ${notice} ${flag}`);
  });
}

// 刷新标识 "0 0 5 * * *"
createFlags();
new CronJob("0 0 17 * * *", createFlags).start();

// 提醒 "0 */10 18-22 * * *"
new CronJob("0 */10 18-22 * * *", () => {
  for (let noticeFlag of noticeFlags) {
    const { notice, flag } = noticeFlag;
    const text = `FVCK打卡：http://${ServerConfig.backHost}:${ServerConfig.backPort}?${flag}`;
    client.send(
      {
        text: text,
        from: `FVCK打卡 <${ServerConfig.user}>`,
        to: notice,
        subject: `【FVCK打卡】`,
      },
      async (error, info) => {
        if (error) {
          console.log(`发送邮件失败: ${JSON.stringify(error)}`);
        } else {
          console.log(`发送邮件成功: ${JSON.stringify(info)}`);
        }
      }
    );
  }
}).start();

http
  .createServer(function (req, res) {
    const url = req.url || "";
    const query = url.split("?")[1];
    const index = noticeFlags.findIndex(
      (noticeFlag) => noticeFlag.flag.toString() === query
    );
    console.log(`收到请求 ${url}`);
    if (index !== -1) {
      noticeFlags.splice(index, 1);
      res.end("success fvck!");
    } else {
      res.end("fvck but not full fvck!");
    }
  })
  .listen(ServerConfig.backPort);
