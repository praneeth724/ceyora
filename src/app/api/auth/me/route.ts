import { getSession } from "@/lib/session";
import { json, unauthorized } from "@/lib/api";

export async function GET() {
  const user = await getSession();
  if (!user) return unauthorized();
  return json({ user });
}
