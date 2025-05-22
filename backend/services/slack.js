import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const sendToSlack = async (text) => {
  const res = await axios.post(process.env.SLACK_WEBHOOK_URL, { text });
  return res.data;
};
