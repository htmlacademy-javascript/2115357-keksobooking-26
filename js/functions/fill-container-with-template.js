import { normalizeCardTemplate } from './normalize-card-template.js';
import { assistApp } from '../app-assistant.js';

const data = {
  newData: {},
  originalData: '',
  template: '',
  container: '',
  hiddenClass: '',
};

const featuresProperties = {
  classPrefix: '--',
  checkedAttribute: 'checked',
  tagName: 'li',
};
const imageProperties = {
  attribute: 'src',
  tagName: 'img',
};

const hideNode = (node) => {
  node.classList.add(data.hiddenClass);
};

const bridgeFeatures = (nodeToFill, templateNickname, bridge) => {
  const childNodes = [...nodeToFill.querySelectorAll(featuresProperties.tagName)];
  childNodes.forEach((featureNode) => {
    const featureClasses = [...featureNode.classList].join();
    /*
    check if current feature
    (bridged part of its classes name)
    is present in the ad data
    */
    if (data.newData.templates[templateNickname][bridge]) {
      /* data.templates[templateNickname][bridge] eg.:
      *data.templates['card']['features'][0 => 'conditioner', 1 => ...]
      * */
      const checker =  data.newData.templates[templateNickname][bridge].some((featureFromAd) =>
        featureClasses.includes(`${featuresProperties.classPrefix}${featureFromAd}`)
      );
      /*mark this node as OK if so*/
      featureNode.setAttribute(featuresProperties.checkedAttribute, checker);
    }
  });
  /*hide all nodes that have not been marked as "checked"*/
  childNodes.forEach((featureLiNode) => {
    if (!featureLiNode.getAttribute(featuresProperties.checkedAttribute)){
      hideNode(featureLiNode);
    }
  });
};
const bridgePhotos = (nodeToFill, templateNickname, bridge) => {
  /*clone the image node and set value from data as src*/
  const parent = nodeToFill;
  data.newData.templates[templateNickname][bridge].forEach((dataImgSrc) => {
    const clone = parent.querySelector(imageProperties.tagName).cloneNode();
    clone.setAttribute(imageProperties.attribute, dataImgSrc);
    parent.append(clone);
  });
  /*remove the template*/
  parent.querySelectorAll(imageProperties.tagName)[0].remove();
};
const bridgeAvatar = (nodeToFill, templateNickname, bridge) => {
  /*set value from data as src*/
  nodeToFill
    .setAttribute(imageProperties.attribute, data.newData.templates[templateNickname][bridge]);
};
const bridgeOthers = (nodeToFill, templateNickname, bridge) => {
  /*set value from data as textContent*/
  nodeToFill
    .textContent = data.newData.templates[templateNickname][bridge];
};

const fillContainer = (fill = true) => {
  const newNode = data.template.fragment.content.cloneNode(true);
  /* fill fragmentNodes with the normalized data START */
  for (const bridge in data.template.fragment.children) {
    /*
    template.fragment.children[bridge] - name of data line: title, price etc.
    is the bridge btw the data and the fragment node
    */
    const BRIDGE_SELECTOR_PART1 = data.template.fragment.children[bridge].partType;
    const BRIDGE_SELECTOR_PART2 = data.template.fragment.children[bridge].partToBridge;
    /*
      BRIDGE_SELECTOR_PART1 - nodeAttribute, e.g. "class"
      BRIDGE_SELECTOR_PART2 - part of the nodeAttribute, eg. __title
      e.g.: <node class = "text__title">...</node>
      Then: node.querySelector where class contains __title
      node.querySelector('[class*="__title"]')'
      node - a real DOM element
      bridge joins dataFromServer with the DOM elements via same indexes
      data.templates[template.nickName][bridge] - content
      newNode[bridgeSelector] - fragmentNode to fill
    */
    const nodeToFill = newNode.querySelector(`[${BRIDGE_SELECTOR_PART1}*="${BRIDGE_SELECTOR_PART2}"]`);
    switch (bridge) {
      case 'features': {
        bridgeFeatures(nodeToFill, data.template.nickName, bridge);
        break;
      }
      case 'photos': {
        bridgePhotos(nodeToFill, data.template.nickName, bridge);
        break;
      }
      case 'avatar': {
        bridgeAvatar(nodeToFill, data.template.nickName, bridge);
        break;
      }
      default: {
        bridgeOthers(nodeToFill, data.template.nickName, bridge);
        break;
      }
    }
    /* hide empty fields */
    if (!data.newData.templates[data.template.nickName][bridge] || data.newData.templates[data.template.nickName][bridge].length === 0) {
      hideNode(nodeToFill);
    }
  }

  /* fill fragmentNodes with the normalized data END */
  if (fill) {
    data.container.appendChild(newNode);
    return;
  }
  /*for the "card" template do not append but return a filled node */
  return newNode;
};

const prepareCardTemplateData = () => {
  const normalizedAdsReturnToMap = [];
  data.originalData.forEach((ad) => {
    /* empty data-container for a new ad and to be sure at least 1 filed has data */
    Object.keys(data.newData).forEach((el) => delete data.newData[el]);
    Object.assign(data.newData, ad);
    /*normalizeCardTemplate ads new property (data.template[template.nickName]) to the original data with normalized nodes*/
    Object.assign(data.newData, normalizeCardTemplate(data.newData, data.template.nickName));
    if (Object.values(data.newData.templates[data.template.nickName]).length) {
      /*recheck if it has the address, cannot be put on the map without the address*/
      if (typeof data.newData.location !== 'undefined' && data.newData.location) {
        data.newData.offer.hidden = false;
        normalizedAdsReturnToMap.push([fillContainer(false), data.newData.location, data.newData.offer]);
      }
    }
  });
  return normalizedAdsReturnToMap;
};
const prepareOtherTemplatesData = () => {
  /* empty data-container */
  Object.keys(data.newData).forEach((el) => delete data.newData[el]);
  Object.assign(data.newData, data.originalData);
};

/* fillContainerWithTemplate starts in app-assistant
* its data (dataOriginal, template, container)
* come from there as well!
*/
const fillContainerWithTemplate = (dataOriginal, template, container) => {

  data.originalData = dataOriginal;
  data.template = template;
  data.container = container;
  data.hiddenClass = assistApp(false, 'getClass', 'hidden');

  switch (template.nickName) {
    case 'card': {
      /* card - MAP_SIMILAR_MARKER_POPUP*/
      template.mapPopUpNodes = prepareCardTemplateData();
      break;
    }
    default:
      prepareOtherTemplatesData();
      fillContainer();
  }
};

export { fillContainerWithTemplate };
