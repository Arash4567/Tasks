require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const { TOKEN, SERVER_URL } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;

const app = express();
app.use(bodyParser.json());

const init = async () => {
  const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
  console.log(res.data);
};

// const chatID = 883945872
//test

app.post(URI, async (req, res) => {
  console.log(req.body);
  if (!req.body.message.from.id) {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: req.body.message.from.id,
      text: "Your chat id: " + req.body.message.from.id,
    });
    return res.send();
  }
});

app.get("/", async (req, res) => {
    return res.send("Server is working...")
});

app.listen(process.env.PORT || 5000, async () => {
  console.log("app running on port: ", process.env.PORT || 5000);
  await init();
});
