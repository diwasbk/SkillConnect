import profileModel from "../models/profileModel.js";
import userModel from "../models/userModel.js";

class ProfileController {
    // Create a new profile for the logged-in user
    createProfile = async (req, res) => {
        try {
            const skills = JSON.parse(req.body.skills)

            // Check if the user already has a profile
            const profileExist = await profileModel.findOne({ userId: req.user.userId })

            // If profile already exists, prevent duplicate creation
            if (profileExist) {
                return res.status(400).send({
                    message: "Profile already exist!",
                    success: false
                })
            }

            // Create a new profile in the database
            const createdProfile = await profileModel.create({
                userId: req.user.userId,
                profileImageUrl: req.file.path.replace(/\\/g, "/"),
                skills: skills
            })

            // Update user document to store the profile ID
            await userModel.findOneAndUpdate(
                { _id: req.user.userId },
                { $set: { profile: createdProfile._id } }
            )

            // Send a success response after the profile is successfully created
            res.status(201).send({
                message: "Profile created successfully!",
                result: createdProfile,
                success: true
            })

        } catch (err) {
            console.log(err)
            res.status(500).send({
                message: err.message ? `Internal server error: ${err.message}` : "Internal server error."
            })
        }
    }

    // Get a profile by its ID
    getProfileById = async (req, res) => {
        try {
            // Find a profile in the database using the ID from request parameters
            const profileExist = await profileModel.findOne({ _id: req.params.id })

            // If no profile is found, return 404 (Not Found) response
            if (!profileExist) {
                return res.status(404).send({
                    message: "Profile not found.",
                    success: false
                })
            }

            // If profile is found, send success response with profile data
            res.status(200).send({
                message: "Profile found.",
                result: profileExist,
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

export default ProfileController;