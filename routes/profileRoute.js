import express from "express"
import ProfileController from "../controllers/profileController.js";
import upload from "../middlewares/multerMiddleware.js";

const profileRouter = express.Router()
const profileController = new ProfileController

profileRouter.post("/create", upload.single("myfile"), profileController.createProfile)
profileRouter.get("/:id", profileController.getProfileById)
profileRouter.put("/new-skill", profileController.addNewSkill)
profileRouter.delete("/delete-skill/:id", profileController.deleteSkillById)
profileRouter.patch("/update-profile-image", upload.single("myfile"), profileController.updateProfileImageByProfileId)

export default profileRouter;