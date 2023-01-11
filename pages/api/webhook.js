const redis = require("redis");
import axios from "axios";
import { customAlphabet } from "nanoid";

const urlPattern =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)$/;

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const events = req.body.events;

      // handle event here
      events.forEach(async (event) => {
        let returnMessage = ""
        if (event.type === "message" && event.message.type === "text") {
          if (urlPattern.test(event.message.text)) {
            let client = redis.createClient({
              url: process.env.REDIS_URL,
            });

            client.on("error", function (err) {
              throw err;
            });

            await client.connect();

            const nanoid = customAlphabet(
              "abcdefghijklmnopqrstuvwxyz0123456789",
              5
            );
            let urlPath = nanoid();
            let checkIsExist = await client.get(urlPath);

            while (checkIsExist !== null) {
              urlPath = nanoid();
              checkIsExist = await client.get(urlPath);
            }
            await client.set(urlPath, event.message.text);
            returnMessage = "You short url: " + `${process.env.THIS_URL}/${urlPath}`
            await client.disconnect();
          } else {
            returnMessage = "Your message is not url pattern , please Try again."
          }
          let data = JSON.stringify({
            replyToken: event.replyToken,
            messages: [
              {
                type: "text",
                text: returnMessage,
              },
            ],
          });

          let config = {
            method: "post",
            url: "https://api.line.me/v2/bot/message/reply",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.LINE_ACCESS_TOKEN}`,
            },
            data: data,
          };

          axios(config)
            .then((response) => {
              console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
      res.status(200).end();
    } catch (err) {
      console.error(err);
      res.status(500).end();
    }
  } else {
    res.status(405).end();
  }
}
