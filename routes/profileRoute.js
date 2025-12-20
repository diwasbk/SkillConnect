import express from "express"
import ProfileController from "../controllers/profileController.js";
import upload from "../middlewares/multerMiddleware.js";

const profileRouter = express.Router()
const profileController = new ProfileController

profileRouter.post("/create", upload.single("myfile"), profileController.createProfile)

export default profileRouter;