const express = require("express")
const EventoController = require("../controllers/EventoController")
const OrganizadorController = require("../controllers/OrganizadorController")

const router = express.Router()

// Evento
router.get("/eventos", EventoController.getEventos)
router.get("/eventos/:id", EventoController.getEvento)
router.post("/eventos", EventoController.postEvento)

// Organizador
router.get("/organizadores", OrganizadorController.getOrganizadores)
router.post("/organizador", OrganizadorController.postOrganizador)
router.post("/loginOrganizador", OrganizadorController.login)

module.exports = router