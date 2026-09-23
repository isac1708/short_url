import Hashids from "hashids";
import { env } from "../config/env.js";

const BASE62_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const hashids = new Hashids(env.HASHIDS_SALT, 6, BASE62_ALPHABET);

export function encodeId(id: number): string {
  return hashids.encode(id);
}

export function decodeCode(code: string): number | null {
  const decoded = hashids.decode(code);
  if (!decoded || decoded.length === 0) {
    return null;
  }
  return Number(decoded[0]);
}
