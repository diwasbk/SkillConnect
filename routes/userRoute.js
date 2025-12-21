import express from "express"
import UserController from "../controllers/userController.js"

const userRouter = express.Router()
const userController = new UserController

userRouter.get("/all", userController.getAllUsers)
userRouter.get("/:userId", userController.getUserById)
userRouter.delete("/delete-account-permanently", userController.deleteUserAccountPermanently)

export default userRouter