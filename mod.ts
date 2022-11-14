import bot from "./core/bot.ts";
import { config } from "./config.ts";
import { serve } from "./core/server.ts";
import { getHostIp } from "./helpers/utils.ts";

console.log("starting...");
let FQDN: string;

if (config.DENO_APP_NAME) {
  FQDN = `https://${config.DENO_APP_NAME}.deno.dev/`;
  console.log("Using webhooks");
  const resp = await fetch(`https://api.telegram.org/bot${config.BOT_TOKEN}/setWebhook?url=${FQDN}${config.BOT_TOKEN}`)
  console.log(await resp.text())
  await serve();
} else {
  console.log("starting bot");
  bot.start();
}

// Set webhooks



