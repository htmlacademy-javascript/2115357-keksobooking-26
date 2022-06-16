/* get ads data */
import   { getAdsData }           from './data-processor.js';

/* ads processing START */
const getAdsObject = () => {
  /* get ads data START */
  const result =  new Promise((rs, rj) => {
    getAdsData().then((adsObject) => {
      /* get ads data END */
      rs(adsObject);
      /* ads processing END */
      rj();
    });
  });
  return result;
};

export {getAdsObject};
