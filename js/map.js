import { assistApp } from './app-assistant.js';
import {recordAdAddressFromMap} from './ad-form.js';
import { processTheMap } from './filter-form.js';

const CONTAINER_CLASS = 'mapCanvas';
const container = assistApp(false, 'getContainer', CONTAINER_CLASS);

const initializeMap = () => {
  container.map = L
    .map(container.selector.replace('#',''))
    .on('load', () => {
      /*set initial address field value in adForm*/
      recordAdAddressFromMap({lat: container.initialLat, lng: container.initialLng}, true);
      processTheMap();
    })
    .setView({lat: container.initialLat, lng: container.initialLng,}, container.initialZoom);
  /*mount openmap to the map*/
  L
    .tileLayer(container.openMap.url, {attribution: container.openMap.attribution,},)
    .addTo(container.map);
  /*similar ads layer*/
  container.similarAdsLayer = L
    .layerGroup()
    .addTo(container.map);
  /*main marker*/
  container.mainMarker = L
    .marker(
      {lat: container.initialLat, lng: container.initialLng,},
      {draggable: true,/*marker pin*/icon: L.icon(container.mainMarkerParam),},
    );
  /*mount the main marker to the map*/
  container.mainMarker.addTo(container.map);
  /*onMainMarkerMove send new addresses to the validation processor*/
  container.mainMarker.on('moveend', (mapEv) => {
    recordAdAddressFromMap(mapEv.target.getLatLng());
  });
  /*similar marker*/
  container.similarMarker = L.icon(container.similarMarkerParam);
};

export { initializeMap };
