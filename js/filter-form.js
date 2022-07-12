import { assistApp } from './app-assistant.js';
import { pullFromServer } from './fetch.js';
import { validateAdForm } from './ad-form.js';

/*turn the adForm off*/
assistApp(false, 'adFormDisable');
/*turn the mapFilterForm off */
assistApp(false, 'filterFormDisable');

/*VARS START*/
const similarAds = assistApp(false, 'getConfig', 'similarAdsConfig');
const refreshButton = assistApp(false, 'getConfig', 'refreshButtonConfig');
const mapContainerElement = 'mapCanvas';
const mapContainer = assistApp(false, 'getContainer', mapContainerElement);
const filterFormElement = 'mapFilters';
const filterForm = assistApp(false, 'getContainer', filterFormElement);
/*VARS END*/

/*NODES START*/
const filterFormNode = document.querySelector(filterForm.selector);
const refreshButtonNode = document.createElement('div');
refreshButtonNode.classList.add(refreshButton.class1);
refreshButtonNode.classList.add(refreshButton.class2);
refreshButtonNode.textContent = refreshButton.text;
/*NODES END*/

/*FUNCTIONS START*/
/*ads comparison*/
const addPopupsToSimilarAdsLayer = () => {
  similarAds.nodes.forEach((ad) => {
    /*indexes 0 - popup node, 1 - address, 2 rest data*/
    if (!ad[similarAds.parameters.dataKey].hidden) {
      const mapSimilarAdMarker = L.marker(
        {
          lat: ad[similarAds.parameters.addressKey].lat,
          lng: ad[similarAds.parameters.addressKey].lng,
        },
        {icon: mapContainer.similarMarker},
      );
      mapSimilarAdMarker
        .addTo(mapContainer.similarAdsLayer)
        .bindPopup(ad[similarAds.parameters.popupNodeKey]);
    }
  });
};
const removeFilters = () => {
  /*unmark node to hide*/
  for (const nodeKey in similarAds.nodes) {
    similarAds.nodes[nodeKey][similarAds.parameters.dataKey].hidden = false;
  }
};
const markAdToHide = (popUpNode) => {
  /*mark node to hide*/
  const hideElementKey = similarAds.nodes.findIndex((ads) => ads[similarAds.parameters.popupNodeKey] === popUpNode);
  similarAds.nodes[hideElementKey][similarAds.parameters.dataKey].hidden = true;
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
    const property = property0Value1[0].replace(similarAds.parameters.classFirstPart, '');
    const value = property0Value1[1] === similarAds.parameters.anyWord ? 0 : property0Value1[1];
    switch (property) {
      case similarAds.parameters.typeField: {
        /*normalize type conditions*/
        dataToCompareUser[property] = value;
        break;
      }
      case similarAds.parameters.roomsField: {
        /*normalize rooms conditions*/
        dataToCompareUser[property] = Number(value);
        break;
      }
      case similarAds.parameters.guestsField: {
        /*normalize guests conditions*/
        dataToCompareUser[property] = value;
        break;
      }
      case similarAds.parameters.priceField: {
        /*normalize price conditions*/
        dataToCompareUser[property] = filterForm.children[property][value];
        break;
      }
      case similarAds.parameters.featuresField: {
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
    const dataToComparePopUpNode = similarAds.nodes[node][similarAds.parameters.popupNodeKey];
    const dataToCompareAd = similarAds.nodes[node][similarAds.parameters.dataKey];
    /*only if it is not "any" (not 0) */
    /*compare type*/
    if (dataToCompareUser[similarAds.parameters.typeField]) {
      if (dataToCompareAd[similarAds.parameters.typeField] !== dataToCompareUser[similarAds.parameters.typeField]) {
        markAdToHide(dataToComparePopUpNode);
        continue;
      }
    }
    /*compare rooms*/
    if (dataToCompareUser[similarAds.parameters.roomsField]) {
      if (dataToCompareAd[similarAds.parameters.roomsField] !== dataToCompareUser[similarAds.parameters.roomsField]) {
        markAdToHide(dataToComparePopUpNode);
        continue;
      }
    }
    /*compare guests, here's is a special filter for "any"*/
    /*any === 0, not for guests === '0'*/
    /*if it is 'any'(0) it mooves on, if it is NFG ('0') it goes inside*/
    if (dataToCompareUser[similarAds.parameters.guestsField]) {
      const intForGuestsNumberUser = Number(dataToCompareUser[similarAds.parameters.guestsField]);
      if (dataToCompareAd[similarAds.parameters.guestsField] < intForGuestsNumberUser ||
        intForGuestsNumberUser === 0 && intForGuestsNumberUser !== dataToCompareAd[similarAds.parameters.guestsField]
      ) {
        markAdToHide(dataToComparePopUpNode);
        continue;
      }
    }
    /*compare price*/
    if (dataToCompareUser[similarAds.parameters.priceField]) {
      if (
        /*min price*/
        dataToCompareAd[similarAds.parameters.priceField] < dataToCompareUser[similarAds.parameters.priceField][0] ||
        /*max price*/
        dataToCompareAd[similarAds.parameters.priceField] > dataToCompareUser[similarAds.parameters.priceField][1]
      ) {
        markAdToHide(dataToComparePopUpNode);
        continue;
      }
    }
    /*compare features*/
    /*the ad being compared should have all the features from the user choice*/
    if (dataToCompareUser[similarAds.parameters.featuresField] && !dataToCompareAd[similarAds.parameters.featuresField]) {
      markAdToHide(dataToComparePopUpNode);
    } else if (dataToCompareUser[similarAds.parameters.featuresField] && dataToCompareAd[similarAds.parameters.featuresField]) {
      const userFeature = dataToCompareUser[similarAds.parameters.featuresField];
      const adFeature = dataToCompareAd[similarAds.parameters.featuresField];
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
  clearTimeout(similarAds.parameters.filterDelayTimeOut);
  similarAds.parameters.filterDelayTimeOut = setTimeout(() => {
    filterSimilarAds();
  }, similarAds.parameters.filterDelayLength);
};
const resetSimilarAdsFilterForm = () => {
  filterFormNode.reset();
};
/*refresh button*/
const deleteRefreshButton = () => {
  const refreshButtonNodeChecker = document.querySelector(`.${refreshButton.class2}`);
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
      const dataOriginal = response.sort(() => Math.random() - similarAds.parameters.shuffleRandomizer).slice(0, similarAds.parameters.adsMaxNumber);
      /*mapCanvas - should be revised/renamed in dom.class & fill-container-with-template*/
      /*normalize originalData, clone and fill each node with the normalized data for each similar ad*/
      similarAds.nodes = assistApp(dataOriginal, 'fillContainerWithTemplate', 'card', similarAds.parameters.templateContainerName, true)[similarAds.parameters.mapPopUpNodes];
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

filterFormNode.addEventListener('change', filterFormChangeHandler);
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
