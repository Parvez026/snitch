import { configDotenv } from "dotenv";

configDotenv();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not define in enviromental veriable");
}

export const config = {
  MONGO_URI: process.env.MONGO_URI,
};
