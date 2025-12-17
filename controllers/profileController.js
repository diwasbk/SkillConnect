import profileModel from "../models/profileModel.js";
import userModel from "../models/userModel.js";

class ProfileController {
    // Create a new profile for the logged-in user
    createProfile = async (req, res) => {
        try {
            const { profileImageUrl, skills } = req.body

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
                profileImageUrl: profileImageUrl,
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
}

export default ProfileController;