const getLang = () => navigator.language === 'ru' ? 'ru' : 'en';

const LANG = getLang();
const localTexts = {
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
    requiredFieldText: 'Это обязательное поле',
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
    requiredFieldText: 'This field is required',
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
  data.templates[templateNickName] = {};
  const template = data.templates[templateNickName];

  template.title = data.offer.title && data.offer.title || '';
  template.description = data.offer.description && data.offer.description || '';
  template.address = data.offer.address && data.offer.address || '';
  template.price = data.offer.price && `${data.offer.price.toLocaleString()}${localTexts.lineJoin[1]}${localTexts[LANG]['price']}` || '';
  template.type = data.offer.type && localTexts[LANG][data.offer.type] || '';
  switch (true) {
    case data.offer.rooms === localTexts.numDeclen[1]:
    case data.offer.rooms === localTexts.numDeclen[21]:
    case data.offer.rooms === localTexts.numDeclen[31]:
      template.rooms = `${data.offer.rooms}${localTexts.lineJoin[1]}${localTexts[LANG]['roomsWord'][localTexts.numDeclen[1]]}`;
      break;
    case data.offer.rooms > localTexts.numDeclen[1] && data.offer.rooms <= localTexts.numDeclen[4]:
      template.rooms = `${data.offer.rooms}${localTexts.lineJoin[1]}${localTexts[LANG]['roomsWord'][localTexts.numDeclen[4]]}`;
      break;
    case data.offer.rooms >= localTexts.numDeclen[5]:
      template.rooms = `${data.offer.rooms}${localTexts.lineJoin[1]}${localTexts[LANG]['roomsWord'][localTexts.numDeclen[5]]}`;
      break;
    default:
      template.rooms = '';
  }
  switch (true) {
    case data.offer.guests === localTexts.numDeclen[1]:
    case data.offer.guests === localTexts.numDeclen[21]:
    case data.offer.guests === localTexts.numDeclen[31]:
      template.guests = `${data.offer.guests}${localTexts.lineJoin[1]}${localTexts[LANG]['guestsWord'][1]}`;
      break;
    case data.offer.guests > localTexts.numDeclen[1] && data.offer.guests <= localTexts.numDeclen[4]:
      template.guests = `${data.offer.guests}${localTexts.lineJoin[1]}${localTexts[LANG]['guestsWord'][4]}`;
      break;
    case data.offer.guests >= localTexts.numDeclen[5]:
      template.guests = `${data.offer.guests}${localTexts.lineJoin[1]}${localTexts[LANG]['guestsWord'][5]}`;
      break;
    default:
      template.guests = '';
  }
  template.capacity =
    template.rooms && template.guests &&
    `${template.rooms}${localTexts.lineJoin[1]}${localTexts[LANG].for}${localTexts.lineJoin[1]}${template.guests}${localTexts.lineJoin[2]}`
    ||
    '';
  delete template.rooms;
  delete template.guests;
  template.checkin = data.offer.checkin && `${localTexts[LANG].checkin}${localTexts.lineJoin[1]}${localTexts[LANG].after}${localTexts.lineJoin[3]}${localTexts.lineJoin[1]}${data.offer.checkin}${localTexts.lineJoin[2]}` || '';
  template.checkout = data.offer.checkout && `${localTexts[LANG].checkout}${localTexts.lineJoin[1]}${localTexts[LANG].before}${localTexts.lineJoin[3]}${localTexts.lineJoin[1]}${data.offer.checkout}${localTexts.lineJoin[2]}` || '';
  template.time =
    template.checkin && template.checkout &&
    `${template.checkin}${localTexts.lineJoin[1]}${template.checkout}`
    ||
    '';
  delete template.checkin;
  delete template.checkout;
  template.features = data.offer.features && data.offer.features.length && data.offer.features || [];
  template.photos = data.offer.photos && data.offer.photos.length && data.offer.photos || [];
  template.avatar = data.author.avatar && data.author.avatar || '';

  return data;
};

const getLocalText = (property, lang = getLang()) => localTexts[lang][property] || '';

export { getLocalText };
export { normalizeCardTemplate };
