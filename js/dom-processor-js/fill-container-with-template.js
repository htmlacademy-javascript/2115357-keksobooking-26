/* functions */
import {getRandomNumber} from '../functions.js';

/* DOM processor functions */
import   { normalizeDataToDOM } from './normalize-data-to-dom.js';

/* fill a container with a template v1.2 */
const fillContainerWithTemplate = (dataOriginal, template, container, CMD) => {
  /* template && container - ready prop. of DOM object passed then the fn called */
  /* CMD - commands called on each template node added to the container */
  const data = {};
  let emptyFieldsChecker = 0;
  switch (template.nickName) {
    case 'card':
      /* card - a template to show an ad */
      while (!emptyFieldsChecker) {
        /* to be sure there's data in this ad */
        Object.keys(data).forEach((el) => delete data[el]);
        /* TEMP CHANGE !! tem data has 10 ads, chose 1 !!TEMP CHANGE*/
        Object.assign(data, dataOriginal[getRandomNumber(0, dataOriginal.length - 1)]);
        /* now it normalizes data for each template / element manually */
        /* now normalized data are separated from the Dom class */
        Object.assign(data, normalizeDataToDOM(data, template.nickName));
        emptyFieldsChecker = Object.values(data.templates[template.nickName]).length;
      }
      break;
    default:
      return false;
  }

  /* TEMP DELETE!! Empty some fileds to check out dispalynone TEMP DELETE!!*/
  Object.keys(data.templates[template.nickName]).forEach((el, id, ar) => {
    if (id === getRandomNumber(0, ar.length) && typeof data.templates[template.nickName][el] === 'string') {
      data.templates[template.nickName][el] = '';
    }
    if (id === getRandomNumber(0, ar.length) && typeof data.templates[template.nickName][el] === 'object') {
      data.templates[template.nickName][el] = [];
    }
  });
  /* TEMP DELETE!! empty one filed to check out dispalynone TEMP DELETE!!*/

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
  container.appendChild(newNode);
};
/* fill a container with a template */

export { fillContainerWithTemplate };
