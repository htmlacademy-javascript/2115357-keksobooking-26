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
  const pow10x = 10;

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
      return s.indexOf('.') > 0 ? s.length - s.indexOf('.') - 1 : 0;

    };

    /* get a number of digits after the period to calculate the increment*/
    const fromFloatsNum = getFloatsNumber(from);
    const toFloatsNum = getFloatsNumber(to);

    if (!fromFloatsNum && !toFloatsNum) {

      /* if none of the vars is a float, gets it back to ints, i remains 1 */
      floatsNum = 0;

    } else {

      /* gets the value of the increment */
      i = fromFloatsNum > toFloatsNum ? pow10x ** -fromFloatsNum : pow10x ** -toFloatsNum;

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
  return floatsNum ? Math.round(result * pow10x ** floatsNum) / pow10x ** floatsNum : result;

};

getRandomNumber();
