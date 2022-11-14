import start from "./start.ts";
import welcome from "./welcome.ts";
import { grammy } from "../deps.ts";
import { BotContext } from "../core/bot.ts";

const composer = new grammy.Composer<BotContext>();

composer.use(start);
composer.use(welcome);

export default composer;
