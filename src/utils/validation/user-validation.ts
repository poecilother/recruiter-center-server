import { ResponseMessage } from '../../resources';
import { GeneralValidation } from '.';
import validator from 'validator';

const constraints = {
  password: {
    minLength: 8,
    maxLength: 256,
  },
};

export const UserValidation = {
  email: (email: string) => {
    if (GeneralValidation.isStringMissing(email)) return ResponseMessage.validation.missingParam('email');
    if (!validator.isEmail(email)) return ResponseMessage.validation.invalidValue('email', 'value');
  },

  password: (password: string) => {
    interface passwordValidationObject { [key: string]: string };
    const passwordValidationMsgs: passwordValidationObject = {};

    if (GeneralValidation.isStringMissing(password)) return ResponseMessage.validation.missingParam('password');
    if (password.length < constraints.password.minLength) {
      passwordValidationMsgs.minLength = ResponseMessage.validation.wrongCharactersAmount('password', 'minimum', constraints.password.minLength);
    }
    if (password.length > constraints.password.maxLength) {
      passwordValidationMsgs.maxLength = ResponseMessage.validation.wrongCharactersAmount('password', 'maximum', constraints.password.maxLength);
    }
    if (!/\d/.test(password)) {
      passwordValidationMsgs.digit = ResponseMessage.validation.missingCharacter('password', 'digit');
    }
    if (!/[A-Z]/.test(password)) {
      passwordValidationMsgs.capital =ResponseMessage.validation.missingCharacter('password', 'capital letter');
    }
    if (!/[a-z]/.test(password)) {
      passwordValidationMsgs.small = ResponseMessage.validation.missingCharacter('password', 'small letter');
    }
    if (!/(?=\S)\W/.test(password)) {
      passwordValidationMsgs.special = ResponseMessage.validation.missingCharacter('password', 'specjal character');
    }
    if (/\s/.test(password)) {
      passwordValidationMsgs.whiteSpace = ResponseMessage.validation.wrongCharacter('password', 'white space');
    }

    if (Object.keys(passwordValidationMsgs).length > 0) return passwordValidationMsgs;
  },
};
