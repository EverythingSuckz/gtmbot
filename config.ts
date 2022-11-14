import { bool, cleanEnv, configAsync, num, parse, str } from "./deps.ts";

const dev: boolean = parse(Deno.args).dev;
await configAsync({ export: dev });

export const config = cleanEnv(Deno.env.toObject(), {
  PORT: num({
    default: 80,
  }),
  BOT_TOKEN: str(),
  DEV: bool(
    { default: dev },
  ),
  DENO_APP_NAME: str({
    default: "",
  }),
  DB_URI: str(),
});
