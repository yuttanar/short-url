import axios from "axios";
import { customAlphabet } from "nanoid";

import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});

const urlPattern =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)$/;

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const events = req.body.events;
      redis.on("error", (err) => console.log("Redis Client Error", err));
      await redis.connect();

      // handle event here
      await events.forEach(async (event) => {
        let returnMessage = "";
        if (event.type === "message" && event.message.type === "text") {
          if (urlPattern.test(event.message.text)) {
            const nanoid = customAlphabet(
              "abcdefghijklmnopqrstuvwxyz0123456789",
              5
            );
            let urlPath = nanoid();
            let checkIsExist = await redis.get(urlPath);

            while (checkIsExist !== null) {
              urlPath = nanoid();
              checkIsExist = await redis.get(urlPath);
            }
            await redis.set(urlPath, event.message.text);
            returnMessage =
              "You short url: " + `${process.env.THIS_URL}/${urlPath}`;
          } else {
            returnMessage =
              "Your message is not url pattern , please Try again.";
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

          await axios(config);
        }
      });
      return res.status(200).json({ type: "success" });
      await redis.disconnect();
    } catch (err) {
      await redis.disconnect();
      console.error(err);
      res.status(500).end();
    }
  } else {
    res.status(405).end();
  }
}
