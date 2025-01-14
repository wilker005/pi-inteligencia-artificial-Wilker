const express = require('express');
const router = express.Router();

router.use('/eventos', require('./eventoRoutes'));
router.use('/usuarios', require('./usuario'));

module.exports = router;
