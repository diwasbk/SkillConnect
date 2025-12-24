import ticketModel from "../models/ticketModel.js"
import userModel from "../models/userModel.js"

class TicektController {
    // Request Ticket
    requestTicket = async (req, res) => {
        try {
            // Destructure required fields from request body
            const { ticketRequestedTo, severity, description } = req.body

            // Check whether the user who will receive the ticket exists or not
            const ticketReceivingUserExist = await userModel.findOne({ _id: ticketRequestedTo })

            // If receiving user does not exist, return 404 response
            if (!ticketReceivingUserExist) {
                return res.status(404).send({
                    message: "User not found!",
                    success: false
                })
            }

            // Create a new ticket in the database
            const result = await ticketModel.create({
                ticketRequestedFrom: req.user.userId,
                ticketRequestedTo: ticketRequestedTo,
                severity: severity,
                description: description,
                attachedImageUrl: req.file.path.replace(/\\/g, "/")
            })

            // Send success response after ticket creation
            res.status(201).send({
                message: "Ticket requested successfully!",
                result: result,
                success: true
            })

        } catch (err) {
            console.log(err)
            res.status(500).send({
                message: err.message ? ` Internal server error: ${err.message}` : "Internal server error.",
                success: false
            })
        }
    }

    // Get All Ticket By Status
    getAllTicketRequestByStatus = async (req, res) => {
        try {
            const ticketStatus = await ticketModel.find({ status: req.query.status })

            res.status(200).send({
                message: `Ticket Status.`,
                result: ticketStatus,
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

export default TicektController;