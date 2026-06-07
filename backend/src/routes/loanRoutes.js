const express = require("express");
const router = express.Router();

const loanController = require("../controllers/loanController");
const { protect, protectAdmin, protectUser } = require("../middleware/auth");

router.use(protectUser);

router.post("/apply", loanController.applyForLoan);

router.get("/my-applications", loanController.getMyLoanApplications);

router.get("/active-loans", loanController.getMyLoans);

router.get("/repayment-schedule", loanController.getMyRepayments);

router.put("/repayments/:id/pay", loanController.markRepaymentPaid);

router.get("/my-loans", protectUser, loanController.getMyLoans);

router.get("/repayments", protectUser, loanController.getMyRepayments);

module.exports = router;
