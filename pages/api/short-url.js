// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { customAlphabet } from "nanoid";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const urlPattern =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      type: "Error",
      code: 405,
      message: "Method Not Allowed",
    });
  }
  const { longUrl } = req.body;
  if (!longUrl || !urlPattern.test(longUrl)) {
    return res.status(400).send({
      type: "Error",
      code: 400,
      message: "Bad request",
    });
  }
  try {

    const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 5);
    let urlPath = nanoid();
    let checkIsExist = await redis.get(urlPath);

    while (checkIsExist !== null) {
      urlPath = nanoid();
      checkIsExist = await redis.get(urlPath);
    }
    await redis.set(urlPath, longUrl);
    res.status(200).json({ type: "success", urlPath:`${process.env.THIS_URL}/${urlPath}`, longUrl });
  } catch (error) {
    res.status(500).json({ type: "Error", code: 500 });
  }
}
