const express = require("express");
const router = express.Router();

const atm = require("../controllers/atm.controller");

router.post("/generate-pin", atm.generatePin);
router.post("/change-pin", atm.changePin);
router.post("/withdraw", atm.withdraw);
router.post("/deposit", atm.deposit);
router.post("/block", atm.blockCard);

module.exports = router;