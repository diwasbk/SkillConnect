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

    // Get Ticket by Ticket Id
    getTicketByTicketId = async (req, res) => {
        try {
            const ticketExist = await ticketModel.findOne({ _id: req.params.ticketId })

            if (!ticketExist) {
                return res.status(404).send({
                    message: "Ticket not found!",
                    success: false
                })
            }

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
            const userExist = await userModel.findOne({ _id: req.params.userId })

            if (!userExist) {
                return res.status(404).send({
                    message: "User not found!",
                    success: false
                })
            }

            const requestedTicket = await ticketModel.find({ ticketRequestedFrom: req.params.userId, status: req.query.status })

            if (!requestedTicket) {
                return res.status(404).send({
                    message: " Ticket not found!",
                    success: false
                })
            }

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
            const userExist = await userModel.findOne({ _id: req.params.userId })

            if (!userExist) {
                return res.status(404).send({
                    message: "User not found!",
                    success: false
                })
            }

            const receivedTickets = await ticketModel.find({ ticketRequestedTo: req.params.userId, status: req.query.status })

            if (!receivedTickets) {
                return res.status(404).send({
                    message: "Tickets not found!",
                    success: false
                })
            }

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
            const ticketExist = await ticketModel.findOne({ _id: req.params.ticketId })

            if (!ticketExist) {
                return res.status(404).send({
                    message: "Ticket not found!",
                    success: false
                })
            }

            if (ticketExist.status == "accepted") {
                return res.status(403).send({
                    message: "Request has already been accepted!",
                    success: false
                })
            }

            if (ticketExist.status === "rejected") {
                return res.status(403).send({
                    message: "This request was already rejected and cannot be accepted again. Please create a new request.",
                    success: false
                });
            }

            const result = await ticketModel.findOneAndUpdate(
                { _id: req.params.ticketId },
                { $set: { status: "accepted" } },
                { new: true }
            )

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
            const ticketExist = await ticketModel.findOne({ _id: req.params.ticketId })

            if (!ticketExist) {
                return res.status(404).send({
                    message: "Ticket not found!",
                    success: false
                })
            }

            if (ticketExist.status == "rejected") {
                return res.status(403).send({
                    message: "Request has already been rejected!",
                    success: false
                })
            }

            const result = await ticketModel.findOneAndUpdate(
                { _id: req.params.ticketId },
                { $set: { status: "rejected", rejectionReason: req.body.rejectionReason } },
                { new: true }
            )

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
            const ticketExist = await ticketModel.findOne({ _id: req.params.ticketId })

            if (!ticketExist) {
                return res.status(409).send({
                    message: "Ticket not found!",
                    success: false
                })
            }

            if (ticketExist.status == "accepted") {
                return res.status(409).send({
                    message: "This ticket is already accepted.",
                    success: false
                })
            }

            if (ticketExist.status == "rejected") {
                return res.status(403).send({
                    message: "This ticket is already rejected.",
                    success: false
                })
            }

            const result = await ticketModel.findOneAndUpdate(
                { _id: req.params.ticketId },
                { $set: { severity: req.body.severity, description: req.body.description, attachedImageUrl: req.file.path.replace(/\\/g, "/") } },
                { new: true }
            )

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
}

export default TicektController;