/* functions START */
const getRandomNumber  = (from = false, to = false, floatsNum = 0) => {
  /* v2.0 */
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
class RandomTextGen {
  /* v2.0 */
  constructor() {
    this.wordsLenFr = '';
    this.wordsLenTo = '';
    this.wordsNumFr = '';
    this.wordsNumTo = '';
    this.sentencesNumFr = '';
    this.sentencesNumTo = '';
    this.getWord = this.getWord.bind(this);
    this.getSentence = this.getSentence.bind(this);
    this.getText = this.getText.bind(this);
  }

  getWord() {
    /* set the symbols set */
    this.abc = 'абвигдаеёожзиайоекалимнопрсеотуиафхцчешощоиаъеыьэиаеюя';
    if (navigator.language !== 'ru') {
      this.abc = 'abacduefeghiyjkolmnuoeupqaooauseaataueyovowuaexayaoezu';
    }
    const wordLen = getRandomNumber(this.wordsLenFr, this.wordsLenTo) || 10;
    const word = [...this.abc].filter((el, id) => [...[...this.abc].keys()]
      .sort(() => Math.random() - 0.5)
      .filter((le, di) => di <= wordLen)
      .includes(id));
    return word.length && word.join('') || this.getWord();
  }

  getSentence() {
    const end = ['.', '?', '!'];
    const wordsNum = getRandomNumber(this.wordsNumFr, this.wordsNumTo) || 5;
    const sentence = Array.from({ length: wordsNum }, this.getWord);
    sentence[0] = sentence[0].slice(0, 1).toUpperCase() + sentence[0].slice(1);
    /* insert some commas */
    sentence.forEach((el, id) => {
      sentence[id] += id !== sentence.length - 1 && getRandomNumber(0, 20) < 2 && ',';
    });
    /* add . ! ? at the end */
    return `${sentence.join(' ')}${end[getRandomNumber(0, 8)] || end[0]}`;
  }

  getText() {
    /* if all vars are set */
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
    const sentenceNum = getRandomNumber(this.sentencesNumFr, this.sentencesNumTo) || 3;
    const text = Array.from({ length: sentenceNum }, this.getSentence);
    return text.join(' ');
  }
}
/* functions END */

/* dataObject START */
/* v1.2 */

/* object consts START */
const DATA_OBJECT_LENGTH = 10;
const PROPERTY_COORDINATES = {
  lat: {
    x: 35.64999,
    y: 35.70001,
  },
  lng: {
    x: 139.69999,
    y: 139.80001,
  },
  floatsNumber: 5,
};
const PROPERTY_PRICE = {
  from: 300,
  to: 300,
  def: 1000,
};
const PROPERTY_ROOMS_NUMBER = {
  from: 1,
  to: 10,
  def: 1,
};
const PROPERTY_TYPE = {
  types: [
    'palace',
    'flat',
    'house',
    'bungalow',
    'hotel',
  ],
};
const PROPERTY_FEATURES = {
  features: [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner',
  ],
};
const PROPERTY_TIME = {
  checkin: [
    '12:00',
    '13:00',
    '14:00',
  ],
  checkout: [
    '12:00',
    '13:00',
    '14:00',
  ],
};
const PROPERTY_CAPACITY = {
  from: 1,
  to: 10,
  def: 2,
};
const AVATAR_IMG_DATA = {
  urlImgNmFr:   1,    /* 0N parts starts from */
  urlImgNmTo:   10,   /* 0N parts up to */
  urlImgNmLn:   2,    /* 0N parts length */
  urlImgNmPfx:  '0',  /* 0N parts prefix */
};
const TITLE_DATA = {
  wordsLenFr:      3,
  wordsLenTo:      10,
  wordsNumFr:      3,
  wordsNumTo:      10,
  sentencesNumFr:  1,
  sentencesNumTo:  1,
};
const DESCRIPTION_DATA = {
  wordsLenFr:      2,
  wordsLenTo:      9,
  wordsNumFr:      4,
  wordsNumTo:      12,
  sentencesNumFr:  4,
  sentencesNumTo:  12,
};
const PHOTOS_DATA = {
  numberFrom: 1,
  numberTo: 20,
  urlBase: 'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/',
  files: [
    'duonguyen-8LrGtIxxa4w.jpg',
    'brandon-hoogenboom-SNxQGWxZQi0.jpg',
    'claire-rendall-b6kAwr1i0Iw.jpg.',
  ],
};
/* object consts END */

/* object data getters START */
const randomTextGen = new RandomTextGen();
class AvatarImgUrlGen {
  constructor() {
    this.urlImgNmFr = '';
    this.urlImgNmTo = '';
    this.urlImgNmLn = '';
    this.urlImgNmPfx = '';
    this.counter =  []; /* 0N parts container */
    this.fillCounter = this.fillCounter.bind(this);
    this.urlImgMask = this.urlImgMask.bind(this);
    this.getUrl = this.getUrl.bind(this);
  }

  /* get the 0N parts of urls */
  fillCounter() {
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
  }

  urlImgMask() {
    /* the mask gets a 0N part from the container untill it's empty, then the container refills */
    return `img/avatars/user${this.counter.pop()}.png`;
  }

  getUrl() {
    /* fills/refills the counter */
    if (!this.counter.length) {
      this.fillCounter();
    }
    return this.urlImgMask();
  }
}
const avatarImgUrlGen = new AvatarImgUrlGen();
const getAvatar = () => {
  Object.assign(avatarImgUrlGen, AVATAR_IMG_DATA);
  return avatarImgUrlGen.getUrl();
};
const getPhotos = () => Array.from(
  { length: getRandomNumber(PHOTOS_DATA.numberFrom, PHOTOS_DATA.numberTo) },
  () => `${PHOTOS_DATA.urlBase}${PHOTOS_DATA.files[getRandomNumber(0, PHOTOS_DATA.files.length - 1)]}`
);
const getFeatures = () => {
  const res =  PROPERTY_FEATURES.features
    .filter((el, id) => [...String(getRandomNumber(0, 10 ** PROPERTY_FEATURES.features.length - 1))]
      .includes(String(id)));
  return res.length && res || PROPERTY_FEATURES.features[0];
};
const getTitle = () => {
  Object.assign(randomTextGen, TITLE_DATA);
  return randomTextGen.getText();
};
const getDescription = () => {
  Object.assign(randomTextGen, DESCRIPTION_DATA);
  return randomTextGen.getText();
};
/* object data getters END */

/* object lines constructor START */
const createDataObjectValue = () => {
  const newLine = {
    author: {
      avatar:       getAvatar(),
    },
    offer: {
      title:        getTitle(),
      address:      '',
      price:        getRandomNumber(PROPERTY_PRICE.from, PROPERTY_PRICE.to) || PROPERTY_PRICE.def,
      type:         PROPERTY_TYPE.types[getRandomNumber(0, PROPERTY_TYPE.types.length - 1)] || PROPERTY_TYPE.types[0],
      rooms:        getRandomNumber(PROPERTY_ROOMS_NUMBER.from, PROPERTY_ROOMS_NUMBER.to) || PROPERTY_ROOMS_NUMBER.def,
      guests:       getRandomNumber(PROPERTY_CAPACITY.from, PROPERTY_CAPACITY.to) || PROPERTY_CAPACITY.def,
      checkin:      PROPERTY_TIME.checkin[getRandomNumber(0, PROPERTY_TIME.checkin.length - 1)] || PROPERTY_TIME.checkin[0],
      checkout:     PROPERTY_TIME.checkout[getRandomNumber(0, PROPERTY_TIME.checkout.length - 1)] || PROPERTY_TIME.checkout[0],
      features:     getFeatures(),
      description:  getDescription(),
      photos:       getPhotos(),
    },
    location: {
      lat:          getRandomNumber(PROPERTY_COORDINATES.lat.x, PROPERTY_COORDINATES.lat.y, PROPERTY_COORDINATES.floatsNumber),
      lng:          getRandomNumber(PROPERTY_COORDINATES.lng.x, PROPERTY_COORDINATES.lng.y, PROPERTY_COORDINATES.floatsNumber),
    },
  };
  /* temporary adress line, same as the coordinates */
  newLine.offer.address = `${newLine.location.lat}, ${newLine.location.lng}`;
  return newLine;
};
/* object lines constructor END */

/* object constructor START */
const dataObject = Array.from({ length: DATA_OBJECT_LENGTH }, createDataObjectValue);
/* object constructor END */

/* dataObject END */

/* linter temp */
Object.entries(dataObject);
