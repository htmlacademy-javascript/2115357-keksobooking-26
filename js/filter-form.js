import { assistApp } from './app-assistant.js';
import { pullFromServer } from './fetch.js';
import { validateAdForm } from './ad-form.js';

/*turn the adForm off*/
assistApp(false, 'adFormDisable');
/*turn the mapFilterForm off */
assistApp(false, 'filterFormDisable');

/*VARS START*/
/*similar-ads*/
let FILTER_DELAY_TIMEOUT = '';
const FILTER_DELAY_LENGTH = 500;
const ANY_WORD = 'any';
const TYPE_FIELD_NAME = 'type';
const PRICE_FIELD_NAME = 'price';
const ROOMS_FIELD_NAME = 'rooms';
const GUESTS_FIELD_NAME = 'guests';
const FEATURES_FIELD_NAME = 'features';
const CLASS_PART_TO_NORMALIZE = 'housing-';
const similarAds = {
  nodes: [],
};
const similarAdsAdditionalParameters = {
  templateContainerName: 'mapCanvas',
  mapPopUpNodes: 'mapPopUpNodes',
  shuffleRandomizer: 0.5,
  adsMaxNumber: 10,
  /*these keys (inside similarAds.nodes) come from fillContainerWithTemplate*/
  /*prepareCardTemplateData() > normalizedAdsReturnToMap.push([fi...*/
  popupNodeKey: 0,
  addressKey: 1,
  dataKey: 2,
};

/*map*/
const MAP_CONTAINER_CLASS = 'mapCanvas';
const mapContainer = assistApp(false, 'getContainer', MAP_CONTAINER_CLASS);

/*filterForm*/
const filterFormElement = 'mapFilters';
const filterForm = assistApp(false, 'getContainer', filterFormElement);

/*refresh button*/
const refreshButtonClass1 = filterForm.classes.class1;
const refreshButtonClass2 = filterForm.classes.class2;
const refreshButtonText = assistApp(false, 'getLocalText', 'refreshSimilarAdsButton');
/*VARS END*/

/*NODES START*/
/*filterForm*/
const filterFormNode = document.querySelector(filterForm.selector);
/*refresh button*/
const refreshButtonNode = document.createElement('div');
refreshButtonNode.classList.add(refreshButtonClass1);
refreshButtonNode.classList.add(refreshButtonClass2);
refreshButtonNode.textContent = refreshButtonText;
/*NODES END*/

