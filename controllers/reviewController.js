import reviewAndRatingModel from "../models/reviewAndRatingModel.js";
import userModel from "../models/userModel.js";

class ReviewController {
    // Give Review to a User
    giveReviewToUser = async (req, res) => {
        try {
            // Prevent self review
            if (req.user.userId === req.params.toUserId) {
                return res.status(400).send({
                    message: "You cannot review yourself",
                    success: false
                });
            }

            // Check if the user to be reviewed exists
            const userExist = await userModel.findOne({ _id: req.params.toUserId })

            // If user does not exist, return 404
            if (!userExist) {
                return res.status(404).send({
                    message: "User not found!",
                    success: false
                })
            }

            // Check if the logged-in user has already reviewed this user
            const isReviewAlreadyExist = await reviewAndRatingModel.findOne({
                fromUser: req.user.userId,
                toUser: req.params.toUserId
            })

            // If review already exists, prevent duplicate review
            if (isReviewAlreadyExist) {
                return res.status(400).send({
                    message: "You have already reviewed this user.",
                    success: false
                })
            }

            // Create a new review
            const review = await reviewAndRatingModel.create({
                fromUser: req.user.userId,
                toUser: req.params.toUserId,
                review: req.body.review
            })

            // Send success response
            res.status(201).send({
                message: "Review done successfully!",
                result: review,
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

export default ReviewController;