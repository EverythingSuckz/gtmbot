import { BotContext, MyConversation } from "../core/bot.ts";
import { setGroup } from "../core/db.ts";

const urlExp = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/

export async function getWelcomeStuffs(conversation: MyConversation, ctx: BotContext) {
    let welcomeMessage: string | undefined = "Hello $name,\nWelcome to $title, Please follow the rules and stay."
    let rulesUrl: string | undefined = undefined
    if (ctx.from === undefined) return false;
    if (!ctx?.msg?.is_topic_message) return await ctx.reply(`This command can only be used inside a topic`,{parse_mode: "HTML"},);
    await ctx.reply("Send any <b>welcome message</b>\n\n<b>Example:</b>\n<code>Hello $name,\nWelcome to $title. Hope you'll enjoy and stay.</code>\n\n<i>You can also /skip this step (default greeting message will be used)</i>", {message_thread_id: ctx.message?.message_thread_id, parse_mode: "HTML"});
    const response1 = await conversation.waitFrom(ctx.from);
    if (!(response1.message?.text?.startsWith("/skip"))){
      welcomeMessage = response1.message?.text
    }
    await ctx.reply("Now send me the url to the rules of this group, it can be a thread message link or any website url.\n\n<i>You can also /skip this step (No rules will be shown)</i>", {message_thread_id: ctx.message?.message_thread_id, parse_mode: "HTML"});
    while (true){
      const response2 = await conversation.waitFrom(ctx.from);
      if (!(response2.message?.text?.startsWith("/skip"))){
        if (response2.message!.text!.match(urlExp)){
          rulesUrl = response2.message?.text
          break
        } else {
          await ctx.reply("This is not a valid URL. Maybe /skip?", {message_thread_id: ctx.message?.message_thread_id, parse_mode: "HTML"})
        }
        
      } else break
    }
    await setGroup(
      ctx.chat?.id!, ctx.chat?.title, ctx.chat?.username, ctx.message?.message_thread_id, welcomeMessage, rulesUrl
    )
    await ctx.reply("Successfully configured welcome topic.", {message_thread_id: ctx.message?.message_thread_id});
  }