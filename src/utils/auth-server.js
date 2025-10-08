// utils/auth-server.js

import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value || null;
};

export const decodeToken = async (token) => {
  try {
    if (!token) return null;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export const getUserFromToken = async () => {
  const token = await getToken();
  if (!token) return null;
  return await decodeToken(token);
};