const calculateEMI = (principal, annualInterestRate, months) => {
  const monthlyRate = annualInterestRate / 12 / 100;

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  const totalPayable = emi * months;
  const totalInterest = totalPayable - principal;

  return {
    emi: Number(emi.toFixed(2)),
    totalPayable: Number(totalPayable.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
  };
};

module.exports = calculateEMI;
