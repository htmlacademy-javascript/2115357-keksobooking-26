'use strict';

const getRandomNumber  = (from = false, to = false, floatsNum = 0) => {

  if (typeof from !== 'number' || typeof to !== 'number') {
    return NaN;
  };

  let fromFloatsNum = 0;
  let toFloatsNum = 0;
  let i = 1;

  let result = [];

  const getFloatsNumber = s => s.indexOf('.') > 0 ? s.length - 2 /* 2 = 0. */ : 0;

  from = Math.abs(from);
  to = Math.abs(to);

  from > to ? [from, to] = [to, from] : false;

  !floatsNum ? (

    from = Math.floor(from),
    to = Math.floor(to)

  ) : (

    /* +1 - avoids +e format */
    fromFloatsNum = getFloatsNumber((from + 1).toString()),
    toFloatsNum = getFloatsNumber((to + 1).toString()),

    !fromFloatsNum && !toFloatsNum ?
      floatsNum = 0 :
      i = fromFloatsNum > toFloatsNum ? 10 ** -fromFloatsNum : 10 ** -toFloatsNum

  );

  while (from <= to) {

    result.push(to);

    to -= i;

  };

  result = result[Math.floor(Math.random() * result.length)];

  return floatsNum ? Math.round(result * 10 ** floatsNum) / 10 ** floatsNum : result;

};

console.log(getRandomNumber());
console.log(getRandomNumber('dd', 1236));
console.log(getRandomNumber(1, []));

console.log(getRandomNumber(0, 13));
console.log(getRandomNumber(13, 1236));
console.log(getRandomNumber(0.01000, 0.001, 3));
console.log(getRandomNumber(0.01000, 0.0001, 4));
console.log(getRandomNumber(0.000000000009, -0.00003, 23));
console.log(getRandomNumber(0.000000000009, -2));
