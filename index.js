
const https = require("https");
const url = require("url");
const SLACK_URL = "YOUR_SLACK_WEBHOOK_URL";
const SLACK_REQ_OPTS = url.parse(SLACK_URL);
SLACK_REQ_OPTS.method = "POST";
SLACK_REQ_OPTS.headers = {"Content-Type": "application/json"};
exports.handler = function(event, context) {
  console.log(`event: ${JSON.stringify(event)}`);
  console.log(`context: ${JSON.stringify(context)}`);
  (event.Records || []).forEach(function (rec) {
    if (rec.Sns) {
      const req = https.request(SLACK_REQ_OPTS, function (res) {
        if (res.statusCode === 200) {
          const succeedMessage = "posted to slack";
          console.log(succeedMessage);
          context.succeed(succeedMessage);
        } else {
          context.fail("status code: " + res.statusCode);
        }
      });

      req.on("error", function(e) {
        console.log("problem with request: " + e.message);
        context.fail(e.message);
      });

      const message = JSON.stringify(JSON.parse(rec.Sns.Message));
      console.log(`creating message...${message}`);
      const text = `EBのヘルスチェック結果が「低下」以下になりました！ 速やかに確認して下さい！\nMessage: ${message}`;
      console.log(text);
      const sendMessage = JSON.stringify({text: text});
      console.log(sendMessage);
      req.write(sendMessage);
      req.end();
    }
  });
};
