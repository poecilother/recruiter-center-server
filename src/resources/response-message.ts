export const ResponseMessage = {
  general: {
    error: 'Something went wrong. Try again later.',
    wrongCredentials: 'Wrong credentials provided.',
  },

  validation: {
    invalidValue: (param: string, value: string, validValue?: string) => {
      return `${ capitalize(param) } has invalid ${ value }.${ validValue ? ` Expected ${ validValue }.` : '' }`;
    },
    missingParam: (param: string) => {
      return `${ capitalize(param) } is missing.`;
    },
    valueAlreadyInUse: (param: string) => {
      return `${ capitalize(param) } is already in use.`;
    },
    wrongCharactersAmount: (param: string, amountType: string, amountLimit: number) => {
      return `${ capitalize(param) } can has ${ amountType } ${ amountLimit } character${ amountLimit === 1 ? '' : 's' }.`;
    },
    missingCharacter: (param: string, character: string) => {
      return `${ capitalize(param) } must have at least one ${ character }.`;
    },
    wrongCharacter: (param: string, character: string) => {
      return `${ capitalize(param) } can't have any ${ character }.`;
    },
  },
}

function capitalize(word: string) {
  return word[0].toLocaleUpperCase() + word.slice(1);
};
