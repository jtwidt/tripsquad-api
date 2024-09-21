function generateReferralCode(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Loop to generate characters for the specified length
  for (let i = 0; i < length; i++) {
    const randomInd = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomInd);
    if (i === 3) {
      result += '-';
    }
  }
  return result;
}

module.exports = {
  generateReferralCode,
};
