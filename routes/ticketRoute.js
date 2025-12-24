import express from "express"
import TicektController from "../controllers/ticketController.js"
import upload from "../middlewares/multerMiddleware.js"

const ticketRouter = express.Router()
const ticketController = new TicektController

ticketRouter.post("/request", upload.single("myfile"), ticketController.requestTicket)
ticketRouter.get("/", ticketController.getAllTicketRequestByStatus)
ticketRouter.get("/:ticketId", ticketController.getTicketByTicketId)

export default ticketRouter;