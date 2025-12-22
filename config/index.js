import dotenv from "dotenv"

dotenv.config()

export const PORT = process.env.PORT

export const MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://127.0.0.1:27017/SkillConnect"
