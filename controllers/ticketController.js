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
            // Find all tickets with the status provided in query
            const ticketStatus = await ticketModel.find({ status: req.query.status })

            // Send response with tickets
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

    // Get Ticket by Ticket Id
    getTicketByTicketId = async (req, res) => {
        try {
            // Find ticket by ID from request params
            const ticketExist = await ticketModel.findOne({ _id: req.params.ticketId })

            // If ticket not found, return 404
            if (!ticketExist) {
                return res.status(404).send({
                    message: "Ticket not found!",
                    success: false
                })
            }

            // Send response with ticket details
            res.status(200).send({
                message: "Ticket found!",
                result: ticketExist,
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

    // Get All Requested Tickets By User Id And Status
    getAllRequestedTicketsByUserId = async (req, res) => {
        try {
            // Check if user exists
            const userExist = await userModel.findOne({ _id: req.params.userId })

            // If user not found, return 404
            if (!userExist) {
                return res.status(404).send({
                    message: "User not found!",
                    success: false
                })
            }

            // Find all tickets requested from this user filtered by status
            const requestedTicket = await ticketModel.find({ ticketRequestedFrom: req.params.userId, status: req.query.status })

            // If no tickets found, return 404
            if (!requestedTicket) {
                return res.status(404).send({
                    message: " Ticket not found!",
                    success: false
                })
            }

            // Send response with requested tickets
            res.status(200).send({
                message: "All Requested Tickets",
                result: requestedTicket,
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

    // Get All Received Tickets By User Id And Status
    getAllReceivedTicketsByUserId = async (req, res) => {
        try {
            // Check if user exists
            const userExist = await userModel.findOne({ _id: req.params.userId })

            // If user not found, return 404
            if (!userExist) {
                return res.status(404).send({
                    message: "User not found!",
                    success: false
                })
            }

            // Find all tickets received by this user filtered by status
            const receivedTickets = await ticketModel.find({ ticketRequestedTo: req.params.userId, status: req.query.status })

            // If no tickets found, return 404
            if (!receivedTickets) {
                return res.status(404).send({
                    message: "Tickets not found!",
                    success: false
                })
            }

            // Send response with received tickets
            res.status(200).send({
                message: "All Received Tickets",
                result: receivedTickets,
                success: true
            })

        } catch (err) {
            console.log(err)
            res.status(500).send({
                message: err.message ? `Internal server error : ${err.message}` : "Internal server error.",
                success: false
            })
        }
    }

    // Accept Ticket Request By Ticket Id
    acceptTicketRequestByTicketId = async (req, res) => {
        try {
            // Find ticket by Id
            const ticketExist = await ticketModel.findOne({ _id: req.params.ticketId })

            // If ticket not found, return 404
            if (!ticketExist) {
                return res.status(404).send({
                    message: "Ticket not found!",
                    success: false
                })
            }

            // Check if ticket is already accepted
            if (ticketExist.status == "accepted") {
                return res.status(403).send({
                    message: "Request has already been accepted!",
                    success: false
                })
            }

            // Check if ticket is already rejected
            if (ticketExist.status === "rejected") {
                return res.status(403).send({
                    message: "This request was already rejected and cannot be accepted again. Please create a new request.",
                    success: false
                });
            }

            // Update ticket status to accepted
            const result = await ticketModel.findOneAndUpdate(
                { _id: req.params.ticketId },
                { $set: { status: "accepted" } },
                { new: true }
            )

            // Send response with updated ticket
            res.status(200).send({
                message: "Ticket request accepted successfully!",
                result: result,
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

    // Reject Ticket Request By Ticket Id
    rejectTicketRequestByTicketId = async (req, res) => {
        try {
            // Find ticket by Id
            const ticketExist = await ticketModel.findOne({ _id: req.params.ticketId })

            // If ticket not found, return 404
            if (!ticketExist) {
                return res.status(404).send({
                    message: "Ticket not found!",
                    success: false
                })
            }

            // Check if ticket is already rejected
            if (ticketExist.status == "rejected") {
                return res.status(403).send({
                    message: "Request has already been rejected!",
                    success: false
                })
            }

            // Update ticket status to rejected and add rejection reason
            const result = await ticketModel.findOneAndUpdate(
                { _id: req.params.ticketId },
                { $set: { status: "rejected", rejectionReason: req.body.rejectionReason } },
                { new: true }
            )

            // Send response with updated ticket
            res.status(200).send({
                message: "Ticket request rejected successfully!",
                result: result,
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

    // Edit Requested Ticket By Ticket Id
    editRequestedTicketByTicketId = async (req, res) => {
        try {
            // Find ticket by Id
            const ticketExist = await ticketModel.findOne({ _id: req.params.ticketId })

            // If ticket not found, return 409
            if (!ticketExist) {
                return res.status(404).send({
                    message: "Ticket not found!",
                    success: false
                })
            }

            // Prevent editing if ticket is accepted
            if (ticketExist.status == "accepted") {
                return res.status(409).send({
                    message: "This ticket is already accepted.",
                    success: false
                })
            }

            // Prevent editing if ticket is rejected
            if (ticketExist.status == "rejected") {
                return res.status(403).send({
                    message: "This ticket is already rejected.",
                    success: false
                })
            }

            // Update ticket details: severity, description, attached image
            const result = await ticketModel.findOneAndUpdate(
                { _id: req.params.ticketId },
                { $set: { severity: req.body.severity, description: req.body.description, attachedImageUrl: req.file.path.replace(/\\/g, "/") } },
                { new: true }
            )

            // Send response with updated ticket
            res.status(200).send({
                message: "Ticket Updated",
                result: result,
                sucess: true
            })

        } catch (err) {
            console.log(err)
            res.status(500).send({
                message: err.message ? `Internal server error: ${err.message}` : "Internal server error.",
                success: false
            })
        }
    }

    // Delete Ticket By Ticket Id
    deleteRequestedTicketByTicketId = async (req, res) => {
        try {
            // Find ticket by Id
            const ticketExist = await ticketModel.findOne({ _id: req.params.ticketId })

            // If ticket not found, return 409
            if (!ticketExist) {
                return res.status(404).send({
                    message: "Ticket not found!",
                    success: false
                })
            }

            // Prevent deleting if ticket is accepted
            if (ticketExist.status == "accepted") {
                return res.status(409).send({
                    message: "This ticket is already accepted.",
                    success: false
                })
            }

            // Prevent deleting if ticket is rejected
            if (ticketExist.status == "rejected") {
                return res.status(403).send({
                    message: "This ticket is already rejected.",
                    success: false
                })
            }

            // Delete the ticket
            await ticketModel.findOneAndDelete({ _id: req.params.ticketId })

            // Send response after deletion
            res.status(200).send({
                message: "Ticket deleted successfully!",
                success: true
            })

        } catch (err) {
            console.log(err)
            res.status(500).send({
                message: err.message ? `Internal server error: ${err.message}` : "Internal sever error.",
                success: false
            })
        }
    }
}

export default TicektController;