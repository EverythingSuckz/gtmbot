export function timeFormat(seconds: number): string {
  const final_secs = Math.floor(seconds % 60);
  const minutes = Math.floor((seconds / 60) % 60);
  const hours = Math.floor(seconds / (60 * 60));
  const final_hours = hours % 24;
  const days = Math.floor(hours / 24);
  let timeStr = "";
  if (days === 1) {
    timeStr += `${days} day, `;
  } else if (days > 1) {
    timeStr += `${days} days, `;
  }
  timeStr += `${final_hours} hour${(final_hours > 1) ? "s" : ""}, `;
  timeStr += `${minutes} minute${(minutes > 1) ? "s" : ""} and `;
  timeStr += `${final_secs} second${(final_secs > 1) ? "s" : ""}.`;
  return timeStr;
}

export async function getHostIp() {
  return (await (await fetch("https://api.ipify.org/?format=json")).json()).ip;
}