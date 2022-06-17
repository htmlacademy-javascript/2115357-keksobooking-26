/*dom processor*/
import   { domProcessor }        from './dom-processor.js';

/* api processor */
import   { processApi }              from './api-processor.js';

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
    /*!!!ADD 5.20 ADD!!!*/
    /*here the ads filter form should remain disabled untill all similar ads are loaded*/
    domProcessor(false, 'pageEnable');
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

      /*!!!ADD similar adds filter form should be additionally disabled here
      than it is not an initial page load (reset/adIsSent) ADD!!!*/
      processApi().then((result) =>{
        /*!!! ADD 5.2 should be a notice if it responses with an error ADD!!!*/
        const processSimilarAdsFail = (error = false) =>{
          console.log(error);
        }
        if (!result) {
          processSimilarAdsFail();
        }
        if (result) {
          /*result - stringified data*/
          try{
            const dataOriginal = JSON.parse(result);
            /*!!! ADD 5.9 there should be no more than 10 ads at once ADD!!!*/
            /*mapCanvas - shoul be revised/renamed in dom.class & fill-container-with-template*/
            const DOM_CONTAINER_NAME = 'mapCanvas';
            /*get originalData, normalize it, clone and fill each node with the normalized data for each similar ad*/
            const NORMALIZED_ADS_NODES = domProcessor(dataOriginal, 'fillContainerWithTemplate', 'card', DOM_CONTAINER_NAME, true).mapPopUpNodes;
            console.log(NORMALIZED_ADS_NODES);
            /*remove old ads from the similar ads layer*/
            MAP_SIMILAR_ADS_MARKER_LAYER.clearLayers();
            NORMALIZED_ADS_NODES.forEach((ad) => {
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
            });
            /*all similar ads are loaded here*/
            /*!!! ADD here the ads filter form should be enabled if it is ok ADD!!!*/
            /*!!!ADD similar-ads processor ADD!!!*/
          } catch(error) {
            processSimilarAdsFail(error);
          }
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

export { mapProcessor };
