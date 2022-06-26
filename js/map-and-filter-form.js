/*dom processor*/
import   { processDomClass } from './dom-class.js';
/* api processor */
import   { connectToApi } from './fetch-api.js';
/* validate processor */
import   { recordAdAddressFromMap }   from './validate-ad-form.js';
import   { validateAdForm }   from './validate-ad-form.js';

/*turn the adForm off*/
processDomClass(false, 'pageDisable');
/*turn the mapFilterForm off */
processDomClass(false, 'mapFilterDisable');

/*VARS START*/
/*map*/
const INITIAL_LAT = 35.658581;
const INITIAL_LNG = 139.745438;
const INITIAL_ZOOM = 10;
const MAP_CONTAINER_CLASS = 'mapCanvas';
const OpenMapParameters = {
  1: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  2: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};
const MapContainerDomElement = processDomClass(false, 'getContainer', MAP_CONTAINER_CLASS);
/*similar-ads*/
let FILTER_DELAY_TIMEOUT = '';
const FILTER_DELAY_TIME = 500;
const ANY_WORD = 'any';
const TYPE_FIELD_NAME = 'type';
const PRICE_FIELD_NAME = 'price';
const ROOMS_FIELD_NAME = 'rooms';
const GUESTS_FIELD_NAME = 'guests';
const FEATURES_FIELD_NAME = 'features';
const CLASS_PART_TO_NORMALIZE = 'housing-';
const SimilarAds = {
  nodes: [],
};
const SimilarAdsAdditional = {
  templateContainerName: 'mapCanvas',
  mapPopUpNodes: 'mapPopUpNodes',
  shuffleRandomizer: 0.5,
  adsMaxNumber: 10,
  /*these indexes (inside SimilarAds.nodes) come from fillContainerWithTemplate*/
  popupNodeIndex: 0,
  addressIndex: 1,
  dataIndex: 2,
};
/*filterForm*/
const filterFormDomClassElement = 'mapFilters';
const FilterForm = processDomClass(false, 'getContainer', filterFormDomClassElement);
/*main marker*/
const MapMainMarkerParameters = {
  iconUrl: './img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
};
/*similar marker*/
const MapSimilarMarkerParameters = {
  iconUrl: './img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
};
/*refresh button*/
const refreshButtonClass1 = FilterForm.classes.class1;
const refreshButtonClass2 = FilterForm.classes.class2;
const refreshButtonText = processDomClass(false, 'getLocalText', 'refreshSimilarAdsButton');
/*VARS END*/

/*NODES START*/
/*filterForm*/
const similarAdsFilterFormNode = document.querySelector(FilterForm.selectorValue);
/*refresh button*/
const refreshButtonNode = document.createElement('div');
refreshButtonNode.classList.add(refreshButtonClass1);
refreshButtonNode.classList.add(refreshButtonClass2);
refreshButtonNode.textContent = refreshButtonText;
/*NODES END*/

/*initialize the map and its elements START*/
const MAP = L.map(MapContainerDomElement.selectorValue.replace('#','')).setView({lat: INITIAL_LAT, lng: INITIAL_LNG,}, INITIAL_ZOOM);
/*mount openmap to the map*/
L.tileLayer(OpenMapParameters[1], {attribution: OpenMapParameters[2],},).addTo(MAP);
/*similar ads layer*/
const mapSimilarAdsLayer = L.layerGroup().addTo(MAP);
/*the main marker*/
const mapMainMarker = L.marker(
  {
    lat: INITIAL_LAT,
    lng: INITIAL_LNG,
  },
  {
    draggable: true,
    /*initialize the marker pin*/
    icon: L.icon(MapMainMarkerParameters),
  },
);
/*mount the main marker to the map*/
mapMainMarker.addTo(MAP);
/*onMainMarkerMove send new addresses to the validation processor*/
mapMainMarker.on('moveend', (mapEv) => {
  recordAdAddressFromMap(mapEv.target.getLatLng());
});
/*similar marker*/
const mapSimilarMarker = L.icon(MapSimilarMarkerParameters);
/*initialize the map and its elements END*/

