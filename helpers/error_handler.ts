import { grammy } from "../deps.ts";

export const handleError = async (error: grammy.BotError<grammy.Context>) => {
  const { ctx } = error;
  const err = error.error;
  console.log({
    update_id: ctx.update.update_id,
    err,
  });
};