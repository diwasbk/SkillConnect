import express from "express"
import ProfileController from "../controllers/profileController.js";
import upload from "../middlewares/multerMiddleware.js";

const profileRouter = express.Router()
const profileController = new ProfileController

profileRouter.post("/create", upload.single("myfile"), profileController.createProfile)
profileRouter.get("/:id", profileController.getProfileById)
profileRouter.put("/new-skill", profileController.addNewSkill)
profileRouter.delete("/delete-skill/:id", profileController.deleteSkill)

export default profileRouter;