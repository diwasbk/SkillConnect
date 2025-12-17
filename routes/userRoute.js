import express from "express"
import UserController from "../controllers/userController.js"

const userRouter = express.Router()
const userController = new UserController

userRouter.get("/:id", userController.getUserById)

export default userRouter