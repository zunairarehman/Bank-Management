const LoanRepayment = require("../models/LoanRepayment");
const Notification = require("../models/Notification");

const checkLoanReminders = async () => {
  try {
    const today = new Date();

    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    const repayments = await LoanRepayment.find({
      status: "pending",
    });

    for (const repayment of repayments) {
      const dueDate = new Date(repayment.dueDate);

      const dueDateOnly = dueDate.toISOString().split("T")[0];
      const todayOnly = today.toISOString().split("T")[0];
      const threeDaysOnly = threeDaysLater.toISOString().split("T")[0];

      // Due today
      if (dueDateOnly === todayOnly) {
        await Notification.create({
          userId: repayment.userId,
          title: "Loan Due Today",
          message: `Installment #${repayment.installmentNo} of PKR ${repayment.amount.toLocaleString()} is due today.`,
          type: "loan",
        });
      }

      // Due in 3 days
      if (dueDateOnly === threeDaysOnly) {
        await Notification.create({
          userId: repayment.userId,
          title: "Upcoming Loan Payment",
          message: `Installment #${repayment.installmentNo} is due in 3 days.`,
          type: "loan",
        });
      }

      // Overdue
      if (dueDate < today) {
        repayment.status = "overdue";
        await repayment.save();

        await Notification.create({
          userId: repayment.userId,
          title: "Loan Payment Overdue",
          message: `Installment #${repayment.installmentNo} is overdue.`,
          type: "loan",
        });
      }
    }
  } catch (error) {
    console.error("Loan reminder error:", error);
  }
};

module.exports = checkLoanReminders;
