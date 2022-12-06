import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const { TOKEN, GITHUB_TOKEN, GITHUB_URL } = process.env;

const bot = new Telegraf(TOKEN);

try {
  bot.hears(/#task (.*)/, async (ctx) => {
    ctx.reply("Task creating...");
    await axios
      .post(
        GITHUB_URL,
        {
          title: ctx.message.text.replace("#task ", "").slice(0, 25),
          body: ctx.message.text.replace("#task ", ""),
          //   labels: ["bug"],
        },
        {
          headers: {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
            Authorization: "Bearer " + GITHUB_TOKEN,
          },
        }
      )
      .then((res) => {
        ctx.reply("Task: " + res.data.html_url);
      })
      .catch((err) => {
        ctx.reply("Error: " + err);
      });
  });
} catch (err) {
  bot.on("text", async (ctx) => {
    await ctx.reply("Error: " + err);
  });
}

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
