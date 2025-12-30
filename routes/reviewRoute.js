import express from "express"
import ReviewController from "../controllers/reviewController.js"

const reviewRouter = express.Router()
const reviewController = new ReviewController

reviewRouter.post("/give/:toUserId", reviewController.giveReviewToUser)

export default reviewRouter;