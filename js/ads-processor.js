/* get ads data */
import   { getAdsData }           from './data-processor.js';
/* dom processor */
import   { domPropcessor }        from './dom-processor.js';

/* ads processing START */
const getAdsObject = () => {
  /* get ads data START */
  const res = new Promise((rs, rj) => {
    getAdsData().then((adsObject) => {
      /* get ads data END */
      /* futher ads processing ... */
      /* dom processing START */
      /* fill mapCanvas with card template*/
      domPropcessor(adsObject, 'fillContainerWithTemplate', 'card', 'mapCanvas');
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
