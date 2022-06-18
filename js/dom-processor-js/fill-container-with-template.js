/* DOM processor functions */
import   { normalizeDataToDOM } from './normalize-data-to-dom.js';

/* fill a container with a template */
const fillContainerWithTemplate = (dataOriginal, template, container, CMD) => {
  const data = {};
  /*second stage - fill the container START*/
  const fillContainer = (fill = true) => {
    const newNode = template.fragment.content.cloneNode(true);
    /* fill fragmentNodes with the normalized data START */
    for (const index in template.fragment.children) {
      /* template.fragment.children[index] - name of data line: title, price etc.
      is the bridge btw the data and the fragment node */
      const bridge = index;
      const bridgeSelector = [];
      bridgeSelector.push(template.fragment.children[bridge].selector[1]);
      bridgeSelector.push(`${template.fragment.classConnector}${template.fragment.children[bridge].value}`);

      /* bridgeSelector[0] - nodeAttribute, e.g. "class" */
      /* bridgeSelector[1] - part of the nodeAttribute, eg. "__title"
      e.g.: <node class = "text__title">...</node>
      */
      /* Then: newNode.querySelector where nodeAttribute contains __title */
      /* newNode.querySelector('[class*="__title"]')' */
      /* newNode - a real DOM element */
      /* "class" and "__title" are prepaired values generated from the Dom.class */
      /* bridge-index joins apiData with the DOM elements via same indexes */

      /* data.templates[template.nickName][bridge] - content */
      /* newNode[bridgeSelector] - fragmentNode to fill  */

      /* cmd - how the content should be put into the container */
      /* params passed to cmd */

      const cmd = template.fragment.children[bridge].cmd[0] || false;
      const params = template.fragment.children[bridge].cmd[1] || false;
      if (typeof CMD[cmd] !== 'undefined' && data.templates[template.nickName][bridge]) {
        CMD[cmd](
          newNode.querySelector(`[${bridgeSelector[0]}*="${bridgeSelector[1]}"]`),
          data.templates[template.nickName][bridge],
          params
        );
      }
      /* hide empty fields */
      if (!data.templates[template.nickName][bridge]) {
        /* !!! TEMP CHANGE add a real class to hide an empty element */
        newNode.querySelector(`[${bridgeSelector[0]}*="${bridgeSelector[1]}"]`).style.display = 'none';
      }
    }
    /* fill fragmentNodes with the normalized data END */
    if (fill) {
      container.appendChild(newNode);
      return;
    }

    /*for the "card" template do not append but return a filled node back*/
    /*task misunderstanding from the beginning, needs to be revised.*/
    return newNode;
  };
  /*second stage - fill the container END*/
  /*first stage - prepare to fill the container START*/
  /* template && container - ready prop. of DOM object passed then the fn called */
  /* CMD - commands called on each template node added to the container */
  switch (template.nickName) {
    case 'card': {
      /* card - a template to show an ad in MAP_SIMILAR_MARKER_POPUP*/
      const normalizedAdsReturnToMap = [];
      dataOriginal.forEach((ad) => {
        /* reempty data-container for a new ad and to be sure at least 1 filed has data */
        Object.keys(data).forEach((el) => delete data[el]);
        Object.assign(data, ad);
        Object.assign(data, normalizeDataToDOM(data, template.nickName));
        if (Object.values(data.templates[template.nickName]).length) {
          /*recheck if it has the address, cannot be put on the map without the address*/
          if(typeof data.location !== 'undefined' && data.location) {
            normalizedAdsReturnToMap.push([fillContainer(false), data.location]);
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
  /*first stage - prepare to fill the container END*/
};
/* fill a container with a template */

export { fillContainerWithTemplate };
