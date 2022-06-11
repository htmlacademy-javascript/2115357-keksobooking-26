/* functions */

/* DOM processor functions */
import   { pageStateToggle }              from './dom-processor-js/page-state-toggle.js';
import   { fillContainerWithTemplate }    from './dom-processor-js/fill-container-with-template.js';

/* Dom class v1.1 */
class Dom {

  constructor() {
    this.SELECTORS = {
      /* consts for querySelectors */
      0: ['', 'tag'],
      1: ['#', 'id'],
      2: ['.', 'class'],
      /* ??? replace this.getClassConnector with just symbols ??? */
      classConnectors: {
        1: '__',
        2: '--',
        3: '-',
      },
    };
    this.CMD = {
      /* functions to run on a new node when filling a container with a template */
      /* textContent to a node */
      1: (node, textContent) => {
        node.textContent = textContent;
      },
      /* setAttribute to a node */
      2: (node, attributeValue, attribute) => {
        node.setAttribute(attribute, attributeValue);
      },
      /* clone a node's child to the same node, setAttribute to a child */
      3: (node, attributeValue, params) => {
        /* querySelect the container’s child and clone it to the container */
        /* the node has 1 child only, that is to clone */
        /* attributeValue: an array, eg. [src1, src2, src3, ... ] */
        /* params:
          [0] - ful querySelector, e.g. (tagName), (.className),
          [1] - attribute to set, e.g.: src, title
        */
        /* the new node gets an attribute with the content as the value */
        const selector = params[0];
        const attribute = params[1];
        if (selector && attribute && node.querySelector(selector)) {
          if (typeof attributeValue === 'object' && attributeValue.length && typeof attributeValue[0] !== 'undefined') {
            attributeValue.forEach((value) => {
              const clone = node.querySelector(selector) && node.querySelector(selector).cloneNode(true);
              clone.setAttribute(attribute, value);
              node.appendChild(clone);
            });
          }
          node.querySelectorAll(selector)[0].remove();
        }
      },
    };
    this.CHILDREN = {
      /* groups of elements with parameters to select nodes from the real DOM */
      /* groups are not consistent, each group is for its own purpose */
      popup: {
        title:        {
          value: 'title',
          selector: this.getSelector(2),
          cmd:  [1], //0 - cmd, 1 - param
        },
        address:      {
          value: `text${this.getClassConnector(2)}address`,
          selector: this.getSelector(2),
          cmd:  [1],
        },
        price:        {
          value: `text${this.getClassConnector(2)}price`,
          selector: this.getSelector(2),
          cmd:  [1],
        },
        type:         {
          value: 'type',
          selector: this.getSelector(2),
          cmd:  [1],
        },
        capacity:     {
          value: `text${this.getClassConnector(2)}capacity`,
          selector: this.getSelector(2),
          cmd:  [1],
        },
        time:         {
          value: `text${this.getClassConnector(2)}time`,
          selector: this.getSelector(2),
          cmd:  [1],
        },
        features:     {
          value: 'features',
          selector: this.getSelector(2),
          cmd:  [1],
        },
        description:  {
          value: 'description',
          selector: this.getSelector(2),
          cmd:  [1],
        },
        photos:       {
          value: 'photos',
          selector: this.getSelector(2),
          cmd:  [3, ['img', 'src']],
        },
        avatar:       {
          value: 'avatar',
          selector: this.getSelector(2),
          cmd:  [2, 'src'],
        },
      },
      toDisable: [
        [this.getSelector(0)[0], 'input'],
        [this.getSelector(0)[0], 'select'],
        [this.getSelector(0)[0], 'textarea'],
        [this.getSelector(0)[0], 'button'],
      ],
    };
    this.CONTAINERS = {
      /* elements with parameters to select nodes from the real DOM */
      mapCanvas: {
        value: `map${this.getClassConnector(3)}canvas`,
        selector: this.getSelector(1)[0],
      },
      adForm: {
        value: `ad${this.getClassConnector(3)}form`,
        selector: this.getSelector(2)[0],
        children: this.getChildrenForContainer(['toDisable', 0], ['toDisable', 1], ['toDisable', 2], ['toDisable', 3]),
      },
      mapFilters: {
        value: `map${this.getClassConnector(1)}filters`,
        selector: this.getSelector(2)[0],
        children: this.getChildrenForContainer(['toDisable', 0], ['toDisable', 1], ['toDisable', 2], ['toDisable', 3]),
      },
    };
    this.TEMPLATES = {
      /* groups of elements with to select real DOM templates */
      card: {
        id: 'card', // real DOM select fragment
        class: '',  // real DOM select fragment
        selector: this.getSelector(1),  // real DOM select fragment
        fragment: {
          id: '', // real DOM select fragment content
          class: 'popup', //real DOM select fragment content
          selector: this.getSelector(2), // real DOM select fragment content
          thisCHILDREN: 'popup', // list of children from this obj, not the DOM
          classConnector: this.getClassConnector(1), // class name parts connector
          content: '',
          children: {},
        },
      },
    };
    this.CLASSES = {
      /* list of real DOM classes */
      adFormDisabled: `ad${this.getClassConnector(3)}form${this.getClassConnector(2)}disabled`,
    };
    this.getChildrenForContainer = this.getChildrenForContainer.bind(this);
    this.getContainerNode = this.getContainerNode.bind(this);
    this.getSelector = this.getSelector.bind(this);
    this.getClassConnector = this.getClassConnector.bind(this);
    this.getFragmentChildren = this.getFragmentChildren.bind(this);
    this.getTemplateContent = this.getTemplateContent.bind(this);
    this.setTemplate = this.setTemplate.bind(this);
    this.clearContainer = this.clearContainer.bind(this);
  }

