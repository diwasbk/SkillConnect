import userModel from "../models/userModel.js";

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
}

export default UserController;