/*FUNCTIONS START*/
/*ads comparison*/
const addPopupsToSimilarAdsLayer = () => {
  similarAds.nodes.forEach((ad) => {
    /*indexes 0 - popup node, 1 - address, 2 rest data*/
    if (!ad[similarAdsAdditionalParameters.dataKey].hidden) {
      const mapSimilarAdMarker = L.marker(
        {
          lat: ad[similarAdsAdditionalParameters.addressKey].lat,
          lng: ad[similarAdsAdditionalParameters.addressKey].lng,
        },
        {icon: mapContainer.similarMarker},
      );
      mapSimilarAdMarker
        .addTo(mapContainer.similarAdsLayer)
        .bindPopup(ad[similarAdsAdditionalParameters.popupNodeKey]);
    }
  });
};
const removeFilters = () => {
  /*unmark node to hide*/
  for (const nodeKey in similarAds.nodes) {
    similarAds.nodes[nodeKey][similarAdsAdditionalParameters.dataKey].hidden = false;
  }
};
const markAdToHide = (popUpNode) => {
  /*mark node to hide*/
  const hideElementKey = similarAds.nodes.findIndex((ads) => ads[similarAdsAdditionalParameters.popupNodeKey] === popUpNode);
  similarAds.nodes[hideElementKey][similarAdsAdditionalParameters.dataKey].hidden = true;
};
const hideFilteredAds = () => {
  /*clear the marker layer*/
  mapContainer.similarAdsLayer.clearLayers();
  /*refill the marker layer*/
  addPopupsToSimilarAdsLayer(similarAds.nodes);
};
const filterSimilarAds = () => {
  /*remove previous filters*/
  removeFilters();
  const similarAdsFilters = [...(new FormData(filterFormNode)).entries()];
  const dataToCompareUser = {};
  /*normalize user data START*/
  similarAdsFilters.forEach((property0Value1) => {
    const property = property0Value1[0].replace(CLASS_PART_TO_NORMALIZE, '');
    const value = property0Value1[1] === ANY_WORD ? 0 : property0Value1[1];
    switch (property) {
      case TYPE_FIELD_NAME: {
        /*normalize type conditions*/
        dataToCompareUser[property] = value;
        break;
      }
      case ROOMS_FIELD_NAME: {
        /*normalize rooms conditions*/
        dataToCompareUser[property] = Number(value);
        break;
      }
      case GUESTS_FIELD_NAME: {
        /*normalize guests conditions*/
        dataToCompareUser[property] = value;
        break;
      }
      case PRICE_FIELD_NAME: {
        /*normalize price conditions*/
        dataToCompareUser[property] = filterForm.children[property][value];
        break;
      }
      case FEATURES_FIELD_NAME: {
        /*normalize features conditions*/
        if (typeof dataToCompareUser[property] === 'undefined') {
          dataToCompareUser[property] = [];
        }
        dataToCompareUser[property].push(value);
        break;
      }
    }
  });
  /*normalize user data END*/
  /*compare start*/
  /*an add should meet all criteria*/
  /*if it doesn't, the marker is hidden, the loop continues*/
  for (const node in similarAds.nodes) {
    const dataToComparePopUpNode = similarAds.nodes[node][similarAdsAdditionalParameters.popupNodeKey];
    const dataToCompareAd = similarAds.nodes[node][similarAdsAdditionalParameters.dataKey];
    /*only if it is not "any" (not 0) */
    /*compare type*/
    if (dataToCompareUser[TYPE_FIELD_NAME]) {
      if (dataToCompareAd[TYPE_FIELD_NAME] !== dataToCompareUser[TYPE_FIELD_NAME]) {
        markAdToHide(dataToComparePopUpNode);
        continue;
      }
    }
    /*compare rooms*/
    if (dataToCompareUser[ROOMS_FIELD_NAME]) {
      if (dataToCompareAd[ROOMS_FIELD_NAME] !== dataToCompareUser[ROOMS_FIELD_NAME]) {
        markAdToHide(dataToComparePopUpNode);
        continue;
      }
    }
    /*compare guests, here's is a special filter for "any"*/
    /*any === 0, not for guests === '0'*/
    /*if it is 'any'(0) it mooves on, if it is NFG ('0') it goes inside*/
    if (dataToCompareUser[GUESTS_FIELD_NAME]) {
      const intForGuestsNumberUser = Number(dataToCompareUser[GUESTS_FIELD_NAME]);
      if (dataToCompareAd[GUESTS_FIELD_NAME] < intForGuestsNumberUser ||
        intForGuestsNumberUser === 0 && intForGuestsNumberUser !== dataToCompareAd[GUESTS_FIELD_NAME]
      ) {
        markAdToHide(dataToComparePopUpNode);
        continue;
      }
    }
    /*compare price*/
    if (dataToCompareUser[PRICE_FIELD_NAME]) {
      if (
        /*min price*/
        dataToCompareAd[PRICE_FIELD_NAME] < dataToCompareUser[PRICE_FIELD_NAME][0] ||
        /*max price*/
        dataToCompareAd[PRICE_FIELD_NAME] > dataToCompareUser[PRICE_FIELD_NAME][1]
      ) {
        markAdToHide(dataToComparePopUpNode);
        continue;
      }
    }
    /*compare features*/
    /*the ad being compared should have all the features from the user choice*/
    if (dataToCompareUser[FEATURES_FIELD_NAME] && !dataToCompareAd[FEATURES_FIELD_NAME]) {
      markAdToHide(dataToComparePopUpNode);
    } else if (dataToCompareUser[FEATURES_FIELD_NAME] && dataToCompareAd[FEATURES_FIELD_NAME]) {
      const userFeature = dataToCompareUser[FEATURES_FIELD_NAME];
      const adFeature = dataToCompareAd[FEATURES_FIELD_NAME];
      const compareF = (adFt, userFt) => userFt.every((feature) => adFt.includes(feature));
      if (!compareF(adFeature, userFeature)){
        markAdToHide(dataToComparePopUpNode);
      }
    }
  }
  /*compare end*/
  /*hide filtered*/
  hideFilteredAds();
};

