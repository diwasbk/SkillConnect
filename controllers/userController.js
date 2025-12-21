import profileModel from "../models/profileModel.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt"

class UserController {
    // Get User By Id
    getUserById = async (req, res) => {
        try {
            // Find user in the database using the id from request parameters
            const userExist = await userModel.findOne({ _id: req.params.id }).select("-password")

            // If user does not exist, send 404 response
            if (!userExist) {
                return res.status(404).send({
                    message: "User not found!",
                    success: false
                })
            }

            // If user exists, send 200 response with user data
            res.status(200).send({
                message: `User found!`,
                result: userExist,
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

    // Delete User Account along with its Profile
    deleteUserAccount = async (req, res) => {
        try {
            // Find the logged-in user's account using userId from token
            const userAccountExist = await userModel.findById(req.user.userId);

            // If user account does not exist, return 404
            if (!userAccountExist) {
                return res.status(404).send({
                    message: "User account not found!",
                    success: false
                });
            }

            // Compare the entered password with the hashed password in database
            const isPasswordMatch = await bcrypt.compare(req.body.password, userAccountExist.password);

            // If password does not match, return unauthorized response
            if (!isPasswordMatch) {
                return res.status(401).send({
                    message: "Incorrect password!",
                    success: false
                });
            }

            // Delete user
            await userModel.findOneAndDelete(req.user.userId);

            // Delete the related profile from profiles collection
            await profileModel.findOneAndDelete(req.user.profileId)

            // Send success response after deleting both user and profile
            return res.status(200).send({
                message: "User account deleted successfully",
                success: true
            });

        } catch (err) {
            console.log(err);
            return res.status(500).send({
                message: err.message ? `Internal server error: ${err.message}` : "Internal server error.",
                success: false
            });
        }
    };
}

export default UserController;