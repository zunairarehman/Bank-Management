const generateAccountNumber = () => {
  const prefix = 'BAH';
  const random = Math.floor(1000000000 + Math.random() * 9000000000);
  return `${prefix}${random}`;
};

module.exports = generateAccountNumber;
