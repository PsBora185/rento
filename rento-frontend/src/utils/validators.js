export const validators = {
  email: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  phone: (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
  },

  password: (password) => {
    return password && password.length >= 6;
  },

  pincode: (pincode) => {
    const re = /^[0-9]{6}$/;
    return re.test(pincode);
  },

  price: (price) => {
    return price && !isNaN(price) && parseFloat(price) >= 0;
  },

  required: (value) => {
    return value && value.toString().trim().length > 0;
  },
};

export const validateLoginForm = ({ identifier, password }) => {
  const errors = {};
  if (!identifier) errors.identifier = 'Required';
  if (!password || password.length < 6) errors.password = 'Min 6 chars';
  return { isValid: !Object.keys(errors).length, errors };
};

export const validateSignupForm = ({ name, identifier, password }) => {
  const errors = {};
  if (!name) errors.name = 'Required';
  if (!identifier) errors.identifier = 'Required';
  if (!password || password.length < 6) errors.password = 'Min 6 chars';
  return { isValid: !Object.keys(errors).length, errors };
};