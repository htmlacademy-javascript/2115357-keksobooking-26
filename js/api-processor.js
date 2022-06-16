/* functions START */
import   {getRandomNumber}    from './functions.js';
/* functions END */

/* get api data v1.0 */
const getAPIData = () => {
  const res = new Promise((sR)=> {
    setTimeout(() => {
      const ADS_DATA = JSON.stringify({
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
              x: 35.43999,
              y: 35.90001,
            },
            lng: {
              x: 139.48999,
              y: 139.99001,
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
      });
      sR(ADS_DATA);
    }, getRandomNumber(100, 1500));
  });
  return res;
};

export {getAPIData};
