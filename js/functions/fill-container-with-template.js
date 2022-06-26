/* DOM processor functions */
import   { normalizeCardTemplate } from './normalize-card-template.js';

/* DOM processor */
import   { processDomClass } from '../dom-class.js';

const BRIDGE_SELECTOR_PART1 = 'class';
/*
  BRIDGE_SELECTOR_PART1 - nodeAttribute, e.g. "class"
  BRIDGE_SELECTOR_PART2 - part of the nodeAttribute, eg. __title
  e.g.: <node class = "text__title">...</node>
  Then: node.querySelector where class contains __title
  node.querySelector('[class*="__title"]')'
  node - a real DOM element
  bridge-index joins apiData with the DOM elements via same indexes
  data.templates[template.nickName][bridge] - content
  newNode[bridgeSelector] - fragmentNode to fill
*/

const FEATURES_CLASS_PREFIX = '--';
const FEATURES_CHECKED_ATTRIBUTE = 'checked';
/*html containes empty lines (text children), so select the exact tagName*/
const FEATURES_TAG_NAME = 'li';
const IMAGES_TAG_NAME = 'img';
const IMAGES_ATTR_TO_SET = 'src';

/* fill a container with a template */
const fillContainerWithTemplate = (dataOriginal, template, container) => {
  const data = {};
  const DISPLAY_NONE_CLASS = processDomClass(false, 'getClass', 'hidden');
  const fillContainer = (fill = true) => {
    const newNode = template.fragment.content.cloneNode(true);
    /* fill fragmentNodes with the normalized data START */
    for (const bridge in template.fragment.children) {
      /* template.fragment.children[index] - name of data line: title, price etc.
      is the bridge btw the data and the fragment node */
      const BRIDGE_SELECTOR_PART2 = template.fragment.children[bridge].partToBridge;
      const nodeToFill = newNode.querySelector(`[${BRIDGE_SELECTOR_PART1}*="${BRIDGE_SELECTOR_PART2}"]`);
      if (bridge === 'features') {
        /*filter checked feature nodes*/
        const childNodes = [...nodeToFill.querySelectorAll(FEATURES_TAG_NAME)];
        childNodes.forEach((featureLiNode) => {
          const featureLiClasses = [...featureLiNode.classList].join();
          /*check if current feature (bridged part of its classes name) is present in the ad data*/
          if (data.templates[template.nickName][bridge]) {
            const checker =  data.templates[template.nickName][bridge].some((featureFromAd) =>
              featureLiClasses.includes(`${FEATURES_CLASS_PREFIX}${featureFromAd}`)
            );
            /*mark this node as OK if so*/
            featureLiNode.setAttribute(FEATURES_CHECKED_ATTRIBUTE, checker);
          }
        });
        /*hide all nodes that have not been marked as "checked"*/
        childNodes.forEach((featureLiNode) => {
          if (!featureLiNode.getAttribute(FEATURES_CHECKED_ATTRIBUTE)){
            featureLiNode.classList.add(DISPLAY_NONE_CLASS);
          }
        });
      }
      else if (bridge === 'photos') {
        /*clone the image node and set value from data as src*/
        const parent = nodeToFill;
        data.templates[template.nickName][bridge].forEach((src) => {
          const clone = parent.querySelector(IMAGES_TAG_NAME).cloneNode();
          clone.setAttribute(IMAGES_ATTR_TO_SET, src);
          parent.append(clone);
        });
        /*remove the template*/
        parent.querySelectorAll(IMAGES_TAG_NAME)[0].remove();
      }
      else if (bridge === 'avatar') {
        /*set value from data as src*/
        nodeToFill
          .setAttribute(IMAGES_ATTR_TO_SET, data.templates[template.nickName][bridge]);
      }
      else {
        /*set value from data as textContent*/
        nodeToFill
          .textContent = data.templates[template.nickName][bridge];
      }
      /* hide empty fields */
      if (!data.templates[template.nickName][bridge] || data.templates[template.nickName][bridge].length === 0) {
        nodeToFill.classList.add(DISPLAY_NONE_CLASS);
      }
    }
    /* fill fragmentNodes with the normalized data END */
    if (fill) {
      container.appendChild(newNode);
      return;
    }
    /*for the "card" template do not append but return a filled node back*/
    return newNode;
  };
  /* template && container - ready prop. of DOM object passed then the fn called */
  switch (template.nickName) {
    case 'card': {
      /* card - a template to show an ad in MAP_SIMILAR_MARKER_POPUP*/
      const normalizedAdsReturnToMap = [];
      dataOriginal.forEach((ad) => {
        /* empty data-container for a new ad and to be sure at least 1 filed has data */
        Object.keys(data).forEach((el) => delete data[el]);
        Object.assign(data, ad);
        /*normalizeCardTemplate ads new property (data.template[template.nickName]) to the original data with normalized nodes*/
        Object.assign(data, normalizeCardTemplate(data, template.nickName));
        if (Object.values(data.templates[template.nickName]).length) {
          /*recheck if it has the address, cannot be put on the map without the address*/
          if(typeof data.location !== 'undefined' && data.location) {
            /*it checks if(!hidden) in map.proc. addPopupsToSimilarAdsLayer()*/
            /*will not add this ad to popup if true,*/
            /*although it won't even add it to the array without address.*/
            data.offer.hidden = false;
            normalizedAdsReturnToMap.push([fillContainer(false), data.location, data.offer]);
          }
        }
      });
      /*put normalized popup-nodes to their container in the DOM.class*/
      template.mapPopUpNodes = normalizedAdsReturnToMap;
      break;
    }
    case 'success': {
      Object.assign(data, dataOriginal);
      fillContainer();
      break;
    }
    case 'error': {
      Object.assign(data, dataOriginal);
      fillContainer();
      break;
    }
    default:
      return false;
  }
};

export { fillContainerWithTemplate };
