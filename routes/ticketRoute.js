import express from "express"
import TicektController from "../controllers/ticketController.js"
import upload from "../middlewares/multerMiddleware.js"

const ticketRouter = express.Router()
const ticketController = new TicektController

ticketRouter.post("/request", upload.single("myfile"), ticketController.requestTicket)
ticketRouter.get("/", ticketController.getAllTicketRequestByStatus)
ticketRouter.get("/:ticketId", ticketController.getTicketByTicketId)
ticketRouter.get("/requested/:userId", ticketController.getAllRequestedTicketsByUserId)
ticketRouter.get("/received/:userId", ticketController.getAllReceivedTicketsByUserId)
ticketRouter.patch("/accept-request/:ticketId", ticketController.acceptTicketRequestByTicketId)
ticketRouter.patch("/reject-request/:ticketId", ticketController.rejectTicketRequestByTicketId)

export default ticketRouter;