  getChildrenForContainer(...children) {
    /* this.CONTAINERS elements method */
    /* selects this.CHILDREN elements that belong to this this.CONTAINERS.element */
    const foundChildren = {};
    children.forEach((category0Index1) => {
      if (typeof foundChildren[category0Index1[0]] === 'undefined') {
        foundChildren[category0Index1[0]] = [];
      }
      if (this.CHILDREN[category0Index1[0]] && this.CHILDREN[category0Index1[0]][category0Index1[1]]) {
        foundChildren[category0Index1[0]].push(this.CHILDREN[category0Index1[0]][category0Index1[1]]);
      }
    });
    return foundChildren;
  }

  getContainerNode(containerName) {
    /* get the real container’s node from the DOM */
    return this.CONTAINERS[containerName] &&
      this.CONTAINERS[containerName].selector &&
      this.CONTAINERS[containerName].value &&
      document.querySelector(`${this.CONTAINERS[containerName].selector}${this.CONTAINERS[containerName].value}`)
    || false;
  }

  getSelector(index) {
    return this.SELECTORS[index];
  }

  getClassConnector(index) {
    return this.SELECTORS.classConnectors[index];
  }

  getFragmentChildren(template) {
    /* get fragment's children from the prepaired list,
    (not from the real DOM - to be sure it's bridged with the data properly) */
    /* nodes that are not in the prepaired list
    or have empty data will be displaynoned */
    template.fragment.children = this.CHILDREN[template.fragment.thisCHILDREN] || '';
  }

  getTemplateContent(template) {
    if (document.querySelector(`${template.selector[0]}${template[template.selector[1]]}`)) {
      template.fragment.content = document
        .querySelector(`${template.selector[0]}${template[template.selector[1]]}`)
        .content
        .querySelector(`${template.fragment.selector[0]}${template.fragment[template.fragment.selector[1]]}`);
    }
  }

  setTemplate(templateName) {
    /* prepare a template from this.TEMPLATES to futher use */
    /* fills a template with real nodes from the DOM */
    const template = this.TEMPLATES[templateName];
    if (!template) {
      return false;
    }
    /* reset template */
    template.nickName = '';
    template.fragment.content = '';
    template.fragment.children = {};
    /* fill content with HTML from the real DOM */
    this.getTemplateContent(template);
    /* get template's "children" */
    this.getFragmentChildren(template);
    if (template.fragment.content && template.fragment.children) {
      template.nickName = templateName;
      return template;
    }
    template.fragment.content = '';
    template.fragment.children = {};
    return '';
  }

  clearContainer(container) {
    /* removes all child nodes of a given container */
    container = this.getContainerNode(container);
    if (container && container.childNodes) {
      [...container.childNodes].forEach((children, index) => {
        if (typeof container.childNodes[index] !== 'undefined') {
          container.childNodes[index].remove();
        }
      });
    }
  }

}
const DOM = new Dom();

/* entry point to domProcessor START */
const domProcessor = (dataOriginal = false, ...params) => {
  /* params[0] - what to do */
  switch (params[0]) {
    /* get a template and fill a container with it */
    case 'fillContainerWithTemplate': {
      /* COMMAND: domProcessor(adsObject, 'fillContainerWithTemplate', TEMPLATE_FROM_DOM_CLASS, CONTAINER_FROM_DOM_CLASS) */
      /* adsObject - dataObject, params[1] template, params[2] container */
      const template = DOM.setTemplate(params[1]);
      const container = DOM.getContainerNode(params[2]);
      if (template && container && dataOriginal &&
        typeof dataOriginal === 'object') {
        fillContainerWithTemplate(dataOriginal, template, container, DOM.CMD);
      }
      break;
    }
    /* removes all child nodes from a given container */
    case 'clearContainer':
      /* COMMAND: domProcessor(false, 'clearContainer', CONTAINER_FROM_DOM_CLASS); */
      /* params[1] container to clear */
      DOM.clearContainer(params[1]);
      break;
    /* toggle the state of the page START */
    case 'pageDisable':
      /* COMMAND: domProcessor(false, 'pageDisable');*/
      pageStateToggle(true, DOM.CLASSES, DOM.CONTAINERS['adForm'], DOM.CONTAINERS['mapFilters']);
      break;
    case 'pageEnable':
      /* COMMAND: domProcessor(false, 'pageEnable');*/
      pageStateToggle(false, DOM.CLASSES, DOM.CONTAINERS['adForm'], DOM.CONTAINERS['mapFilters']);
      break;
    /* toggle the state of the page END */
    default:
      return null;
  }
};
/* entry point to domProcessor END */

export { domProcessor };
