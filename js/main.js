/* functions START */
import {getRandomNumber}    from './functions.js';
import {getRandomText}      from './functions.js';
/* functions END */

/* adsObject START */
/* v1.2 */

/* ads consts START */
const ADS_DATA = {
  NUMBER_MIN: 1,
  NUMBER_MAX: 10,
  PARAM: {
    avatar: {
      countFrom: 0,
      countTo:   0,
      partLn:   2,
      partPrfx:  0,
      urlMask: {
        start:      'img/avatars/user',
        end:        '.png',
      },
    },
    title: {
      wordsLenFr:      3,
      wordsLenTo:      10,
      wordsNumFr:      3,
      wordsNumTo:      10,
      sentencesNumFr:  1,
      sentencesNumTo:  1,
    },
    description: {
      wordsLenFr:      2,
      wordsLenTo:      9,
      wordsNumFr:      4,
      wordsNumTo:      12,
      sentencesNumFr:  4,
      sentencesNumTo:  12,
    },
    photos: {
      numberFrom: 1,
      numberTo: 20,
      urlBase: 'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/',
      files: [
        'duonguyen-8LrGtIxxa4w.jpg',
        'brandon-hoogenboom-SNxQGWxZQi0.jpg',
        'claire-rendall-b6kAwr1i0Iw.jpg.',
      ],
    },
  },
  PROPERTY: {
    coordinates: {
      lat: {
        x: 35.64999,
        y: 35.70001,
      },
      lng: {
        x: 139.69999,
        y: 139.80001,
      },
      floatsNumber: 5,
    },
    price: {
      from: 300,
      to: 300,
      def: 1000,
    },
    roomsNumber: {
      from: 1,
      to: 10,
      def: 1,
    },
    type: {
      names: [
        'palace',
        'flat',
        'house',
        'bungalow',
        'hotel',
      ],
    },
    features: {
      names: [
        'wifi',
        'dishwasher',
        'parking',
        'washer',
        'elevator',
        'conditioner',
      ],
    },
    time: {
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
    },
    capacity: {
      from: 1,
      to: 10,
      def: 2,
    },
  },
};
/* ads consts END */

/* ads data getters START */
const getAdsNum = () => {
  const adsNum = ADS_DATA.NUMBER_MAX - ADS_DATA.NUMBER_MIN + 1;
  return adsNum > 0 && adsNum || 0;
};

class AvatarImgUrlGen {
  /* generates an url with a 0N part, e.g. xxx02xxx
    {
      countFrom:  1,    starts from, number, def - 1
      countTo:    10,   ends with, number,
      partLn:     2,    0N parts length (e.g. 3 - 003, 2 - 02), def - 2
      partPrfx:   '0',  0N prefix, string, def - '0'
      urlMask: {
        start:  `/path/files/file`, - url start
        end:    `.ext`, - url end
      },
    }
  */
  constructor() {
    this.consts = {
      PARAMS_DEF: {
        countFrom:   1,
        countTo:   10,
        partLn:   2,
        partPrfx:  '0',
        urlMask: {
          start:      'path/files/file',
          end:        '.ext',
        },
      },
    };
    this.params = Object.assign({}, this.consts.PARAMS_DEF);
    /* parts container */
    this.container =  [];
    this.fillContainer = this.fillContainer.bind(this);
    this.getUrl = this.getUrl.bind(this);
  }

  /* get the 0N parts of urls */
  fillContainer() {
    /* if all params set */
    (() => {
      const params = Object.assign({}, this.params);
      /* URL_MASK - strings */
      if (String(params.urlMask.start).length && String(params.urlMask.end).length) {
        params.urlMask = 1;
      }
      /* prefix - enything */
      params.partPrfx = 1;
      /* the rest are numbers */
      if (Object.values(params).filter((el) => typeof el !== 'number').length !== 0) {
        /* if not fills with defs */
        this.params = Object.assign({}, this.consts.PARAMS_DEF);
      }
    })();
    let i = this.params.countFrom;
    this.container = Array.from(
      { length: this.params.countTo },
      () => {
        const n = String(i).length < this.params.partLn ? `${this.params.partPrfx}${i}` : `${i}`;
        i++;
        return n;
      }
    );
    /* shaffle container */
    this.container.sort(() => Math.random() - 0.5);
  }

