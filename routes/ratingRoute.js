import express from "express"
import RatingController from "../controllers/ratingController.js"

const ratingRouter = express.Router()
const ratingController = new RatingController

ratingRouter.put("/give/:toUserId", ratingController.giveRatingToUser)

export default ratingRouter;