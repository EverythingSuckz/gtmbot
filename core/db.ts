
import { config } from "../config.ts";
import { PostgresClient } from "../deps.ts";

const postgres = new PostgresClient(config.DB_URI);

try {
  await postgres.connect();
} catch (e) {
  if (e instanceof Deno.errors.ConnectionRefused) {
    console.error(e.message);
  }
}
await postgres.queryObject(`
CREATE TABLE IF NOT EXISTS users (
  user_id INT PRIMARY KEY,
  name VARCHAR(50),
  username VARCHAR(50),
  is_premium BOOLEAN,
  start_date TIMESTAMP
)`);

await postgres.queryObject(`
CREATE TABLE IF NOT EXISTS groups (
  group_id INT PRIMARY KEY,
  title VARCHAR(50),
  username VARCHAR(50),
  welcome_thread_id INT,
  welcome_message VARCHAR(1024),
  rules_url VARCHAR(500),
  added_date TIMESTAMP
)`);


export async function addOrUpdateUser(
  userId: number,
  name: string,
  username?: string,
  isPremium: boolean = false,
) {
  name = name ? `'${name}'` : "NULL";
  username = username ? `'${username}'` : "NULL";
  const sqlQuery = `
    INSERT INTO users (
        user_id, name, username, is_premium, 
        start_date
    ) 
    VALUES 
        (
        ${userId}, ${name}, ${username}, 
        ${isPremium}, '${new Date().toISOString()}'
        ) ON CONFLICT (user_id) DO 
    UPDATE 
    SET 
        name = EXCLUDED.name, 
        username = EXCLUDED.username, 
        is_premium = EXCLUDED.is_premium;
`;

  const output = await postgres.queryObject(sqlQuery);
}

export async function setGroup(
  groupId: number | string,
  title: string,
  username?: string | undefined,
  welcomeThreadId?: number | string,
  welcomeMessage?: string,
  rulesUrl?: string,
) {

  // Feel free to PR for better implementation of this part
  groupId = Number(groupId.toString().slice(4,))
  title = title ? `'${title}'` : "NULL";
  username = username ? `'${username}'` : "NULL";
  welcomeThreadId = welcomeThreadId ? `'${welcomeThreadId}'` : "NULL";
  welcomeMessage = welcomeMessage ? `'${welcomeMessage}'` : "NULL";
  rulesUrl = rulesUrl ? `'${rulesUrl}'` : "NULL";

  const sqlQuery = `
    INSERT INTO groups (
        group_id,
        title,
        username,
        welcome_thread_id,
        welcome_message,
        rules_url,
        added_date
    ) 
    VALUES 
        (
        ${groupId}, ${title}, ${username},  ${welcomeThreadId}, 
        ${welcomeMessage},  ${rulesUrl}, '${new Date().toISOString()}'
        ) ON CONFLICT (group_id) DO 
    UPDATE 
    SET 
        title = EXCLUDED.title, 
        username = EXCLUDED.username, 
        welcome_thread_id = EXCLUDED.welcome_thread_id, 
        welcome_message = EXCLUDED.welcome_message, 
        rules_url = EXCLUDED.rules_url;
`;
  console.log(sqlQuery);
  
  const output = await postgres.queryObject(sqlQuery);
}

export async function getGroupWelcome(
  groupId: number
  ) {
    groupId = String(groupId).startsWith("-100") ? Number(groupId.toString().slice(4,)) : groupId
    const sqlQuery = `select * from groups WHERE group_id = ${groupId};`
    const response = await postgres.queryObject<{ group_id: number; title: string, username: string | undefined, welcome_thread_id: number, welcome_message: string | undefined, rules_url: string | undefined, added_date: Date}>(sqlQuery);
    if (response.warnings) console.log(response.warnings);
    return response.rows[0]
}