  getUrl() {
    /* fills/refills the container */
    if (!this.container.length) {
      this.fillContainer();
    }
    /* gets an url from the container untill it's empty, then the container refills */
    return `${this.params.urlMask.start}${this.container.pop()}${this.params.urlMask.end}`;
  }
}
const avatarImgUrlGen = new AvatarImgUrlGen();
const getAvatar = () => {
  if (!ADS_DATA.PARAM.avatar.countFrom) {
    ADS_DATA.PARAM.avatar.countFrom = ADS_DATA.NUMBER_MIN;
    ADS_DATA.PARAM.avatar.countTo = getAdsNum();
    Object.assign(avatarImgUrlGen.params, ADS_DATA.PARAM.avatar);
  }
  return avatarImgUrlGen.getUrl();
};
const getPhotos = () => Array.from(
  { length: getRandomNumber(ADS_DATA.PARAM.photos.numberFrom, ADS_DATA.PARAM.photos.numberTo) },
  () => `${ADS_DATA.PARAM.photos.urlBase}${ADS_DATA.PARAM.photos.files[getRandomNumber(0, ADS_DATA.PARAM.photos.files.length - 1)]}`
);
const getFeatures = () => {
  const tenToPow = 10;
  const res = ADS_DATA.PROPERTY.features.names
    .filter((el, id) => [...String(getRandomNumber(0, tenToPow ** ADS_DATA.PROPERTY.features.names.length - 1))]
      .includes(String(id)));
  return res.length && res || ADS_DATA.PROPERTY.features.names[0];
};
const getTitle = () => {
  return getRandomText(ADS_DATA.PARAM.title);
};
const getDescription = () => {
  return getRandomText(ADS_DATA.PARAM.description);
};
/* ads data getters END */

/* ad constructor START */
const createAd = () => {
  const newAd = {
    author: {
      avatar:       getAvatar(),
    },
    offer: {
      title:        getTitle(),
      address:      '',
      price:        getRandomNumber(ADS_DATA.PROPERTY.price.from, ADS_DATA.PROPERTY.price.to) || ADS_DATA.PROPERTY.price.def,
      type:         ADS_DATA.PROPERTY.type.names[getRandomNumber(0, ADS_DATA.PROPERTY.type.names.length - 1)] || ADS_DATA.PROPERTY.type.names[0],
      rooms:        getRandomNumber(ADS_DATA.PROPERTY.roomsNumber.from, ADS_DATA.PROPERTY.roomsNumber.to) || ADS_DATA.PROPERTY.roomsNumber.def,
      guests:       getRandomNumber(ADS_DATA.PROPERTY.capacity.from, ADS_DATA.PROPERTY.capacity.to) || ADS_DATA.PROPERTY.capacity.def,
      checkin:      ADS_DATA.PROPERTY.time.checkin[getRandomNumber(0, ADS_DATA.PROPERTY.time.checkin.length - 1)] || ADS_DATA.PROPERTY.time.checkin[0],
      checkout:     ADS_DATA.PROPERTY.time.checkout[getRandomNumber(0, ADS_DATA.PROPERTY.time.checkout.length - 1)] || ADS_DATA.PROPERTY.time.checkout[0],
      features:     getFeatures(),
      description:  getDescription(),
      photos:       getPhotos(),
    },
    location: {
      lat:          getRandomNumber(ADS_DATA.PROPERTY.coordinates.lat.x, ADS_DATA.PROPERTY.coordinates.lat.y, ADS_DATA.PROPERTY.coordinates.floatsNumber),
      lng:          getRandomNumber(ADS_DATA.PROPERTY.coordinates.lng.x, ADS_DATA.PROPERTY.coordinates.lng.y, ADS_DATA.PROPERTY.coordinates.floatsNumber),
    },
  };
  /* temporary adress line, same as the coordinates */
  newAd.offer.address = `${newAd.location.lat}, ${newAd.location.lng}`;
  return newAd;
};
/* ad constructor END */

/* ads constructor START */
const ads = Array.from({ length: getAdsNum() }, createAd);
/* ads constructor END */

/* adsObject END */

/* linter temp */
console.log(Object.entries(ads));
