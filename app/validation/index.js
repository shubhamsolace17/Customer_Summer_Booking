export default {
  validateEmail: email => {
      const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // eslint-disable-line

    return reg.test(email);
  },
  validatePassword: password => {
      const regPass = /^(?=.*\d).{6,12}$/; // eslint-disable-line

    return regPass.test(password);
  },
  validatePhoneNumber: phone => {
      const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4,5})$/; // eslint-disable-line
    return regex.test(phone);
  },
};
