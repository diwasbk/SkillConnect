import express from "express"
import cookieParser from "cookie-parser"
import connectDB from "./db/db.js"
import authRouter from "./routes/authRoute.js"
import profileRouter from "./routes/profileRoute.js"
import { jwtAuthMiddleware } from "./utils/jwt.js"
import userRouter from "./routes/userRoute.js"
import { PORT } from "./config/index.js";
import ticketRouter from "./routes/ticketRoute.js"

const app = express()
app.use(express.json())
app.use(cookieParser());

// Serve uploaded files: this makes all files in the uploads folder publicly accessible
app.use("/uploads", express.static("uploads"))

app.use("/api/auth", authRouter)
app.use("/api/profile", jwtAuthMiddleware, profileRouter)
app.use("/api/user", jwtAuthMiddleware, userRouter)
app.use("/api/ticket", jwtAuthMiddleware, ticketRouter)

const startServer = async () => {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`Server is running at the port ${PORT}.`)
        })
    } catch (err) {
        console.error('Failed to start server:', err)
        process.exit(1);
    }
}

startServer()