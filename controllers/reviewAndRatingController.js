import reviewAndRatingModel from "../models/reviewAndRatingModel.js"

class ReviewAndRatingController {
    // Get All Reviews And Ratings (Admin Only)
    getAllReviewsAndRatings = async (req, res) => {
        try {
            // Fetch all reviews from the database
            const allReviews = await reviewAndRatingModel.find()

            // Send success response with fetched reviews
            res.status(200).send({
                message: "All Reviews",
                result: allReviews,
                success: true
            })

        } catch (err) {
            console.log(err)
            res.status(500).send({
                message: err.message ? `Internal server error: ${err.message}` : "Internal server error.",
                success: false
            })
        }
    }
}

export default ReviewAndRatingController;