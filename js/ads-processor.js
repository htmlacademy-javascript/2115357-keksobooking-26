/* get ads data */
import   { getAdsData }           from './data-processor.js';
/* dom processor */
import   { domProcessor }        from './dom-processor.js';

/* ads processing START */
const getAdsObject = () => {
  /* get ads data START */
  const res = new Promise((rs, rj) => {
    getAdsData().then((adsObject) => {
      /* get ads data END */
      /* futher ads processing ... */
      /* dom processing START */
      /* fill mapCanvas with card template*/
      domProcessor(adsObject, 'fillContainerWithTemplate', 'card', 'mapCanvas');
      /* active disable */
      /* !!! TEMP DELETE !!! */
      let enableEnable;
      let disableEnable;
      let disable;
      let enable;
      disable = () => {
        domProcessor(false, 'pageDisable');
        document.querySelector('.promo > h1').innerHTML = 'PAGE IS DISABLED<br>clearIntervals onClick';
        document.querySelector('.promo > h1').classList.remove('visually-hidden');
        clearInterval(disableEnable);
        enableEnable = setInterval(enable, 10000);
      };
      disableEnable = setInterval(disable, 100);
      document.querySelector('.promo > img').remove();
      document.querySelector('.promo > h1').addEventListener('click', () => {
        clearInterval(enableEnable);
        clearInterval(disableEnable);
      });
      domProcessor(false, 'pageDisable');
      /* active enable */
      enable = () => {
        domProcessor(false, 'pageEnable');
        document.querySelector('.promo > h1').innerHTML = 'PAGE IS ENABLED<br>clearIntervals onClick';
        document.querySelector('.promo > h1').classList.remove('visually-hidden');
        clearInterval(enableEnable);
        disableEnable = setInterval(disable, 10000);
      };
      /* !!! TEMP DELETE !!! */
      /* dom processing END */
      /* ... futher ads processing  */
      rs(adsObject);
      /* ads processing END */
      rj();
    });
  });
  return res;
};

export {getAdsObject};
