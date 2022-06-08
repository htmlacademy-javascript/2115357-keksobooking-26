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
      const showAd = () => {
        /* fill mapCanvas with card template*/
        domProcessor(false, 'clearContainer', 'mapCanvas');
        domProcessor(adsObject, 'fillContainerWithTemplate', 'card', 'mapCanvas');
      };

      /* !!! TEMP DELETE START !!! */
      /* page enable/disable presentation START */
      const prezentPresentation = () => {
        let timeCounter;
        let intervalToggle = '';
        let counterInterval = '';
        const timeCounterInitialValue = 10;
        const mainContainerParent = document.querySelector('.map');
        const mainContainer = document.createElement('div');
        const mainTextContainer = document.createElement('h2');
        const subTextContainer = document.createElement('div');
        const counterContainer = document.createElement('div');
        const startStopContainer = document.createElement('div');
        const refreshAdsContainer = document.createElement('div');
        const mainText = 'The page is';
        const enabledText = 'ENABLED';
        const disabledText = 'DISABLED';
        const secWord = 'sec';
        const toggleDisableText = 'Time left before the page is DISABLED:';
        const toggleEnableText = 'Time left before the page is ENABLED:';
        const stopPresentationText = 'Click here to STOP the presentation!';
        const startPresentationText = 'Click here to START the presentation!';
        const refreshAdsContainerText = 'Click me too!';
        const intervalTime = 10000;
        const startIntervalTime = 1;
        const counterIntervalTime = 1000;
        const countCounter = () => {
          timeCounter--;
          counterContainer.textContent = `${timeCounter} ${secWord}`;
        };
        const setPresentationContainers = () => {
          refreshAdsContainer.style.position = 'absolute';
          refreshAdsContainer.style.bottom = '100px';
          refreshAdsContainer.style.right = '0px';
          refreshAdsContainer.style.padding = '20px 20px';
          refreshAdsContainer.style.fontSize = '20px';
          refreshAdsContainer.style.fontWeight = '700';
          refreshAdsContainer.style.cursor = 'pointer';
          mainContainerParent.append(refreshAdsContainer);
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
        };
        const presentationFn = {
          disable: '',
          enable: '',
          startPresentation: '',
          stopPresentation: '',
        };
        presentationFn.startPresentation = () => {
          startStopContainer.removeEventListener('click', presentationFn.startPresentation);
          clearInterval(intervalToggle);
          startStopContainer.remove();
          mainContainer.append(mainTextContainer);
          mainContainer.append(subTextContainer);
          mainContainer.append(counterContainer);
          mainContainer.append(startStopContainer);
          startStopContainer.textContent = stopPresentationText;
          intervalToggle = setInterval(presentationFn.disable, startIntervalTime);
          startStopContainer.addEventListener('click', presentationFn.stopPresentation);
          showAd();
        };
        presentationFn.stopPresentation = () => {
          startStopContainer.removeEventListener('click', presentationFn.stopPresentation);
          clearInterval(intervalToggle);
          mainTextContainer.remove();
          subTextContainer.remove();
          counterContainer.remove();
          startStopContainer.textContent = startPresentationText;
          startStopContainer.addEventListener('click', presentationFn.startPresentation);
          showAd();
        };
        presentationFn.disable = () => {
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
          intervalToggle = setInterval(presentationFn.enable, intervalTime);
          showAd();
        };
        presentationFn.enable = () => {
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
          intervalToggle = setInterval(presentationFn.disable, intervalTime);
          showAd();
        };
        setPresentationContainers();
        /* present presentation */
        timeCounter = timeCounterInitialValue;
        refreshAdsContainer.textContent = refreshAdsContainerText;
        refreshAdsContainer.addEventListener('click', showAd);
        startStopContainer.textContent = startPresentationText;
        startStopContainer.addEventListener('click', presentationFn.startPresentation);
      };
      prezentPresentation();
      showAd();
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
