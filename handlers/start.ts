import { BotContext } from "../core/bot.ts";
import { getWelcomeStuffs } from "../helpers/conversations.ts";
import { conversations, createConversation, grammy } from "../deps.ts";

const composer = new grammy.Composer<BotContext>();

composer.use(conversations());
composer.use(createConversation(getWelcomeStuffs));

composer.command(["start", "help"], async (ctx) => {
  const keyboard = new grammy.InlineKeyboard();
  if (ctx.message!.text.startsWith("/start") && ctx.chat.type === "supergroup"){
    const user = await ctx.getAuthor();
    if (user.status === "creator" || user.status === "administrator"){
      return await ctx.conversation.enter("getWelcomeStuffs")
    }
  }
  ctx.reply(
    `Hello ${ctx.from?.first_name},\nI can <b>welcome new members</b>. But unlike other bots, you can configure me to <b>send the welcome messages to a <a href='https://t.me/tginfoen/1522'>specific topic</a></b> ;)`,
    {
      parse_mode: "HTML",
      disable_web_page_preview: true, 
      reply_markup: keyboard
        .url("Add me to a group", `https://telegram.dog/${ctx.me.username}?startgroup&admin=post_messages+delete_messages+invite_users+manage_chat`),
    },
  );
});

export default composer;
