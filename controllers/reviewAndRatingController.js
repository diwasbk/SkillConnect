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

    // Get Review And Rating By Id
    getReviewAndRatingById = async (req, res) => {
        try {
            // Find review and rating by ID from request parameters
            const reviewRatingExist = await reviewAndRatingModel.findOne({ _id: req.params.reviewRatingId })

            // If review and rating does not exist, return 404 response
            if (!reviewRatingExist) {
                return res.status(404).send({
                    message: "ReviewAndRating not found!",
                    success: false
                })
            }

            // Send success response with fetched review and rating data
            res.status(200).send({
                message: "ReviewAndRating found!",
                result: reviewRatingExist,
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

    // Get All Reviews And Ratings Given By a Specific User
    getAllReviewsAndRatingsGiven = async (req, res) => {
        try {
            // Fetch all reviews and ratings where the user is the reviewer (fromUser)
            const allReviewsAndRatingsGiven = await reviewAndRatingModel.find({ fromUser: req.params.fromUserId })

            // Send success response with fetched reviews and ratings
            res.status(200).send({
                message: "All ReviewsAndRatings given.",
                result: allReviewsAndRatingsGiven,
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

    // Get All Reviews And Ratings Received By a Specific User
    getAllReviewsAndRatingsReceived = async (req, res) => {
        try {
            // Fetch all reviews and ratings where the user is the receiver (toUser)
            const allReviewsAndRatingsReceived = await reviewAndRatingModel.find({ toUser: req.params.toUserId })

            // Send success response with fetched reviews and ratings
            res.status(200).send({
                message: "All ReviewsAndRatings received.",
                result: allReviewsAndRatingsReceived,
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

    // Delete Review And Rating By Id
    deleteReviewAndRatingById = async (req, res) => {
        try {
            // Check if the review and rating with the given ID exists in the database
            const reviewAndRatingExist = await reviewAndRatingModel.findOne({ _id: req.params.reviewAndRatingId })

            // If no review and rating found, return a 404 Not Found response
            if (!reviewAndRatingExist) {
                return res.status(404).send({
                    message: "ReviewAndRating not found!",
                    success: false
                })
            }

            // If review and rating exists, delete it from the database
            await reviewAndRatingModel.deleteOne({ _id: req.params.reviewAndRatingId })

            // Send success response after successful deletion
            res.status(200).send({
                message: "ReviewAndRating deleted successfully!",
                success: true
            })

        } catch (err) {
            console.log(err.message)
            res.status(500).send({
                message: err.message ? `Internal server error: ${err.message}` : "Internal server error.",
                success: false
            })
        }
    }
}

export default ReviewAndRatingController;