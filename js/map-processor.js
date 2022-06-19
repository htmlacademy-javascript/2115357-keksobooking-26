/*dom processor*/
import   { domProcessor }        from './dom-processor.js';

/* api processor */
import   { processApi }          from './api-processor.js';

/* validate processor */
import   { recordAdAddressFromMap }   from './validate-processor.js';
import   { validateProcessor }   from './validate-processor.js';

const INITIAL_LAT = 35.658581;
const INITIAL_LNG = 139.745438;
const INITIAL_ZOOM = 10;
const OPEN_MAP_PARAMS = {
  1: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  2: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};
const SIMILAR_ADS_MAX_NUMBER = 10;
const similarAdsFilterFormDomClassElement = 'mapFilters';
const similarAdsFilterForm = domProcessor(false, 'getContainer', similarAdsFilterFormDomClassElement);
const refreshSimilarAdsButtonClass1 = similarAdsFilterForm.classes.class1;
const refreshSimilarAdsButtonClass2 = similarAdsFilterForm.classes.class2;
const refreshSimilarAdsButtonText = domProcessor(false, 'getLocalText', 'refreshSimilarAdsButton');
const similarAdsFilterFormNode = document.querySelector(`${similarAdsFilterForm.selector}${similarAdsFilterForm.value}`);

