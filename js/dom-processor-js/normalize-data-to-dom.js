/* CONTS */
import {getLang} from '../functions.js';

const LANG = getLang();
const LOCAL = {
  numDeclen: {
    1: 1,
    4: 4,
    5: 5,
    21: 21,
    31: 31,
  },
  ru: {
    titleLength: {
      part1: 'Минимальная',
      part2: 'Максимальная',
      part3: 'длинна заголовка',
      part4: 'символов.',
    },
    requiredFieldText: {
      part1: 'Это обязательное поле'
    },
    minPrice: {
      part1: 'Минимальная цена:',
      part2: 'максимальная цена:',
    },
    imgAlt:   'Фотография жилья',
    before:   'до',
    after:    'после',
    checkout: 'Выезд',
    checkin:  'Заезд',
    price:    '₽/ночь',
    flat:     'Квартира',
    bungalow: 'Бунгало',
    house:    'Дом',
    palace:   'Дворец',
    hotel:    'Отель',
    for:  'для',
    roomsWord:    {
      1:  'комната',
      4:  'комнаты',
      5:  'комнат',
    },
    guestsWord:    {
      1:  'гостя',
      4:  'гостей',
      5:  'гостей',
    },
    1200: '12:00',
    1300: '13:00',
    1400: '14:00',
  },
  en: {
    titleLength: {
      part1: 'Minimum',
      part2: 'Maximum',
      part3: 'title length is',
      part4: 'symbols.',
    },
    requiredFieldText: {
      part1: 'This field is required'
    },
    minPrice: {
      part1: 'Min. price:',
      part2: 'Max. price:',
    },
    imgAlt:   'Property photo',
    before:   'before',
    after:    'after',
    checkout: 'Check-out',
    checkin:  'Check-in',
    price:    '$/night',
    flat:     'Flat',
    bungalow: 'Bungalow',
    house:    'House',
    palace:   'Palace',
    hotel:    'Hotel',
    for:  'for',
    roomsWord:    {
      1:  'room',
      4:  'rooms',
      5:  'rooms',
    },
    guestsWord:    {
      1:  'guest',
      4:  'guests',
      5:  'guests',
    },
    1200: '12:00',
    1300: '13:00',
    1400: '14:00',
  },
  lineJoin: [
    ',',
    ' ',
    '.',
    ':',
  ],
};

/* data to DOM normalizer v1.0 */
const normalizeDataToDOM = (data, ...templates) => {

  /* normalizes data for the whole project - missing parts should be added */
  /* in this case normalized data should be added to the Dom calss for each template / element */

  /* or it is to be devided into smaller parts for each template */

  /* now it normalizes data for each template / element manually */
  /* now normalized data are separated from the Dom calss */

  /* normalized data are stored to data.templates[templName] for each template sent */
  /* original data remains */

  data.templates = {};
  templates.forEach((templName) => {
    switch (templName) {
      /* normalizes data for the 'card' template START */
      case 'card':
        data.templates[templName] = {};
        data.templates[templName].title = data.offer.title && data.offer.title  || '';
        data.templates[templName].description = data.offer.description && data.offer.description || '';
        data.templates[templName].address = data.offer.address && data.offer.address || '';
        data.templates[templName].price = data.offer.price && `${data.offer.price.toLocaleString()}${LOCAL.lineJoin[1]}${LOCAL[LANG]['price']}` || '';
        data.templates[templName].type = data.offer.type && LOCAL[LANG][data.offer.type] || '';
        switch (true) {
          case data.offer.rooms === LOCAL.numDeclen[1]:
          case data.offer.rooms === LOCAL.numDeclen[21]:
          case data.offer.rooms === LOCAL.numDeclen[31]:
            data.templates[templName].rooms = `${data.offer.rooms}${LOCAL.lineJoin[1]}${LOCAL[LANG]['roomsWord'][LOCAL.numDeclen[1]]}`;
            break;
          case data.offer.rooms > LOCAL.numDeclen[1] && data.offer.rooms <= LOCAL.numDeclen[4]:
            data.templates[templName].rooms = `${data.offer.rooms}${LOCAL.lineJoin[1]}${LOCAL[LANG]['roomsWord'][LOCAL.numDeclen[4]]}`;
            break;
          case data.offer.rooms >= LOCAL.numDeclen[5]:
            data.templates[templName].rooms = `${data.offer.rooms}${LOCAL.lineJoin[1]}${LOCAL[LANG]['roomsWord'][LOCAL.numDeclen[5]]}`;
            break;
          default:
            data.templates[templName].rooms = '';
        }
        switch (true) {
          case data.offer.guests === LOCAL.numDeclen[1]:
          case data.offer.guests === LOCAL.numDeclen[21]:
          case data.offer.guests === LOCAL.numDeclen[31]:
            data.templates[templName].guests = `${data.offer.guests}${LOCAL.lineJoin[1]}${LOCAL[LANG]['guestsWord'][1]}`;
            break;
          case data.offer.guests > LOCAL.numDeclen[1] && data.offer.guests <= LOCAL.numDeclen[4]:
            data.templates[templName].guests = `${data.offer.guests}${LOCAL.lineJoin[1]}${LOCAL[LANG]['guestsWord'][4]}`;
            break;
          case data.offer.guests >= LOCAL.numDeclen[5]:
            data.templates[templName].guests = `${data.offer.guests}${LOCAL.lineJoin[1]}${LOCAL[LANG]['guestsWord'][5]}`;
            break;
          default:
            data.templates[templName].guests = '';
        }
        data.templates[templName].capacity =
          data.templates[templName].rooms && data.templates[templName].guests &&
          `${data.templates[templName].rooms}${LOCAL.lineJoin[1]}${LOCAL[LANG].for}${LOCAL.lineJoin[1]}${data.templates[templName].guests}${LOCAL.lineJoin[2]}`
          ||
          '';
        delete data.templates[templName].rooms;
        delete data.templates[templName].guests;
        data.templates[templName].checkin = data.offer.checkin && `${LOCAL[LANG].checkin}${LOCAL.lineJoin[1]}${LOCAL[LANG].after}${LOCAL.lineJoin[3]}${LOCAL.lineJoin[1]}${data.offer.checkin}${LOCAL.lineJoin[2]}` || '';
        data.templates[templName].checkout = data.offer.checkout && `${LOCAL[LANG].checkout}${LOCAL.lineJoin[1]}${LOCAL[LANG].before}${LOCAL.lineJoin[3]}${LOCAL.lineJoin[1]}${data.offer.checkout}${LOCAL.lineJoin[2]}` || '';
        data.templates[templName].time =
          data.templates[templName].checkin && data.templates[templName].checkout &&
          `${data.templates[templName].checkin}${LOCAL.lineJoin[1]}${data.templates[templName].checkout}`
          ||
          '';
        delete data.templates[templName].checkin;
        delete data.templates[templName].checkout;
        data.templates[templName].features = data.offer.features.length && data.offer.features.join(`${LOCAL.lineJoin[0]}${LOCAL.lineJoin[1]}`) || '';
        data.templates[templName].photos = data.offer.photos.length && data.offer.photos || [];
        data.templates[templName].avatar = data.author.avatar && data.author.avatar || '';
        break;
      /* normalizes data for the 'card' template END */
    }
  });
  return data;
};

const getLocalText = (property, lang = getLang()) => {
  return LOCAL[lang][property] || '';
};

export { getLocalText };
export { normalizeDataToDOM };
