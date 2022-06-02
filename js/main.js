const getRandomNumber  = (from = false, to = false, floatsNum = 0) => {

  /* if all vars are numbers */
  if (typeof from !== 'number' || typeof to !== 'number') {

    return NaN;

  }

  if (floatsNum && typeof floatsNum !== 'number') {

    return NaN;

  }
  /**/

  /* i - an increment to calculate the range of numbers,
  !floatsNum ? i = 1 : i = 0.001, or 0,00001 etc. */
  let i = 1;

  /* normalize the order of the vars */
  from = Math.abs(from);
  to = Math.abs(to);

  if (from > to) {

    [from, to] = [to, from];

  }
  /**/

  if (!floatsNum) {

    /*if ints*/

    from = Math.floor(from);
    to = Math.floor(to);

  } else {

    /*if floats*/

    const getFloatsNumber = (s) => {

      /* +1 - avoids +e format */
      s = (s + 1).toString();

      /* number of digits after the period */
      return s.indexOf('.') > 0 ? s.length - 2 : 0; /* -2 = 0. */

    };

    /* get a number of digits after the period to calculate the increment*/
    const fromFloatsNum = getFloatsNumber(from);
    const toFloatsNum = getFloatsNumber(to);

    if (!fromFloatsNum && !toFloatsNum) {

      /* if none of the vars is a float, gets it back to ints, i=1 */
      floatsNum = 0;

    } else {

      /* gets the value of the increment */
      i = fromFloatsNum > toFloatsNum ? 10 ** -fromFloatsNum : 10 ** -toFloatsNum;

    }

  }

  let result = [];

  while (from <= to) {

    /* gets the array of all values in the range */
    result.push(to);
    to -= i;

  }

  /* gets a random value */
  result = result[Math.floor(Math.random() * result.length)];

  /* returns a rounded float or a whole int */
  return floatsNum ? Math.round(result * 10 ** floatsNum) / 10 ** floatsNum : result;

};

getRandomNumber();

/*console.log(getRandomNumber());
console.log(getRandomNumber('dd', 1236));
console.log(getRandomNumber(1, []));
console.log(getRandomNumber(0.01000, 0.001, {}));

console.log(getRandomNumber(0, 13));
console.log(getRandomNumber(13, 1236));
console.log(getRandomNumber(0.01000, 0.001, 3));
console.log(getRandomNumber(0.01000, 0.0001, 4));
console.log(getRandomNumber(0.000000000009, -0.00003, 23));
console.log(getRandomNumber(-2, 0.000000000009));*/