const resetSimilarAdsFilterForm = () => {
  similarAdsFilterFormNode.reset();
};
const mapProcessor = () => {
  /*turn the page off*/
  domProcessor(false, 'pageDisable');
  /*get map container*/
  const MAP_CONTAINER_CLASS = 'mapCanvas';
  /*get container element from the dom.class*/
  const MAP_CONTAINER_DOM_ELEMENT = domProcessor(false, 'getContainer', MAP_CONTAINER_CLASS);
  const MAP_MAIN_MARKER = {
    marker: '',
    pin: '',
  };

  /*initialize the map START*/
  const initializeTheMap = () => {
    const result =  new Promise((sR)=> {
      const map = L.map(MAP_CONTAINER_DOM_ELEMENT.value)
        .on('load', () => {})
        .setView({
          lat: INITIAL_LAT,
          lng: INITIAL_LNG,
        }, INITIAL_ZOOM);
      /*initialize the map END*/
      const check = map.getCenter();
      sR(typeof check !== 'undefined' && check.lat === INITIAL_LAT && map || false);
    });
    return result;
  };
  initializeTheMap().then((MAP)=>{
    if (!MAP) {
      /*the adForm remains disabled*/
      /*!!!ADD what if there's an Error should be added ADD!!!*/
      return;
    }
    /*here the map is ready*/
    /*mount openmap to the map*/
    L.tileLayer(OPEN_MAP_PARAMS[1], {attribution: OPEN_MAP_PARAMS[2],},).addTo(MAP);
    /*initialize the marker pin*/
    MAP_MAIN_MARKER.pin = L.icon({
      iconUrl: './img/main-pin.svg',
      iconSize: [52, 52],
      iconAnchor: [26, 52],
    });
    /*initialize the main marker*/
    MAP_MAIN_MARKER.marker = L.marker(
      {
        lat: INITIAL_LAT,
        lng: INITIAL_LNG,
      },
      {
        draggable: true,
        icon: MAP_MAIN_MARKER.pin,
      },
    );
    /*mount the main marker to the map*/
    MAP_MAIN_MARKER.marker.addTo(MAP);
    /*sends new addresses to the validation processor onMarkerMove*/
    MAP_MAIN_MARKER.marker.on('moveend', (mapEv) => {
      recordAdAddressFromMap(mapEv.target.getLatLng());
    });
    /*set initial main marker coordinates - address field in validation*/
    recordAdAddressFromMap({lat: INITIAL_LAT, lng: INITIAL_LNG}, true);
    /*turn the page back on*/
    domProcessor(false, 'pageEnable');
    /*here the ads filter form should remain disabled untill all similar ads are loaded*/
    domProcessor(false, 'mapFilterDisable');
    /*initialize adForm validation*/
    validateProcessor();
    /*similar ads START*/
    /*create a layer with similar ads*/
    const mapSimilarIcon = L.icon({
      iconUrl: './img/pin.svg',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });
    const MAP_SIMILAR_ADS_MARKER_LAYER = L.layerGroup().addTo(MAP);
    const getSimilarAds = () => {
      /*it comes from normalize-data-to-dom.js*/
      const indexInNormalizedAdPopUpNode = 0;
      const indexInNormalizedAdPopUpNodeData = 2;
      /*refresh button initialize start*/
      const refreshSimilarAdsButton = document.createElement('div');
      refreshSimilarAdsButton.classList.add(refreshSimilarAdsButtonClass1);
      refreshSimilarAdsButton.classList.add(refreshSimilarAdsButtonClass2);
      refreshSimilarAdsButton.textContent = refreshSimilarAdsButtonText;
      /*refresh button initialize end*/
      /*similar adds filter form should be disabled here*/
      domProcessor(false, 'mapFilterDisable');
      /*remove old ads from the similar ads layer*/
      MAP_SIMILAR_ADS_MARKER_LAYER.clearLayers();
      /*refresh button*/
      const deleteRefreshButton = () => {
        const refreshButtonNode = document.querySelector(`.${refreshSimilarAdsButtonClass2}`);
        if (refreshButtonNode) {
          refreshButtonNode.remove();
        }
      };
      /*delete refresh button*/
      deleteRefreshButton();
      processApi().then((result) =>{
        const processSimilarAdsAfterApiFail = () =>{
          domProcessor(false, 'mapFilterDisable');
          similarAdsFilterFormNode.parentNode.append(refreshSimilarAdsButton);
          /*refresh button onclick getsSimilarAdsAgain*/
          refreshSimilarAdsButton.addEventListener('click', getSimilarAds);
        };
        /*!!!TEMP DELETE TEMP!!!*/
        const similarAdsToggle = Math.floor(Math.random() * 2) === 0;
        /*!!!TEMP DELETE TEMP!!!*/
        if (!similarAdsToggle || !result) {
          processSimilarAdsAfterApiFail();
          return;
        }
        /*result - json string*/
        try{
          /*there should be no more than SIMILAR_ADS_MAX_NUMBER ads at once*/
          result = JSON.parse(result);
          /*shuffle and trim ads array*/
          const dataOriginal = result.sort(() => Math.random() - 0.5).slice(0, SIMILAR_ADS_MAX_NUMBER);
          /*mapCanvas - should be revised/renamed in dom.class & fill-container-with-template*/
          const DOM_CONTAINER_NAME = 'mapCanvas';
          /*get originalData, normalize it, clone and fill each node with the normalized data for each similar ad*/
          const NORMALIZED_ADS_NODES = domProcessor(dataOriginal, 'fillContainerWithTemplate', 'card', DOM_CONTAINER_NAME, true).mapPopUpNodes;
          const addPopupsToLayer = (data) => {
            data.forEach((ad) => {
              if (!ad[indexInNormalizedAdPopUpNodeData].hidden) {
                const mapSimilarAdMarker = L.marker(
                  {
                    lat: ad[1].lat,
                    lng: ad[1].lng,
                  },
                  {icon: mapSimilarIcon},
                );
                mapSimilarAdMarker
                  .addTo(MAP_SIMILAR_ADS_MARKER_LAYER)
                  .bindPopup(ad[0]);
              }
            });
          };
          addPopupsToLayer(NORMALIZED_ADS_NODES);
          /*all similar ads are loaded*/
          /*show filter form*/
          domProcessor(false, 'mapFilterEnable');
          /*similar-ads filter comparison START*/
          let FILTER_DELAY_TIMEOUT = '';
          const FILTER_DELAY_TIME = 500;
          const fieldClassPartToNormalize = 'housing-';
          const ANY_WORD = 'any';
          const TYPE_FIELD_NAME = 'type';
          const PRICE_FIELD_NAME = 'price';
          const ROOMS_FIELD_NAME = 'rooms';
          const GUESTS_FIELD_NAME = 'guests';
          const FEATURES_FIELD_NAME = 'features';
          const removeFilters = () => {
            /*unmark node to hide*/
            for (const index in NORMALIZED_ADS_NODES) {
              NORMALIZED_ADS_NODES[index][indexInNormalizedAdPopUpNodeData].hidden = false;
            }
          };
          const markAdToHide = (popUpNode) => {
            /*mark node to hide*/
            for (const index in NORMALIZED_ADS_NODES) {
              if (NORMALIZED_ADS_NODES[index][0] === popUpNode) {
                NORMALIZED_ADS_NODES[index][indexInNormalizedAdPopUpNodeData].hidden = true;
              }
            }
          };
          const hideFilteredAds = () => {
            /*clear the marker layer*/
            MAP_SIMILAR_ADS_MARKER_LAYER.clearLayers();
            /*refill the marker layer*/
            addPopupsToLayer(NORMALIZED_ADS_NODES);
          };
          const filterSimilarAds = () => {
            /*remove previous filters*/
            removeFilters();
            const similarAdsFilters = [...(new FormData(similarAdsFilterFormNode)).entries()];
            const dataToCompareUser = {};
            /*normalize user data START*/
            similarAdsFilters.forEach((fieldData) => {
              const field = fieldData[0].replace(fieldClassPartToNormalize, '');
              const value = fieldData[1] === ANY_WORD ? 0 : fieldData[1];
              /*normalize type conditions*/
              if (field === TYPE_FIELD_NAME) {
                dataToCompareUser[field] = value;
              }
              /*normalize rooms conditions*/
              if (field === ROOMS_FIELD_NAME) {
                dataToCompareUser[field] = Number(value);
              }
              /*normalize guests conditions*/
              if (field === GUESTS_FIELD_NAME) {
                dataToCompareUser[field] = value;
              }
              /*normalize price conditions*/
              if (field === PRICE_FIELD_NAME) {
                dataToCompareUser[field] = similarAdsFilterForm.children[field][value];
              }
              /*normalize features conditions*/
              if (field === FEATURES_FIELD_NAME) {
                if (typeof dataToCompareUser[field] === 'undefined') {
                  dataToCompareUser[field] = [];
                }
                dataToCompareUser[field].push(value);
              }
            });
            /*normalize user data END*/
            /*compare start*/
            /*an add should meet all criteria*/
            /*if it doesn't, the marker is hidden, the loop continues*/
            for (const node in NORMALIZED_ADS_NODES) {
              const dataToComparePopUpNode = NORMALIZED_ADS_NODES[node][indexInNormalizedAdPopUpNode];
              const dataToCompareAd = NORMALIZED_ADS_NODES[node][indexInNormalizedAdPopUpNodeData];
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
          /*comparison END*/
          const similarAdsFilterFormChangeHandler = () => {
            clearTimeout(FILTER_DELAY_TIMEOUT);
            FILTER_DELAY_TIMEOUT = setTimeout(() => {
              filterSimilarAds();
            }, FILTER_DELAY_TIME);
          };
          similarAdsFilterFormNode.addEventListener('change', similarAdsFilterFormChangeHandler);
        } catch(error) {
          processSimilarAdsAfterApiFail();
        }
      });
    };
    /*similar ads END*/

    /*get the MAP to the initial state START*/
    const getMapToInitialPosition = () =>{
      MAP_MAIN_MARKER.marker.setLatLng({lat: INITIAL_LAT, lng: INITIAL_LNG,});
      MAP.setView({
        lat: INITIAL_LAT,
        lng: INITIAL_LNG,
      }, INITIAL_ZOOM);
      getSimilarAds();
    };
    /*get the MAP in the initial state END*/
    /*resets the map and the marker onBoth: adFormReset & adFormSubmitSuccess*/
    const adFormName = 'adForm';
    const adForm = domProcessor(false, 'getContainer', adFormName);
    const adFormResetButton = document.querySelector(`${adForm.children.adForm.reset.selector[0]}${adForm.children.adForm.reset.value}`);
    const adFormResetButtonClickHandler = () => {
      getMapToInitialPosition();
    };
    adFormResetButton.addEventListener('click', adFormResetButtonClickHandler);

    /*initial load similar ads*/
    getSimilarAds();
  });
};

export { resetSimilarAdsFilterForm };
export { mapProcessor };
