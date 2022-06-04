/* v2.0 */
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

/* v1.0 */
function getRandomTextString() {

  if (
    !this.wordsLenFr ||
    !this.wordsLenTo ||
    !this.wordsNumFr ||
    !this.wordsNumTo ||
    !this.sentencesNumFr ||
    !this.sentencesNumTo
  ) {
    return '';
  }

  /* set the symbols set */
  this.abc = 'абвигдаеёожзиайоекалимнопрсеотуиафхцчешощоиаъеыьэиаеюя';

  if (navigator.language !== 'ru') {
    this.abc = 'abacduefeghiyjkolmnuoeupqaooauseaataueyovowuaexayaoezu';
  }

  const getWord = () => {

    const wordLen = getRandomNumber(this.wordsLenFr, this.wordsLenTo) || 10;

    const word = [...this.abc].filter((el, id) => [...[...this.abc].keys()]
      .sort(() => Math.random() - 0.5)
      .filter((le, di) => di <= wordLen)
      .includes(id));

    return word.length && word.join('') || getWord();

  };

  const getSentence = () => {

    const end = ['.', '?', '!'];

    const wordsNum = getRandomNumber(this.wordsNumFr, this.wordsNumTo) || 5;

    const sentence = Array.from({ length: wordsNum }, getWord);

    sentence[0] = sentence[0].slice(0, 1).toUpperCase() + sentence[0].slice(1);

    /* insert some commas */
    sentence.forEach((el, id) => {

      sentence[id] += id !== sentence.length - 1 && getRandomNumber(0, 20) < 2 && ',';

    });

    /* add . ! ? at the end */
    return `${sentence.join(' ')}${end[getRandomNumber(0, 8)] || end[0]}`;
  };

  const getText = () => {

    const sentenceNum = getRandomNumber(this.sentencesNumFr, this.sentencesNumTo) || 3;

    const text = Array.from({ length: sentenceNum }, getSentence);

    return text.join(' ');

  };

  return getText();

}

/* dataObject v1.0 */

const title = {

  wordsLenFr:      3,
  wordsLenTo:      10,
  wordsNumFr:      3,
  wordsNumTo:      10,
  sentencesNumFr:  1,
  sentencesNumTo:  1,
  getTitle: getRandomTextString,

};

const description = {

  wordsLenFr:      2,
  wordsLenTo:      9,
  wordsNumFr:      4,
  wordsNumTo:      12,
  sentencesNumFr:  4,
  sentencesNumTo:  12,
  getDesrp: getRandomTextString,

};

const type = [

  'palace',
  'flat',
  'house',
  'bungalow',
  'hotel',

];

const checkin = [

  '12:00',
  '13:00',
  '14:00',

];

const checkout = [

  '12:00',
  '13:00',
  '14:00',

];

const features = [

  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner',

];

const getFeatures = () => {

  const res =  features
    .filter((el, id) => [...String(getRandomNumber(0, 10 ** features.length - 1))]
      .includes(String(id)));

  return res.length && res || features[0];

};

const photos = [

  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking',

  '/duonguyen-8LrGtIxxa4w.jpg',
  '/brandon-hoogenboom-SNxQGWxZQi0.jpg',
  '/claire-rendall-b6kAwr1i0Iw.jpg.',

];

const getPhotos = () => Array.from(
  { length: getRandomNumber(1, 20) },
  () => `${photos[0]}${photos[getRandomNumber(1, photos.length - 1)]}`
);

const avatarImgUrlGen = {

  urlImgNmFr: 1,      /* 0n parts starts from */
  urlImgNmTo: 10,     /* 0n parts ends with */
  urlImgNmLn: 2,      /* 0n parts length */
  urlImgNmPfx: '0',   /* 0n parts prefix */
  counter: [],        /* 0n parts container */

  urlImgMask: function () {

    /* the mask gets a 0n part from the container untill it's empty, then the container refills */
    return `img/avatars/user${this.counter.pop()}.png`;
  },

  /* get the 0n parts of urls */
  fillCounter: function () {

    let i = this.urlImgNmFr;

    this.counter = Array.from(
      { length: this.urlImgNmTo },
      () => {
        const n = String(i).length < this.urlImgNmLn ? `${this.urlImgNmPfx}${i}` : `${i}`;
        i++;
        return n;
      }
    );

    /* shaffle counter */
    this.counter.sort(() => Math.random() - 0.5);

  },

  getUrl: function () {

    /* fills/refills the counter */
    if (!this.counter.length) {
      this.fillCounter();
    }

    return this.urlImgMask();

  },

};

const createDataObjectValue = () => {

  const newLine = {

    author: {
      avatar: avatarImgUrlGen.getUrl(),
    },

    offer: {
      title:        title.getTitle(),
      address:      '',
      price:        getRandomNumber(300, 10000) || 1000,
      type:         type[getRandomNumber(0, type.length - 1)] || type[0],
      rooms:        getRandomNumber(1, 10) || 1,
      guests:       getRandomNumber(1, 10) || 2,
      checkin:      checkin[getRandomNumber(0, checkin.length - 1)] || checkin[0],
      checkout:     checkout[getRandomNumber(0, checkout.length - 1)] || checkout[0],
      features:     getFeatures(),
      description:  description.getDesrp(),
      photos:       getPhotos(),
    },

    location: {
      lat:          getRandomNumber(35.64999, 35.70001, 5),
      lng:          getRandomNumber(139.69999, 139.80001, 5),
    },

  };

  /* temporary adress line is same as the coordinates */
  newLine.offer.address = `${newLine.location.lat}, ${newLine.location.lng}`;

  return newLine;

};

const dataObject = Array.from({ length: 10 }, createDataObjectValue);

/* end of dataObject */

/* temp */
/* for error  'dataObject' is assigned a value but never used  */
/* error  Expected an assignment or function call and instead saw an expression */
Object.entries(dataObject);
