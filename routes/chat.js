const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { mensaje } = req.body;

  res.json({
    respuesta: "Respuesta simulada del chatbot: " + mensaje
  });
});

module.exports = router;