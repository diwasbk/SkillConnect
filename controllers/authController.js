import userModel from "../models/userModel.js"
import bcrypt from "bcrypt"
import { generateToken } from "../utils/jwt.js"

class AuthController {
    // Register User
    registerAccount = async (req, res) => {
        try {
            const { name, email, phone, address, gender, password } = req.body

            // Check if user already exist or not
            const userExist = await userModel.findOne({ email: email })

            if (userExist) {
                return res.status(400).send({
                    message: "This email is already in use.",
                    success: false
                })
            }

            // Hash the password before saving 
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            await userModel.create({
                name,
                email,
                phone,
                address,
                gender,
                password: hashedPassword
            })

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

    // Login User
    loginUser = async (req, res) => {
        const { email, password } = req.body
        try {
            // Check if user exist with the provided email or not
            const userExist = await userModel.findOne({ email: email })
            if (!userExist) {
                return res.status(401).send({
                    message: "Invalid email or password",
                    success: false
                })
            }

            // Check password
            const isPasswordMatch = await bcrypt.compare(password, userExist.password)
            if (!isPasswordMatch) {
                return res.status(401).send({
                    message: "Invalid email or password.",
                    success: false
                })
            }

            // Generate Token
            const payload = {
                userId: userExist._id,
                email: userExist.email,
                role: userExist.role
            }
            const token = generateToken(payload)

            // Set the token in cookie
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 3000 * 1000,
                sameSite: "lax",
                secure: false
            })

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
}

export default AuthController;