const express = require("express");
const adminController = require("../controllers/adminController");
const { protectAdmin, requireRole } = require("../middleware/auth");
const loanController = require("../controllers/loanController");

const router = express.Router();
router.use(protectAdmin);

router.get("/dashboard", adminController.getDashboardStats);
router.get("/users", adminController.getUsers);
router.patch(
  "/users/:id/status",
  requireRole("super_admin", "admin", "manager"),
  adminController.updateUserStatus,
);
router.delete(
  "/users/:id",
  requireRole("super_admin", "admin"),
  adminController.deleteUser,
);
router.get("/transactions", adminController.getTransactions);
router.patch("/transactions/:id/flag", adminController.flagTransaction);
router.get("/accounts", adminController.getAccounts);
router.get("/audit-logs", adminController.getAuditLogs);
router.get("/loan-applications", loanController.getLoanApplications);

router.put(
  "/loan-applications/:id/approve",
  requireRole("super_admin", "admin", "manager"),
  loanController.approveLoan,
);

router.put(
  "/loan-applications/:id/reject",
  requireRole("super_admin", "admin", "manager"),
  loanController.rejectLoan,
);

router.get("/loans", loanController.getLoans);

router.get("/loan-repayments", loanController.getAllRepayments);

router.get("/repayments", loanController.getAllRepayments);

router.put("/repayments/:id/pay", loanController.markRepaymentPaid);

module.exports = router;
