import fs from "fs";
import path from "path";
import { config } from "./secrets";

export const privateKey = fs.readFileSync(path.join(__dirname, "../", config.jwt.private_key_path), "utf8");
export const publicKey = fs.readFileSync(path.join(__dirname, "../", config.jwt.public_key_path), "utf8");