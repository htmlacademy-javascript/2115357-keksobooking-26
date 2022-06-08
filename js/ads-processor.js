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
      /* active disable */

      /* !!! TEMP DELETE START !!! */
      /* page enable/disable presentation START */
      let intervalToggle = '';
      let counterInterval = '';
      let disableEnableToggle = '';
      let startStopPresentationToggle = '';
      const timeCounterInitialValue = 0;
      let timeCounter = timeCounterInitialValue;
      const mainContainerParent = document.querySelector('.map');
      const mainContainer = document.createElement('div');
      const mainTextContainer = document.createElement('h2');
      const subTextContainer = document.createElement('div');
      const counterContainer = document.createElement('div');
      const startStopContainer = document.createElement('div');
      const mainText = 'The page is';
      const enabledText = 'ENABLED';
      const disabledText = 'DISABLED';
      const secWord = 'sec';
      const toggleDisableText = 'Time left before the page is DISABLED:';
      const toggleEnableText = 'Time left before the page is ENABLED:';
      const stopPresentationText = 'Click here to STOP the presentation!';
      const startPresentationText = 'Click here to START the presentation!';
      const intervalTime = 10000;
      const startIntervalTime = 1;
      const counterIntervalTime = 1000;
      const countCounter = () => {
        timeCounter++;
        counterContainer.textContent = `${timeCounter} ${secWord}`;
      };
      const disable = () => {
        /* prepare to disable START */
        clearInterval(intervalToggle);
        clearInterval(counterInterval);
        timeCounter = timeCounterInitialValue;
        mainTextContainer.textContent = `${mainText} ${disabledText}`;
        subTextContainer.textContent = `${toggleEnableText}`;
        counterContainer.textContent = `${timeCounter} ${secWord}`;
        /* prepare to disable END */
        domProcessor(false, 'pageDisable');
        counterInterval = setInterval(countCounter, counterIntervalTime);
        disableEnableToggle = enable;
        intervalToggle = setInterval(disableEnableToggle, intervalTime);
        /* fill mapCanvas with card template*/
        domProcessor(false, 'clearContainer', 'mapCanvas');
        domProcessor(adsObject, 'fillContainerWithTemplate', 'card', 'mapCanvas');
      };
      const enable = () => {
        /* prepare to enable START */
        clearInterval(intervalToggle);
        clearInterval(counterInterval);
        timeCounter = timeCounterInitialValue;
        mainTextContainer.textContent = `${mainText} ${enabledText}`;
        subTextContainer.textContent = `${toggleDisableText}`;
        counterContainer.textContent = `${timeCounter} ${secWord}`;
        /* prepare to enable END */
        domProcessor(false, 'pageEnable');
        counterInterval = setInterval(countCounter, counterIntervalTime);
        disableEnableToggle = disable;
        intervalToggle = setInterval(disableEnableToggle, intervalTime);
        /* fill mapCanvas with card template*/
        domProcessor(false, 'clearContainer', 'mapCanvas');
        domProcessor(adsObject, 'fillContainerWithTemplate', 'card', 'mapCanvas');
      };
      const startPresentation = () => {
        startStopContainer.removeEventListener('click', startPresentation);
        clearInterval(intervalToggle);
        startStopContainer.remove();
        mainContainer.append(mainTextContainer);
        mainContainer.append(subTextContainer);
        mainContainer.append(counterContainer);
        mainContainer.append(startStopContainer);
        startStopContainer.textContent = stopPresentationText;
        intervalToggle = setInterval(disable, startIntervalTime);
        startStopContainer.addEventListener('click', stopPresentation);
      };
      const initializePrezentation = () => {
        mainContainer.style.display = 'flex';
        mainContainer.style.flexDirection = 'column';
        mainContainer.style.position = 'absolute';
        mainContainer.style.right = '0px';
        mainContainer.style.top = '0px';
        mainContainer.style.padding = '20px 20px';
        mainContainerParent.append(mainContainer);
        startStopContainer.style.fontSize = '20px';
        startStopContainer.style.fontWeight = '700';
        startStopContainer.style.cursor = 'pointer';
        mainContainer.append(startStopContainer);
        startStopContainer.textContent = startPresentationText;
        startStopContainer.addEventListener('click', startPresentation);
        /* fill mapCanvas with card template*/
        domProcessor(false, 'clearContainer', 'mapCanvas');
        domProcessor(adsObject, 'fillContainerWithTemplate', 'card', 'mapCanvas');
      };
      const stopPresentation = () => {
        startStopContainer.removeEventListener('click', stopPresentation);
        clearInterval(intervalToggle);
        mainTextContainer.remove();
        subTextContainer.remove();
        counterContainer.remove();
        startStopContainer.textContent = startPresentationText;
        startStopContainer.addEventListener('click', startPresentation);
      };
      initializePrezentation();
      /* page enable/disable presentation END */
      /* !!! TEMP DELETE END !!! */

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
