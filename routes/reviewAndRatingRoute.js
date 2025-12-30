import express from "express"
import ReviewAndRatingController from "../controllers/reviewAndRatingController.js"

const reviewRatingRouter = express.Router()
const reviewAndRatingController = new ReviewAndRatingController

reviewRatingRouter.get("/", reviewAndRatingController.getAllReviewsAndRatings)
reviewRatingRouter.get("/:reviewRatingId", reviewAndRatingController.getReviewAndRatingById)

export default reviewRatingRouter;