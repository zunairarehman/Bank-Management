require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const loanRoutes = require("./routes/loanRoutes");
const atmRoutes = require('./routes/atm.routes');
const budgetRoutes = require("./routes/budget.routes");
const creditRoutes = require("./routes/credit.routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_, res) =>
  res.json({ success: true, message: "Bank API running" }),
);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", budgetRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/credit", require("./routes/credit.routes"));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Server error" });
});

const start = async () => {
  await connectDB();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Local:   http://localhost:${PORT}/api/health`);
    console.log(
      `Network: http://<your-pc-ip>:${PORT}/api/health (use this IP in Expo Go)`,
    );
  });
};

start();
