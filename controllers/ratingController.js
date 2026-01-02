import reviewAndRatingModel from "../models/reviewAndRatingModel.js";
import userModel from "../models/userModel.js";

class RatingController {
    // Give or Update Rating To a User
    giveRatingToUser = async (req, res) => {
        try {
            const { rating } = req.body;

            // Validate rating
            if (rating === undefined || rating < 1 || rating > 5) {
                return res.status(400).send({
                    message: "Rating must be between 1 and 5",
                    success: false
                });
            }

            // Check if user exists
            const userExist = await userModel.findById({ _id: req.params.toUserId });

            // If user does not exist, return 404
            if (!userExist) {
                return res.status(404).send({
                    message: "User not found!",
                    success: false
                });
            }

            // Create or Update rating
            const ratingResult = await reviewAndRatingModel.findOneAndUpdate(
                {
                    fromUser: req.user.userId,
                    toUser: req.params.toUserId
                },
                {
                    $set: { rating }
                },
                {
                    new: true,
                    upsert: true // creates if not exists
                }
            );

            // Send success response
            res.status(200).send({
                message: "Rating saved successfully",
                result: ratingResult,
                success: true
            });

        } catch (err) {
            console.log(err)
            res.status(500).send({
                message: err.message ? `Internal server error: ${err.message}` : "Internal server error.",
                success: false
            })
        }
    };
}

export default RatingController;