import { SignJWT, jwtVerify } from "jose";
import type { SessionUser } from "./permissions";

export const SESSION_COOKIE = "ceyora_session";
const TOKEN_TTL = "7d";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("JWT_SECRET is missing or too short. Set it in .env");
  }
  return new TextEncoder().encode(secret);
}

// ---- JWT (Edge-compatible via jose) -------------------------------------

export async function signToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
    access: user.access,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      id: Number(payload.sub),
      email: String(payload.email),
      name: String(payload.name),
      role: payload.role as SessionUser["role"],
      access: Array.isArray(payload.access) ? (payload.access as string[]) : [],
    };
  } catch {
    return null;
  }
}
