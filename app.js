import express from "express"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import connectDB from "./db/db.js"
import authRouter from "./routes/authRoute.js"
import profileRouter from "./routes/profileRoute.js"
import { jwtAuthMiddleware } from "./utils/jwt.js"
import userRouter from "./routes/userRoute.js"

const app = express()
app.use(express.json())
app.use(cookieParser());
dotenv.config()

// Serve uploaded files: this makes all files in the uploads folder publicly accessible
app.use("/uploads", express.static("uploads"))

app.use("/api/auth", authRouter)
app.use("/api/profile", jwtAuthMiddleware, profileRouter)
app.use("/api/user", jwtAuthMiddleware, userRouter)

const PORT = process.env.PORT

await connectDB()

app.listen(PORT, () => {
    console.log(`Server is running at the port ${PORT}.`)
})