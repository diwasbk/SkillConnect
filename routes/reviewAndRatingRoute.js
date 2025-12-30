import express from "express"
import ReviewAndRatingController from "../controllers/reviewAndRatingController.js"

const reviewRatingRouter = express.Router()
const reviewAndRatingController = new ReviewAndRatingController

reviewRatingRouter.get("/", reviewAndRatingController.getAllReviewsAndRatings)

export default reviewRatingRouter;