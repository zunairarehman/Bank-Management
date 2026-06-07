const express = require("express");
const router = express.Router();

const { getCreditScore } = require("../controllers/credit.controller");

router.get("/:userId", getCreditScore);

module.exports = router;