import express from "express"
import UserController from "../controllers/userController.js"

const userRouter = express.Router()
const userController = new UserController

userRouter.get("/:id", userController.getUserById)
userRouter.delete("/delete-account-permanently", userController.deleteUserAccount)

export default userRouter