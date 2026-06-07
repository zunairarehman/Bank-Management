const LoanApplication = require("../models/LoanApplication");
const Loan = require("../models/Loan");
const LoanRepayment = require("../models/LoanRepayment");
const Notification = require("../models/Notification");
const calculateEMI = require("../utils/emiCalculator");
const applyForLoan = async (req, res) => {
  try {
    const { amount, tenureMonths, purpose } = req.body;

    if (!amount || !tenureMonths || !purpose) {
      return res.status(400).json({
        success: false,
        message: "Amount, tenure and purpose are required",
      });
    }

    const interestRate = 12;

    const { emi, totalPayable, totalInterest } = calculateEMI(
      Number(amount),
      interestRate,
      Number(tenureMonths),
    );

    const application = await LoanApplication.create({
      userId: req.user._id,
      amount,
      tenureMonths,
      purpose,
      interestRate,
      emi,
      totalPayable,
    });

    res.status(201).json({
      success: true,
      message: "Loan application submitted successfully",
      data: {
        application,
        emi,
        totalPayable,
        totalInterest,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to submit loan application",
    });
  }
};

const getMyLoanApplications = async (req, res) => {
  try {
    const applications = await LoanApplication.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};
const getLoanApplications = async (req, res) => {
  try {
    const applications = await LoanApplication.find()
      .populate("userId", "fullName email phone")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const approveLoan = async (req, res) => {
  try {
    const application = await LoanApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Loan application not found",
      });
    }

    if (application.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Application already processed",
      });
    }

    application.status = "approved";
    application.reviewedAt = new Date();
    application.reviewedBy = req.admin._id;

    await application.save();

    const loan = await Loan.create({
      userId: application.userId,
      applicationId: application._id,
      amount: application.amount,
      interestRate: application.interestRate,
      tenureMonths: application.tenureMonths,
      emi: application.emi,
      totalPayable: application.totalPayable,
      remainingBalance: application.totalPayable,
      approvedBy: req.admin._id,
      status: "active",
    });

    const repayments = [];

    for (let i = 1; i <= application.tenureMonths; i++) {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i);

      repayments.push({
        loanId: loan._id,
        userId: application.userId,
        installmentNo: i,
        dueDate,
        amount: application.emi,
      });
    }

    await LoanRepayment.insertMany(repayments);

    await Notification.create({
      userId: application.userId,
      title: "Loan Approved",
      message: `Your loan of PKR ${application.amount} has been approved.`,
      type: "system",
    });

    res.json({
      success: true,
      message: "Loan approved successfully",
      data: loan,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const rejectLoan = async (req, res) => {
  try {
    const { reason } = req.body;

    const application = await LoanApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Loan application not found",
      });
    }

    application.status = "rejected";
    application.rejectionReason = reason || "Rejected by admin";
    application.reviewedAt = new Date();
    application.reviewedBy = req.admin._id;

    await application.save();

    await Notification.create({
      userId: application.userId,
      title: "Loan Rejected",
      message: application.rejectionReason,
      type: "system",
    });

    res.json({
      success: true,
      message: "Loan application rejected",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: loans.length,
      data: loans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getMyLoans = async (req, res) => {
  try {
    const loans = await Loan.find({
      userId: req.user._id,
    })
      .populate("applicationId", "purpose")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: loans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getMyRepayments = async (req, res) => {
  try {
    const repayments = await LoanRepayment.find({
      userId: req.user._id,
    })
      .populate({
        path: "loanId",
        populate: {
          path: "applicationId",
          select: "purpose",
        },
      })
      .sort({ installmentNo: 1 });

    res.json({
      success: true,
      data: repayments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getAllRepayments = async (req, res) => {
  try {
    const repayments = await LoanRepayment.find()
      .populate("userId", "fullName email")
      .sort({ dueDate: 1 });
    console.log(JSON.stringify(repayments[0], null, 2));
    res.json({
      success: true,
      data: repayments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const markRepaymentPaid = async (req, res) => {
  try {
    const repayment = await LoanRepayment.findById(req.params.id);

    if (!repayment) {
      return res.status(404).json({
        success: false,
        message: "Repayment not found",
      });
    }

    if (repayment.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Installment already paid",
      });
    }

    repayment.status = "paid";
    repayment.paidAt = new Date();

    await repayment.save();

    const loan = await Loan.findById(repayment.loanId);

    if (loan) {
      loan.remainingBalance = loan.remainingBalance - repayment.amount;

      if (loan.remainingBalance <= 0) {
        loan.remainingBalance = 0;
        loan.status = "completed";
      }

      await loan.save();
    }

    res.json({
      success: true,
      message: "Installment marked as paid",
      data: repayment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  applyForLoan,
  getMyLoanApplications,
  getLoanApplications,
  approveLoan,
  rejectLoan,
  getLoans,
  getMyLoans,
  getMyRepayments,
  getAllRepayments,
  markRepaymentPaid,
};
