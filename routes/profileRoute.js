import express from "express"
import ProfileController from "../controllers/profileController.js";

const profileRouter = express.Router()
const profileController = new ProfileController

profileRouter.post("/create", profileController.createProfile)

export default profileRouter;