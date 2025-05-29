export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  // Password must be at least 8 characters (letters or numbers)
  const regex = /^[A-Za-z\d]{8,}$/;
  return regex.test(password);
};

export const validatePhoneNumber = (phoneNumber) => {
  // Phone number must be 10 digits and start with 0
  if (phoneNumber == '') {
    return true;
  }
  const regex = /^0\d{9}$/;
  return regex.test(phoneNumber);
}