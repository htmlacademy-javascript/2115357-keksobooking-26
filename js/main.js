import   {getAdsObject}    from './ads-processor.js';

/* validate processor */
import   { validateProcessor }              from './validate-processor.js';

/* linter temp */
getAdsObject()
  .then((data) => {
    JSON.stringify(data);
    /*initialize validation*/
    validateProcessor(data);
  });

/*
  events
  8.19. Правда или действие (часть 1)
  8.20. Правда или действие (часть 2)

  api
  9.9. Помощь друга

  fetch
  11.15. Надо подкачаться

  ?
  12.11. Перламутровые пуговицы
  12.12. Фото на память
*/
