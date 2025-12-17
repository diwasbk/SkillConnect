import express from "express"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import connectDB from "./db/db.js"
import authRouter from "./routes/authRoute.js"

const app = express()
app.use(express.json())
app.use(cookieParser());
dotenv.config()

app.use("/api/auth", authRouter)

const PORT = process.env.PORT

await connectDB()

app.listen(PORT, () => {
    console.log(`Server is running at the port ${PORT}.`)
})