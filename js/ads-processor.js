/* get ads data */
import   {getAdsData}           from './data-processor.js';

/* ads processing START */
const getAdsObject = () => {
  /* get ads data START */
  const res = new Promise((rs, rj) => {
    getAdsData().then((adsObject) => {
      /* get ads data END */
      /* futher ads processing ... */
      /* ... futher ads processing  */
      rs(adsObject);
      /* ads processing END */
      rj();
    });
  });
  return res;
};

export {getAdsObject};
