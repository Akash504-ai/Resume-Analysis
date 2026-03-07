import crypto from "crypto";

const algorithm = "aes-256-cbc";

// Must be 32 characters for aes-256
const secretKey = process.env.ENCRYPTION_KEY;

if (!secretKey) {
  throw new Error("ENCRYPTION_KEY is not set in environment variables");
}

// Convert key to buffer
const key = Buffer.from(secretKey, "utf-8").slice(0, 32);

/**
 * Encrypt text
 */
export function encrypt(text) {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

/**
 * Decrypt text
 */
export function decrypt(encryptedText) {
  const parts = encryptedText.split(":");

  const iv = Buffer.from(parts[0], "hex");
  const encrypted = parts[1];

  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}