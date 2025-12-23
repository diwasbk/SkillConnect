import express from "express"
import TicektController from "../controllers/ticketController.js"

const ticketRouter = express.Router()
const ticketController = new TicektController

ticketRouter.post("/request", ticketController.requestTicket)

export default ticketRouter;