import { grammy } from "../deps.ts";
import { middleware as addUserMiddleware } from "./add_users.ts";

const composer = new grammy.Composer(addUserMiddleware);

export default composer;