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
    getProfileByProfileId = async (req, res) => {
        try {
            // Find a profile in the database using the ID from request parameters
            const profileExist = await profileModel.findOne({ _id: req.params.profileId })

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

    // Add New Skill in the Profile
    addNewSkill = async (req, res) => {
        try {
            // Find the profile using the profileId from the authenticated user
            const profileExist = await profileModel.findOne({ _id: req.user.profileId })

            // If the profile does not exist, return a 404 error response
            if (!profileExist) {
                return res.status(404).send({
                    message: "Profile not found! Please create your profile first and then try again later.",
                    success: false
                })
            }

            // Destructure skill details from the request body
            const { category, level, charge, description } = req.body

            // Create a new skill object
            const newSkill = {
                category,
                level,
                charge,
                description
            }

            // Add the new skill to the profile's skills array
            profileExist.skills.push(newSkill)

            // Save the updated profile to the database
            await profileExist.save()

            // Send a success response including the newly added skill
            res.status(201).send({
                message: "New skill added successfully!",
                result: newSkill,
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

    // Delete Skill by Its ID
    deleteSkillById = async (req, res) => {
        try {
            // Find the profile using the profileId from the authenticated user
            const profile = await profileModel.findOne({ _id: req.user.profileId })

            // If the profile does not exist, return a 404 error response
            if (!profile) {
                return res.status(404).send({
                    message: "Profile not found! Please create your profile first and then try again later.",
                    success: false
                })
            }

            // Check if the skill exists in the profile's skills array
            const skillExist = profile.skills.find((skill) => {
                return skill._id == req.params.skillId
            })

            // If the skill does not exist, return a 404 error
            if (!skillExist) {
                return res.status(404).send({
                    message: "Skill not found!",
                    success: false
                })
            }

            // Find the index of the skill in the skills array
            const skillIndex = profile.skills.findIndex((skill) => {
                return skill.id == req.params.skillId
            })

            // Remove the skill from the array using splice
            profile.skills.splice(skillIndex, 1)

            // Save the updated profile to the database
            await profile.save()

            // Send a success response with the updated skills array
            res.status(200).send({
                message: "Skill deleted successfully!",
                result: profile.skills,
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

    // Update Profile Image by Profile ID
    updateProfileImageByProfileId = async (req, res) => {
        try {
            // Find the profile using the profileId from the authenticated user
            const profileExist = await profileModel.findOne({ _id: req.user.profileId })

            // If the profile does not exist, return a 404 error response
            if (!profileExist) {
                return res.status(404).send({
                    message: "Profile not found!",
                    success: false
                })
            }

            // Update the profile image URL
            const result = await profileModel.findOneAndUpdate(
                { _id: req.user.profileId },
                { $set: { profileImageUrl: req.file.path.replace(/\\/g, "/") } },
                { new: true }
            )

            // Send a success response with the updated profile image url
            res.status(200).send({
                message: "Profile image updated successfully!",
                result: result,
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