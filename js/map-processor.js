/*dom processor*/
import   { domProcessor }        from './dom-processor.js';

/* ads processor */
import   { getAdsObject }              from './ads-processor.js';

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

const mapProcessor = () => {
  /*turn the page off*/
  domProcessor(false, 'pageDisable');
  /*get map container*/
  const MAP_CONTAINER_CLASS = 'mapCanvas';
  /*clear map container*/
  //domProcessor(false, 'clearContainer', MAP_CONTAINER_CLASS);
  /*get container element from the dom.class*/
  const MAP_CONTAINER_DOM_ELEMENT = domProcessor(false, 'getContainer', MAP_CONTAINER_CLASS);
  const MAP_MAIN_MARKER = {
    marker: '',
    pin: '',
  };
  /*initialize the map START*/
  const MAP = L.map(MAP_CONTAINER_DOM_ELEMENT.value)
    .on('load', () => {
      /*??? is this thing ASYNC???? */
      /*get the MAP to the initial state START*/
      const getMapToInitialPosition = () =>{
        MAP_MAIN_MARKER.marker.setLatLng({lat: INITIAL_LAT, lng: INITIAL_LNG,});
        MAP.setView({
          lat: INITIAL_LAT,
          lng: INITIAL_LNG,
        }, INITIAL_ZOOM);
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
      /*turn the page back on*/
      domProcessor(false, 'pageEnable');
      /*set initial pointer coordinates*/
      recordAdAddressFromMap({lat: INITIAL_LAT, lng: INITIAL_LNG}, true);
      /*initialize adForm validation*/
      validateProcessor();
    })
    .setView({
      lat: INITIAL_LAT,
      lng: INITIAL_LNG,
    }, INITIAL_ZOOM);
  /*initialize the map END*/
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
  /*similar ads START*/
  /*create a layer with similar pins*/
  const MAP_SIMILAR_MARKER_LAYER = L.layerGroup().addTo(MAP);
  const mapSimilarIcon = L.icon({
    iconUrl: './img/pin.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
  const getSimilarAds = () => {
    /*gets the data for the "similar ads"*/
    getAdsObject()
      .then((dataOriginal) => {
        JSON.stringify(dataOriginal);
        /*mapCanvas - shoul be revised/renamed in dom.class & fill-container-with-template*/
        const DOM_CONTAINER_NAME = 'mapCanvas';
        /*get originalData, normalize it, clone and fill each node with the normalized data for each similar ad*/
        const NORMALIZED_ADS_NODES = domProcessor(dataOriginal, 'fillContainerWithTemplate', 'card', DOM_CONTAINER_NAME, true).mapPopUpNodes;
        NORMALIZED_ADS_NODES.forEach((ad) => {
          const mapSecondaryMarker = L.marker(
            {
              lat: ad[1].lat,
              lng: ad[1].lng,
            },
            {
              mapSimilarIcon,
            },
          );
          mapSecondaryMarker
            .addTo(MAP_SIMILAR_MARKER_LAYER)
            .bindPopup(ad[0]);
        });
      });
  };
  getSimilarAds();

  /*create a layer with the an ad info*/
  /*secondary ads END*/
};

export { mapProcessor };
