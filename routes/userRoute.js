import express from "express"
import UserController from "../controllers/userController.js"
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware.js"

const userRouter = express.Router()
const userController = new UserController

userRouter.get("/all", userController.getAllUsers)
userRouter.get("/:userId", userController.getUserById)
userRouter.delete("/delete-account-permanently", userController.deleteUserAccountPermanently)
userRouter.delete("/delete-account-permanently-by-admin/:userId", adminAuthMiddleware, userController.deleteUserAccountPermanentlyByAdmin)

export default userRouter