/*filterForm*/
const filterFormChangeHandler = () => {
  clearTimeout(FILTER_DELAY_TIMEOUT);
  FILTER_DELAY_TIMEOUT = setTimeout(() => {
    filterSimilarAds();
  }, FILTER_DELAY_LENGTH);
};
const resetSimilarAdsFilterForm = () => {
  filterFormNode.reset();
};
filterFormNode.addEventListener('change', filterFormChangeHandler);
/*refresh button*/
const deleteRefreshButton = () => {
  const refreshButtonNodeChecker = document.querySelector(`.${refreshButtonClass2}`);
  if (refreshButtonNodeChecker) {
    refreshButtonNodeChecker.remove();
  }
};
/*rest*/
const processAfterServerFail = () =>{
  assistApp(false, 'filterFormDisable');
  filterFormNode.parentNode.append(refreshButtonNode);
};
const getSimilarAds = () => {
  assistApp(false, 'filterFormDisable');
  /*remove old ads from the similar ads layer*/
  if (mapContainer.similarAdsLayer) {
    mapContainer.similarAdsLayer.clearLayers();
  }
  /*delete refresh button if there's one*/
  deleteRefreshButton();
  /*get similar ads form the server*/
  pullFromServer()
    .then((response) =>{
      /*process the server error*/
      if (!response) {
        processAfterServerFail();
        return;
      }
      /*the server responded with OK, result is a json string*/
      try {
        response = JSON.parse(response);
      } catch(error) {
        processAfterServerFail();
      }
      /*there should be no more than SimilarAdsAdditional.adsMaxNumber ads at once*/
      /*shuffle and trim ads array*/
      const dataOriginal = response.sort(() => Math.random() - similarAdsAdditionalParameters.shuffleRandomizer).slice(0, similarAdsAdditionalParameters.adsMaxNumber);
      /*mapCanvas - should be revised/renamed in dom.class & fill-container-with-template*/
      /*normalize originalData, clone and fill each node with the normalized data for each similar ad*/
      similarAds.nodes = assistApp(dataOriginal, 'fillContainerWithTemplate', 'card', similarAdsAdditionalParameters.templateContainerName, true)[similarAdsAdditionalParameters.mapPopUpNodes];
      addPopupsToSimilarAdsLayer();
      /*similar ads are loaded*/
      /*enable filter form*/
      assistApp(false, 'filterFormEnable');
    })
    .catch(() => {
      processAfterServerFail();
    });
};

/*refresh button onclick getsSimilarAds*/
const refreshButtonClickHandler = () => {
  getSimilarAds();
};
refreshButtonNode.addEventListener('click', refreshButtonClickHandler);

/*get the MAP to the initial state*/
const getMapToInitialPosition = () =>{
  mapContainer.mainMarker.setLatLng({lat: mapContainer.initialLat, lng: mapContainer.initialLng,});
  mapContainer.map.setView({
    lat: mapContainer.initialLat,
    lng: mapContainer.initialLng,
  }, mapContainer.initialZoom);
  getSimilarAds();
};
const processTheMap = () => {
  /*initialize adForm validation*/
  validateAdForm();
  getSimilarAds();
  /*turn the adForm back on*/
  assistApp(false, 'adFormEnable');
};

export { getMapToInitialPosition };
export { resetSimilarAdsFilterForm };
export { processTheMap };
