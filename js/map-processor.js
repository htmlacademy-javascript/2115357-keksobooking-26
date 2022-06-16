/*dom processor*/
import   { domProcessor }        from './dom-processor.js';

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
  domProcessor(false, 'clearContainer', MAP_CONTAINER_CLASS);
  /*get container element from the dom.class*/
  const MAP_CONTAINER_DOM_ELEMENT = domProcessor(false, 'getContainer', MAP_CONTAINER_CLASS);
  /*initialize the map*/
  const MAP = L.map(MAP_CONTAINER_DOM_ELEMENT.value)
    .on('load', () => {
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

  /*mount openmap to the map*/
  L.tileLayer(OPEN_MAP_PARAMS[1], {attribution: OPEN_MAP_PARAMS[2],},).addTo(MAP);

  /*initialize the main marker*/
  const MAP_MAIN_MARKER = L.marker(
    {
      lat: INITIAL_LAT,
      lng: INITIAL_LNG,
    },
    {
      draggable: true,
    },
  );
  /*mount the main marker to the map*/
  MAP_MAIN_MARKER.addTo(MAP);
  /*sends new addresses to the validation processor onMarkerMove*/
  MAP_MAIN_MARKER.on('moveend', (mapEv) => {
    recordAdAddressFromMap(mapEv.target.getLatLng());
  });

  /*get the MAP in the initial state START*/
  const getMapToInitialPosition = () =>{
    MAP_MAIN_MARKER.setLatLng({lat: INITIAL_LAT, lng: INITIAL_LNG,});
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
};

export { mapProcessor };
