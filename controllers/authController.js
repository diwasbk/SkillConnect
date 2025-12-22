import userModel from "../models/userModel.js"
import bcrypt from "bcrypt"
import { generateToken } from "../utils/jwt.js"

class AuthController {
    // Register a new user account
    registerAccount = async (req, res) => {
        try {
            const { name, email, phone, address, gender, password } = req.body

            // Check if a user already exists with the given email
            const userExist = await userModel.findOne({ email: email })

            // If email is already registered, stop further execution
            if (userExist) {
                return res.status(400).send({
                    message: "This email is already in use.",
                    success: false
                })
            }

            // Generate salt for password hashing
            const salt = await bcrypt.genSalt(10)

            // Hash the password using bcrypt
            const hashedPassword = await bcrypt.hash(password, salt)

            // Create a new user in the database
            await userModel.create({
                name,
                email,
                phone,
                address,
                gender,
                password: hashedPassword
            })

            // Send success response after successful registration
            res.status(201).send({
                message: "User registered successfully!",
                success: true,
            })

        } catch (err) {
            console.log(err)
            res.status(500).send({
                message: err.message ? `Internal server error: ${err.message}` : "Internal server error.",
                success: false
            })
        }
    }

    // Login an existing user
    loginUser = async (req, res) => {
        const { email, password } = req.body
        try {
            // Check if user exists with the provided email
            const userExist = await userModel.findOne({ email: email })

            // If user does not exist in the database, respond with an error
            if (!userExist) {
                return res.status(401).send({
                    message: "Invalid email or password",
                    success: false
                })
            }

            // Compare entered password with hashed password from database
            const isPasswordMatch = await bcrypt.compare(password, userExist.password)

            // If password does not match, deny access
            if (!isPasswordMatch) {
                return res.status(401).send({
                    message: "Invalid email or password.",
                    success: false
                })
            }

            // Prepare JWT payload
            const payload = {
                userId: userExist._id,
                profileId: userExist.profile,
                email: userExist.email,
                role: userExist.role
            }

            // Generate JWT token
            const token = generateToken(payload)

            // Store token in HTTP-only cookie
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 3000 * 1000,
                sameSite: "lax",
                secure: false
            })

            // Send success response after successful login
            res.status(200).send({
                message: `Logged in successfully!`,
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

    // Change Account Password
    changeAccountPassword = async (req, res) => {
        try {
            // Find the logged-in user's account using userId from token
            const userAccountExist = await userModel.findOne({ _id: req.user.userId })

            // If user account does not exist, return 404
            if (!userAccountExist) {
                return res.status(404).send({
                    message: "User not found!",
                    success: false
                })
            }

            // Destructure passwords from request body
            const { currentPassword, newPassword, confirmNewPassword } = req.body

            // Compare entered current password with stored hashed password
            const isPasswordMatch = await bcrypt.compare(
                currentPassword,
                userAccountExist.password
            )

            // If current password is incorrect, return error
            if (!isPasswordMatch) {
                return res.status(400).send({
                    message: "Incorrect current password!",
                    success: false
                })
            }

            // Check if new password and confirm password match
            if (newPassword !== confirmNewPassword) {
                return res.status(400).send({
                    message: "New password and confirm new password do not match.",
                    success: false
                })
            }

            // Generate salt for hashing new password
            const salt = await bcrypt.genSalt(10)

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, salt)

            // Update user's password in database
            await userModel.findOneAndUpdate(
                { _id: req.user.userId },
                { $set: { password: hashedPassword } }
            )

            // Send success response
            res.status(200).send({
                message: "Password changed successfully!",
                success: true
            })

        } catch (err) {
            // Log error and return server error response
            console.log(err)
            res.status(500).send({
                message: `Internal server error: ${err.message}`,
                success: false
            })
        }
    }
}

export default AuthController;