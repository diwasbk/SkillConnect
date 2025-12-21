import profileModel from "../models/profileModel.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt"

class UserController {
    // Get All Users
    getAllUsers = async (req, res) => {
        try {
            // Fetch all user records but exclude the password field for security
            const result = await userModel.find().select("-password")

            // Send successful response with user data
            res.status(200).send({
                message: "All Users",
                result: result,
                success: true
            })

        } catch (err) {
            res.status(500).send({
                message: err.message ? `Internal server error: ${err.message}` : "Internal server error.",
                success: false
            })
        }
    }

    // Get User By Id
    getUserById = async (req, res) => {
        try {
            // Find user in the database using the id from request parameters
            const userExist = await userModel.findOne({ _id: req.params.userId }).select("-password")

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

    // Delete User Account along with its Profile Permanently
    deleteUserAccountPermanently = async (req, res) => {
        try {
            // Find the logged-in user's account using userId from token
            const userAccountExist = await userModel.findOne(req.user.userId);

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
            await userModel.findOneAndDelete({ _id: req.user.userId });

            // Delete the related profile from profiles collection
            await profileModel.findOneAndDelete({ _id: req.user.profileId })

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
    }

    // Delete User Account and its associated profile permanently, only allowed for an admin.
    deleteUserAccountPermanentlyByAdmin = async (req, res) => {
        try {
            // Find the user's account using userId from params
            const userAccountExist = await userModel.findOne({ _id: req.params.userId })

            // If user account does not exist, return 404
            if (!userAccountExist) {
                return res.status(404).send({
                    message: "User not found!",
                    success: false
                })
            }

            // Find the admin who is making the request
            const admin = await userModel.findOne({ _id: req.user.userId })

            // Compare the entered password with the admin's hashed password in database
            const isPasswordMatch = await bcrypt.compare(req.body.password, admin.password);

            // If password does not match, return unauthorized response
            if (!isPasswordMatch) {
                return res.status(401).send({
                    message: "Incorrect password!",
                    success: false
                });
            }

            // Delete user
            await userModel.findOneAndDelete({ _id: req.params.userId });

            // Delete the related profile from profiles collection
            await profileModel.findOneAndDelete({ userId: req.params.userId })

            // Send success response after deleting both user and profile
            return res.status(200).send({
                message: "User account deleted successfully",
                success: true
            });

        } catch (err) {
            console.log(err)
            res.status(500).send({
                message: err.message ? `Internal server error: ${err.message}` : "Internal server error.",
                success: false
            })
        }
    }
}

export default UserController;