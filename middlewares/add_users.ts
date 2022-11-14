import { grammy } from "../deps.ts";
import { addOrUpdateUser } from "../core/db.ts";

export const middleware = async (
  ctx: grammy.Context,
  next: grammy.NextFunction,
) => {
  await next();
  if (ctx.has("message") && ctx.chat?.type === "private") {
    let name: string = "";
    if (ctx.msg.from?.first_name) {
      name += ctx.msg.from?.first_name;
    }
    name += " ";
    if (ctx.msg.from?.last_name) {
      name += ctx.msg.from?.last_name;
    }
    await addOrUpdateUser(
      ctx.msg.from?.id!,
      name.trim(),
      ctx.msg.from?.username,
    );
  }
};
