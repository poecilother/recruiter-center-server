import { Request } from 'express';
import lodash from 'lodash';

export const GeneralValidation = {
  isStringMissing: (value: string) => {
    if (value === undefined || value === null) return true;
    if (value.length === 0) true;
    return false;
  },

  isRequestBodyMissing: (req: Request) => {
    if (req.body === undefined || req.body === null) return true;
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) return true;
    return false;
  },

  checkObjectKeys: (object: object, arrayOfKeys: Array<string>) => {
    if(!lodash.isEqual(Object.keys(object).sort(), arrayOfKeys.sort())) return false;
    return true;
  },
};
