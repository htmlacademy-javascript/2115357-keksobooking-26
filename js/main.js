const getRandomNumber  = (from = false, to = false, floatsNum = 0) => {

  /* if all vars are numbers */
  if (typeof from !== 'number' || typeof to !== 'number') {

    return NaN;

  }

  if (floatsNum && typeof floatsNum !== 'number') {

    return NaN;

  }

  /**/

  /* convert a float to an int and back */
  const getXtoPow = (y) => 10 ** y;

  const getFloatsNumber = (s) => {

    /* to avoid +e format +100,
    +100 doesn't get (e.g.) 0.59 to 0.58999999999999, +1 does */
    s = (s + 100).toString();

    /* gets a number of digits after the period (23.34455 - 5) */
    return s.indexOf('.') > 0 ? s.length - s.indexOf('.') - 1 : 0;

  };

  /**/

  /* normalize the order of the vars */
  from = Math.abs(from);
  to = Math.abs(to);

  if (from > to) {

    [from, to] = [to, from];

  }

  /**/

  /* result = Round(from + randomNumberFromDifference(from-to)Range) */

  /* get range */
  let result = to - from;

  /* range to int (e.g. 32.00231 * 100000) */
  result = floatsNum ? result * getXtoPow(getFloatsNumber(from)) : result;

  /* random number from range (0-range) */
  result = Math.floor(Math.random() * (result + 1));

  /* random number back to float (e.g. 100231 / 100000) */
  result = floatsNum ? result / getXtoPow(getFloatsNumber(from)) : result;

  /* the sum: */
  result = from + result;

  /* round to floatsNum, e.g.: round(12.099799 * 100) = 1210 / 100 = 12.10 */
  return floatsNum ?
    Math.round(result * getXtoPow(floatsNum)) / getXtoPow(floatsNum) :
    Math.floor(result);

};
