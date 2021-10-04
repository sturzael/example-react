import { CompareFn } from 'antd/lib/table/interface';
import { isArray, isNumber, isObjectLike } from 'lodash';

type Key = string | string[];

export default function sorter<T>(key: Key): CompareFn<T> {
  return function compareFunction(a: T, b: T) {
    const property = isArray(key) ? key.join('.') : key;

    const AValue = a[property];
    const BValue = b[property];

    const isValueObjectLike = isObjectLike(AValue) || isObjectLike(BValue);

    if (isValueObjectLike) {
      console.error(
        'Cannot sort object like values, be sure that the property being sorted is a primitive.',
      );
      return 0;
    }

    const isABNumber = isNumber(AValue) && isNumber(BValue);

    if (isABNumber) {
      return +AValue - +BValue;
    }

    // toString in case one is number and another a string
    const A = AValue.toString().toUpperCase().trim();
    const B = BValue.toString().toUpperCase().trim();

    if (A > B) {
      return 1;
    }

    if (A < B) {
      return -1;
    }

    return 0;
  };
}
