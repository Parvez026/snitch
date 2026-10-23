import { configDotenv } from "dotenv";

configDotenv();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not define in enviromental veriable");
}
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not define in enviromental veriable");
}

export const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};
