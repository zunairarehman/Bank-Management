const calculateEMI = require("./src/utils/emiCalculator");

const result = calculateEMI(
  500000, // amount
  12, // interest rate
  24, // months
);

console.log(result);
