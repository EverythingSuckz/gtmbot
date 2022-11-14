# 🦕 gtmbot [WIP]

## Mandatory ENV variables

- `BOT_TOKEN` - it is what it is
- `DB_URI` - A postgresql database url (can be locally hosted one too)

## Running the bot

```sh
deno run --allow-all mod.ts --dev
```

>`--dev` will check for .env files from the CWD and registers the key values as environment variables.
