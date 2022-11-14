
import { BotContext } from "../core/bot.ts"
import { getGroupWelcome, setGroup } from "../core/db.ts";
import { getWelcomeStuffs } from "../helpers/conversations.ts";
import { createConversation, conversations, grammy } from "../deps.ts";

const composer = new grammy.Composer<BotContext>();

composer.use(conversations());
composer.use(createConversation(getWelcomeStuffs));


composer.chatType('supergroup').command("init").filter(
  async (ctx) => {
    const user = await ctx.getAuthor();
    return user.status === "creator" || user.status === "administrator";
  },
  async (ctx) => await ctx.conversation.enter("getWelcomeStuffs")
);


composer.chatType('supergroup').on(":new_chat_members", async (ctx) => {
  console.log(ctx);
  const data = await getGroupWelcome(ctx.chat.id)
  console.log(data);
  if (data){
    const welcome_msg = data.welcome_message?.replace("$title", ctx.chat.title).replace("$name", ctx.from?.first_name)
    await ctx.reply(welcome_msg!, {message_thread_id: data.welcome_thread_id, reply_markup: data.rules_url ? new grammy.InlineKeyboard().url("Rules", data.rules_url): undefined})
    await setGroup(
      ctx.chat?.id!, ctx.chat?.title!, ctx.chat?.username, data.welcome_thread_id, data.welcome_message, data.rules_url
    )

  }
})


export default composer;
