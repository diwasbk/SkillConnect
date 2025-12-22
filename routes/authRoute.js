import express from "express"
import AuthController from "../controllers/authController.js"
import { jwtAuthMiddleware } from "../utils/jwt.js"

const authRouter = express.Router()
const authController = new AuthController

authRouter.post("/register", authController.registerAccount)
authRouter.post("/login", authController.loginUser)
authRouter.patch("/change-password", jwtAuthMiddleware, authController.changeAccountPassword)

export default authRouter;