/*FUNCTIONS START*/
/*initialize the map*/
const checkIfMapIsReady = () => {
  /*check if the map is initialized and ok*/
  try {
    const check = MAP.getCenter();
    return !!(typeof check !== 'undefined' &&
      check &&
      check.lat !== 'undefined' &&
      typeof check.lat === 'number');
  } catch(error) {
    /*the page remains disabled*/
    return false;
  }
};
const initializeTheMap = () => new Promise((sR)=> sR(checkIfMapIsReady()));
/*ads comparison*/
const addPopupsToSimilarAdsLayer = () => {
  SimilarAds.nodes.forEach((ad) => {
    /*indexes 0 - popup node, 1 - address, 2 rest data*/
    if (!ad[SimilarAdsAdditional.dataIndex].hidden) {
      const mapSimilarAdMarker = L.marker(
        {
          lat: ad[SimilarAdsAdditional.addressIndex].lat,
          lng: ad[SimilarAdsAdditional.addressIndex].lng,
        },
        {icon: mapSimilarMarker},
      );
      mapSimilarAdMarker
        .addTo(mapSimilarAdsLayer)
        .bindPopup(ad[SimilarAdsAdditional.popupNodeIndex]);
    }
  });
};
const removeFilters = () => {
  /*unmark node to hide*/
  for (const index in SimilarAds.nodes) {
    SimilarAds.nodes[index][SimilarAdsAdditional.dataIndex].hidden = false;
  }
};
const markAdToHide = (popUpNode) => {
  /*mark node to hide*/
  const hideElementIndex = SimilarAds.nodes.findIndex((ads) => ads[SimilarAdsAdditional.popupNodeIndex] === popUpNode);
  SimilarAds.nodes[hideElementIndex][SimilarAdsAdditional.dataIndex].hidden = true;
};
const hideFilteredAds = () => {
  /*clear the marker layer*/
  mapSimilarAdsLayer.clearLayers();
  /*refill the marker layer*/
  addPopupsToSimilarAdsLayer(SimilarAds.nodes);
};
const filterSimilarAds = () => {
  /*remove previous filters*/
  removeFilters();
  const similarAdsFilters = [...(new FormData(similarAdsFilterFormNode)).entries()];
  const dataToCompareUser = {};
  /*normalize user data START*/
  similarAdsFilters.forEach((property0Value1) => {
    const property = property0Value1[0].replace(CLASS_PART_TO_NORMALIZE, '');
    const value = property0Value1[1] === ANY_WORD ? 0 : property0Value1[1];
    /*normalize type conditions*/
    if (property === TYPE_FIELD_NAME) {
      dataToCompareUser[property] = value;
    }
    /*normalize rooms conditions*/
    if (property === ROOMS_FIELD_NAME) {
      dataToCompareUser[property] = Number(value);
    }
    /*normalize guests conditions*/
    if (property === GUESTS_FIELD_NAME) {
      dataToCompareUser[property] = value;
    }
    /*normalize price conditions*/
    if (property === PRICE_FIELD_NAME) {
      dataToCompareUser[property] = FilterForm.children[property][value];
    }
    /*normalize features conditions*/
    if (property === FEATURES_FIELD_NAME) {
      if (typeof dataToCompareUser[property] === 'undefined') {
        dataToCompareUser[property] = [];
      }
      dataToCompareUser[property].push(value);
    }
  });
  /*normalize user data END*/
  /*compare start*/
  /*an add should meet all criteria*/
  /*if it doesn't, the marker is hidden, the loop continues*/
  for (const node in SimilarAds.nodes) {
    const dataToComparePopUpNode = SimilarAds.nodes[node][SimilarAdsAdditional.popupNodeIndex];
    const dataToCompareAd = SimilarAds.nodes[node][SimilarAdsAdditional.dataIndex];
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
    /*the ad being compared should have all the features from the user choise*/
    if (dataToCompareUser[FEATURES_FIELD_NAME] && !dataToCompareAd[FEATURES_FIELD_NAME]) {
      markAdToHide(dataToComparePopUpNode);
    } else if (dataToCompareUser[FEATURES_FIELD_NAME] && dataToCompareAd[FEATURES_FIELD_NAME]) {
      const userF = dataToCompareUser[FEATURES_FIELD_NAME];
      const adF = dataToCompareAd[FEATURES_FIELD_NAME];
      const compareF = (aD, uSr) => uSr.every((fT) => aD.includes(fT));
      if (!compareF(adF, userF)){
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
  }, FILTER_DELAY_TIME);
};
const resetSimilarAdsFilterForm = () => {
  similarAdsFilterFormNode.reset();
};
similarAdsFilterFormNode.addEventListener('change', filterFormChangeHandler);
/*refresh button*/
const deleteRefreshButton = () => {
  const refreshButtonNodeChecker = document.querySelector(`.${refreshButtonClass2}`);
  if (refreshButtonNodeChecker) {
    refreshButtonNodeChecker.remove();
  }
};
/*rest*/
const processAfterApiFail = () =>{
  processDomClass(false, 'mapFilterDisable');
  similarAdsFilterFormNode.parentNode.append(refreshButtonNode);
};
const getSimilarAds = () => {
  /*
  similar adds filter form should be disabled
  (it gets here after formReset etc.)
  */
  processDomClass(false, 'mapFilterDisable');
  /*remove old ads from the similar ads layer*/
  mapSimilarAdsLayer.clearLayers();
  /*delete refresh button if there's one*/
  deleteRefreshButton();
  /*get similar ads form the server*/
  connectToApi().then((result) =>{

    /*!!!TEMP Simulate the server error DELETE TEMP!!!*/
    const similarAdsToggle = Math.floor(Math.random() * 2) === 0;
    /*!!!TEMP Simulate the server error DELETE TEMP!!!*/

    /*process the server error*/
    if (!similarAdsToggle || !result) {
      processAfterApiFail();
      return;
    }
    /*the server responded with OK, result is a json string*/
    try {
      /*there should be no more than SimilarAdsAdditional.adsMaxNumber ads at once*/
      result = JSON.parse(result);
      /*shuffle and trim ads array*/
      const dataOriginal = result.sort(() => Math.random() - SimilarAdsAdditional.shuffleRandomizer).slice(0, SimilarAdsAdditional.adsMaxNumber);
      /*mapCanvas - should be revised/renamed in dom.class & fill-container-with-template*/
      /*normalize originalData, clone and fill each node with the normalized data for each similar ad*/
      SimilarAds.nodes = processDomClass(dataOriginal, 'fillContainerWithTemplate', 'card', SimilarAdsAdditional.templateContainerName, true)[SimilarAdsAdditional.mapPopUpNodes];
      addPopupsToSimilarAdsLayer();
      /*similar ads are loaded*/
      /*enable filter form*/
      processDomClass(false, 'mapFilterEnable');
    } catch(error) {
      processAfterApiFail();
    }
  });
};

/*refresh button onclick getsSimilarAds*/
const refreshButtonClickHandler = () => {
  getSimilarAds();
};
refreshButtonNode.addEventListener('click', refreshButtonClickHandler);

/*get the MAP to the initial state*/
const getMapToInitialPosition = () =>{
  /*in case it is called after adForm submit/cancel*/
  if (!checkIfMapIsReady()) {
    return;
  }
  mapMainMarker.setLatLng({lat: INITIAL_LAT, lng: INITIAL_LNG,});
  MAP.setView({
    lat: INITIAL_LAT,
    lng: INITIAL_LNG,
  }, INITIAL_ZOOM);
  getSimilarAds();
};
const processTheMap = () => {
  /*check if the map is ok*/
  initializeTheMap().then((result)=>{
    if (!result) {
      return;
    }
    /*the map is ready*/
    /*the adsFilterForm should remain disabled until all similar ads are loaded*/
    /*set initial main marker coordinates (address field in validation)*/
    recordAdAddressFromMap({lat: INITIAL_LAT, lng: INITIAL_LNG}, true);
    /*initialize adForm validation*/
    validateAdForm();
    /*get the MAP to the initial state*/
    getMapToInitialPosition();
    /*turn the page (adForm) back on*/
    processDomClass(false, 'pageEnable');
  });
};

export { getMapToInitialPosition };
export { resetSimilarAdsFilterForm };
export { processTheMap };
