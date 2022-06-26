/* get the language */
const getLang = () => navigator.language === 'ru' ? 'ru' : 'en';

const LANG = getLang();
const LOCAL = {
  /*for declension words written with numbers */
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
      part1: 'Это обязательное поле',
    },
    refreshSimilarAdsButton: 'Ошибка загрузки объявлений. Нажмите для повтора',
    serverResponseOkText: {
      part1: 'Ваше объявление',
      part2: 'успешно размещено!',
    },
    serverResponseErrorText: {
      part1: 'Ошибка размещения объявления',
      part2: 'Попробовать снова',
    },
    propertySideError: {
      part1: 'Это размещение не может принять такое кол-во гостей',
    },
    guestsSideError: {
      part1: 'Неподходящее кол-во гостей для этого размещения',
    },
    notSuitableForThatNumberOfGuests: {
      part1: 'Размещение не предназначено для такого кол-ва гостей'
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
    not:  'не',
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
    refreshSimilarAdsButton: 'Ads loading error. Click to try again',
    serverResponseOkText: {
      part1: 'Your ad',
      part2: 'has been successfully posted!',
    },
    serverResponseErrorText: {
      part1: 'Posting failed',
      part2: 'Try again',
    },
    propertySideError: {
      part1: 'This property cannot accommodate that many guests',
    },
    guestsSideError: {
      part1: 'Inappropriate number of guests for this property',
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
    not:  'not',
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

const normalizeCardTemplate = (data, templateNickName) => {
  data.templates = {};
  switch (templateNickName) {
    /* normalizes data for the 'card' template START */
    case 'card':
      data.templates[templateNickName] = {};
      data.templates[templateNickName].title = data.offer.title && data.offer.title || '';
      data.templates[templateNickName].description = data.offer.description && data.offer.description || '';
      data.templates[templateNickName].address = data.offer.address && data.offer.address || '';
      data.templates[templateNickName].price = data.offer.price && `${data.offer.price.toLocaleString()}${LOCAL.lineJoin[1]}${LOCAL[LANG]['price']}` || '';
      data.templates[templateNickName].type = data.offer.type && LOCAL[LANG][data.offer.type] || '';
      switch (true) {
        case data.offer.rooms === LOCAL.numDeclen[1]:
        case data.offer.rooms === LOCAL.numDeclen[21]:
        case data.offer.rooms === LOCAL.numDeclen[31]:
          data.templates[templateNickName].rooms = `${data.offer.rooms}${LOCAL.lineJoin[1]}${LOCAL[LANG]['roomsWord'][LOCAL.numDeclen[1]]}`;
          break;
        case data.offer.rooms > LOCAL.numDeclen[1] && data.offer.rooms <= LOCAL.numDeclen[4]:
          data.templates[templateNickName].rooms = `${data.offer.rooms}${LOCAL.lineJoin[1]}${LOCAL[LANG]['roomsWord'][LOCAL.numDeclen[4]]}`;
          break;
        case data.offer.rooms >= LOCAL.numDeclen[5]:
          data.templates[templateNickName].rooms = `${data.offer.rooms}${LOCAL.lineJoin[1]}${LOCAL[LANG]['roomsWord'][LOCAL.numDeclen[5]]}`;
          break;
        default:
          data.templates[templateNickName].rooms = '';
      }
      switch (true) {
        case data.offer.guests === LOCAL.numDeclen[1]:
        case data.offer.guests === LOCAL.numDeclen[21]:
        case data.offer.guests === LOCAL.numDeclen[31]:
          data.templates[templateNickName].guests = `${data.offer.guests}${LOCAL.lineJoin[1]}${LOCAL[LANG]['guestsWord'][1]}`;
          break;
        case data.offer.guests > LOCAL.numDeclen[1] && data.offer.guests <= LOCAL.numDeclen[4]:
          data.templates[templateNickName].guests = `${data.offer.guests}${LOCAL.lineJoin[1]}${LOCAL[LANG]['guestsWord'][4]}`;
          break;
        case data.offer.guests >= LOCAL.numDeclen[5]:
          data.templates[templateNickName].guests = `${data.offer.guests}${LOCAL.lineJoin[1]}${LOCAL[LANG]['guestsWord'][5]}`;
          break;
        default:
          data.templates[templateNickName].guests = '';
      }
      data.templates[templateNickName].capacity =
        data.templates[templateNickName].rooms && data.templates[templateNickName].guests &&
        `${data.templates[templateNickName].rooms}${LOCAL.lineJoin[1]}${LOCAL[LANG].for}${LOCAL.lineJoin[1]}${data.templates[templateNickName].guests}${LOCAL.lineJoin[2]}`
        ||
        '';
      delete data.templates[templateNickName].rooms;
      delete data.templates[templateNickName].guests;
      data.templates[templateNickName].checkin = data.offer.checkin && `${LOCAL[LANG].checkin}${LOCAL.lineJoin[1]}${LOCAL[LANG].after}${LOCAL.lineJoin[3]}${LOCAL.lineJoin[1]}${data.offer.checkin}${LOCAL.lineJoin[2]}` || '';
      data.templates[templateNickName].checkout = data.offer.checkout && `${LOCAL[LANG].checkout}${LOCAL.lineJoin[1]}${LOCAL[LANG].before}${LOCAL.lineJoin[3]}${LOCAL.lineJoin[1]}${data.offer.checkout}${LOCAL.lineJoin[2]}` || '';
      data.templates[templateNickName].time =
        data.templates[templateNickName].checkin && data.templates[templateNickName].checkout &&
        `${data.templates[templateNickName].checkin}${LOCAL.lineJoin[1]}${data.templates[templateNickName].checkout}`
        ||
        '';
      delete data.templates[templateNickName].checkin;
      delete data.templates[templateNickName].checkout;
      data.templates[templateNickName].features = data.offer.features && data.offer.features.length && data.offer.features || '';
      data.templates[templateNickName].photos = data.offer.photos && data.offer.photos.length && data.offer.photos || [];
      data.templates[templateNickName].avatar = data.author.avatar && data.author.avatar || '';
      break;
    /* normalizes data for the 'card' template END */
  }
  return data;
};

const getLocalText = (property, lang = getLang()) => LOCAL[lang][property] || '';

export { getLocalText };
export { normalizeCardTemplate };
