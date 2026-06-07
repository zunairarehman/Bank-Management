const router = require("express").Router();
const ctrl = require("../controllers/budget.controller");

router.get("/budget", ctrl.getBudgets);
router.post("/budget/create", ctrl.createBudget);
router.post("/budget/expense", ctrl.addExpense);

module.exports = router;