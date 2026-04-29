const isValidEmail = (value = "") => /\S+@\S+\.\S+/.test(value);

const parsePositiveScore = (value) =>
  Number.isInteger(value) && value >= 0 ? value : null;

module.exports = {
  isValidEmail,
  parsePositiveScore
};
