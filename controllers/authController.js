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
}

export default AuthController;