const getRandomNumber  = (from = false, to = false, floatsNum = 0) => {

  if (typeof from !== 'number' || typeof to !== 'number') {

    return NaN;

  }

  let i = 1;

  from = Math.abs(from);
  to = Math.abs(to);

  if (from > to) {

    [from, to] = [to, from];

  }

  if (!floatsNum) {

    from = Math.floor(from);
    to = Math.floor(to);

  } else {

    const getFloatsNumber = (s) => s.indexOf('.') > 0 ? s.length - 2 /* 2 = 0. */ : 0;

    /* +1 - avoids +e format */
    const fromFloatsNum = getFloatsNumber((from + 1).toString());
    const toFloatsNum = getFloatsNumber((to + 1).toString());

    if (!fromFloatsNum && !toFloatsNum) {

      floatsNum = 0;

    } else {

      i = fromFloatsNum > toFloatsNum ? 10 ** -fromFloatsNum : 10 ** -toFloatsNum;

    }

  }

  let result = [];

  while (from <= to) {

    result.push(to);
    to -= i;

  }

  result = result[Math.floor(Math.random() * result.length)];

  return floatsNum ? Math.round(result * 10 ** floatsNum) / 10 ** floatsNum : result;

};

getRandomNumber();

/*console.log(getRandomNumber());
console.log(getRandomNumber('dd', 1236));
console.log(getRandomNumber(1, []));

console.log(getRandomNumber(0, 13));
console.log(getRandomNumber(13, 1236));
console.log(getRandomNumber(0.01000, 0.001, 3));
console.log(getRandomNumber(0.01000, 0.0001, 4));
console.log(getRandomNumber(0.000000000009, -0.00003, 23));
console.log(getRandomNumber(-2, 0.000000000009));*/
