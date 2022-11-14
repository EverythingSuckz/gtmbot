import { config } from "../config.ts";
import { handleError } from "../helpers/error_handler.ts";
import handlers from "../handlers/mod.ts";
import middlewares from "../middlewares/mod.ts";
import { Conversation, ConversationFlavor, conversations, grammy, hydrate, HydrateFlavor } from "../deps.ts";

export type BotContext = HydrateFlavor<grammy.Context> & ConversationFlavor;
export type MyConversation = Conversation<BotContext>;

export const bot = new grammy.Bot<BotContext>(config.BOT_TOKEN);
bot.use(hydrate());
bot.use(grammy.session({ initial: () => ({}) }));
bot.use(conversations());
bot.catch(handleError);
bot.use(middlewares);
bot.use(handlers);

await bot.api.setMyCommands([
  { command: "start", description: "Start the bot." },
]);

export default bot;
