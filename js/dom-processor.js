/* functions */

/* DOM processor functions */
import   { getLocalText }                 from './dom-processor-js/normalize-data-to-dom.js';
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
      /* elements inside groups are not consistent (has different properties/structure), each group has its own purpose. */
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
      pageToggle: [
        [this.getSelector(0)[0], 'input'],
        [this.getSelector(0)[0], 'select'],
        [this.getSelector(0)[0], 'textarea'],
        [this.getSelector(0)[0], 'button'],
      ],
      adForm: {
        /* as in HTML */
        avatar: {
          value: 'avatar',
          selector: this.getSelector(1),
        },
        description: {
          value: 'description',
          selector: this.getSelector(1),
        },
        features: {
          value: 'features',
          selector: this.getSelector(2),
          wifi: {
            value: 'feature-wifi',
            selector: this.getSelector(1),
          },
          dishwasher: {
            value: 'feature-dishwasher',
            selector: this.getSelector(1),
          },
          parking: {
            value: 'feature-parking',
            selector: this.getSelector(1),
          },
          washer: {
            value: 'feature-washer',
            selector: this.getSelector(1),
          },
          elevator: {
            value: 'feature-elevator',
            selector: this.getSelector(1),
          },
          conditioner: {
            value: 'feature-conditioner',
            selector: this.getSelector(1),
          },
        },
        submit: {
          value: 'ad-form__submit',
          selector: this.getSelector(2),
        },
        reset: {
          value: 'ad-form__reset',
          selector: this.getSelector(2),
        },
        /* required */
        title: {
          value: 'title',
          selector: this.getSelector(1),
          cmd: [2, [
            [30, 'minlength'],
            [100, 'maxlength'],
            ['', 'required'],
          ],],
        },
        price: {
          value: 'price',
          selector: this.getSelector(1),
          cmd: [2, [
            ['number', 'type'],
            [100000, 'max'],
            ['', 'required'],
            /*! add slider noUiSlider !*/
          ],],

        },
        images: {
          value: 'images',
          selector: this.getSelector(1),
          cmd: [2, [
            ['image/*', 'accept'],
          ],],
        },
        /* need validation / dependencies */
        type: {
          value: 'type',
          selector: this.getSelector(1),
          optionsToValidate: {
            bungalow: {
              name: getLocalText('bungalow'),
              minPrice: 0,
            },
            flat: {
              name: getLocalText('flat'),
              minPrice: 1000,
            },
            hotel: {
              name: getLocalText('hotel'),
              minPrice: 3000,
            },
            house: {
              name: getLocalText('house'),
              minPrice: 5000,
            },
            palace: {
              name: getLocalText('palace'),
              minPrice: 10000,
            },
          },
          subjectToValidate: {
            subjectName: 'price',
            cmd: [2, ['', 'min']],
          },
        },
        timein: {
          value: 'timein',
          selector: this.getSelector(1),
          /*
          Поля «Время заезда» и «Время выезда» синхронизированы: при изменении значения одного поля во втором выделяется соответствующее ему значение. Например, если время заезда указано «после 14», то время выезда будет равно «до 14» и наоборот.
          value: `<select id="timein" name="timein">
              <option value="12:00" selected="">После 12</option>
              <option value="13:00">После 13</option>
              <option value="14:00">После 14</option>
            </select>`,*/
        },
        timeout: {
          value: 'timeout',
          selector: this.getSelector(1),
          /*value: `<select id="timeout" name="timeout" title="Time to go out">
              <option value="12:00" selected="">Выезд до 12</option>
              <option value="13:00">Выезд до 13</option>
              <option value="14:00">Выезд до 14</option>
            </select>`,*/
        },
        roomNumber: {
          value: 'room_number',
          selector: this.getSelector(1),
          /*
          Поле «Количество комнат» синхронизировано с полем «Количество мест» таким образом, что при выборе количества комнат вводятся ограничения на допустимые варианты выбора количества гостей:
          1 комната — «для 1 гостя»;
          2 комнаты — «для 2 гостей» или «для 1 гостя»;
          3 комнаты — «для 3 гостей», «для 2 гостей» или «для 1 гостя»;
          100 комнат — «не для гостей».
          Обратите внимание, под ограничениями подразумевается валидация.
          Ограничение путём удаления из разметки лишних <option> или добавления им состояния disabled приведёт к плохому UX (опыту взаимодействия). Даже если уже выбранное значение не попадает под новые ограничения, не стоит без ведома пользователя изменять значение поля. Пусть ошибку отловит валидация формы.
          value: `<select id="room_number" name="rooms">
              <option value="1" selected="">1 комната</option>
              <option value="2">2 комнаты</option>
              <option value="3">3 комнаты</option>
              <option value="100">100 комнат</option>
            </select>`,*/
        },
        capacity: {
          value: 'capacity',
          selector: this.getSelector(1),
          /*value: `<select id="capacity" name="capacity">
              <option value="3" selected="">для 3 гостей</option>
              <option value="2">для 2 гостей</option>
              <option value="1">для 1 гостя</option>
              <option value="0">не для гостей</option>
            </select>`,*/
        },
        /* other */
        address: {
          value: 'address',
          selector: this.getSelector(1),
          cmd: [2, [
            ['', 'readonly'],
          ],],
        },
      },
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
        cmd: [2, [
          ['POST', 'method'],
          ['https://26.javascript.pages.academy/keksobooking', 'action'],
          ['multipart/form-data', 'enctype'],
        ],],
        children: {
          pageToggle: this.getChildrenForContainer(['pageToggle', [0, 1, 2, 3]]),
          adForm: this.getChildrenForContainer(['adForm']),
        },
      },
      mapFilters: {
        value: `map${this.getClassConnector(1)}filters`,
        selector: this.getSelector(2)[0],
        children: {
          pageToggle: this.getChildrenForContainer(['pageToggle', [0, 1, 2, 3]]),
        },
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
      pristineAdFormClass: {
        classTo: 'ad-form__element',
        errorClass: 'form__item--invalid',
        successClass: 'form__item--valid',
        errorTextParent: 'ad-form__element',
        errorTextTag: 'span',
        errorTextClass: 'form__error'
      }
    };
    this.getCMD = this.getCMD.bind(this);
    this.getChild = this.getChild.bind(this);
    this.getChildrenForContainer = this.getChildrenForContainer.bind(this);
    this.getContainer = this.getContainer.bind(this);
    this.getClass = this.getClass.bind(this);
    this.getContainerNode = this.getContainerNode.bind(this);
    this.getSelector = this.getSelector.bind(this);
    this.getClassConnector = this.getClassConnector.bind(this);
    this.getFragmentChildren = this.getFragmentChildren.bind(this);
    this.getTemplateContent = this.getTemplateContent.bind(this);
    this.setTemplate = this.setTemplate.bind(this);
    this.clearContainer = this.clearContainer.bind(this);
  }

  getCMD(cmdIndex) {
    return this.CMD[cmdIndex] && this.CMD[cmdIndex] || false;
  }

  getChild(group, childName) {
    return this.CHILDREN[group] && this.CHILDREN[group][childName] && this.CHILDREN[group][childName] || false;
  }

  getChildrenForContainer(category0Indexes1) {
    /* this.CONTAINERS elements method */
    /* selects this.CHILDREN elements that belong to this this.CONTAINERS.element */
    /* children - [category0[Indexes1]] */
    if (typeof this.CHILDREN[category0Indexes1[0]] !== 'undefined') {
      /* add only some child, array will be returned */
      if(category0Indexes1[1] && category0Indexes1[1].length) {
        const foundChildren = [];
        category0Indexes1[1].forEach((children) => {
          if (this.CHILDREN[category0Indexes1[0]][children]) {
            foundChildren.push(this.CHILDREN[category0Indexes1[0]][children]);
          }
        });
        return foundChildren;
      } else {
        /* add all children from the group, object will be returned */
        return this.CHILDREN[category0Indexes1[0]];
      }
    }
  }

  getContainer(containerName) {
    return this.CONTAINERS[containerName] && this.CONTAINERS[containerName] || false;
  }

  getContainerNode(containerName) {
    /* get the real container’s node from the DOM */
    return this.CONTAINERS[containerName] &&
      this.CONTAINERS[containerName].selector &&
      this.CONTAINERS[containerName].value &&
      document.querySelector(`${this.CONTAINERS[containerName].selector}${this.CONTAINERS[containerName].value}`)
    || false;
  }

  getClass(className) {
    return this.CLASSES[className] && this.CLASSES[className] || false;
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
    /* get container from DOM class with children*/
    case 'getContainer':
      /* COMMAND: domProcessor(false, 'getContainer', CONTAINER_FROM_DOM_CLASS_NAME); */
      /* params[1] - container's name */
      return DOM.getContainer(params[1]);
    case 'getCMD':
      /* COMMAND: domProcessor(false, 'getCMD', CMD_INDEX); */
      return DOM.getCMD(params[1]);
    case 'getClass':
      /* COMMAND: domProcessor(false, 'getClass', className); */
      return DOM.getClass(params[1]);
    case 'getChild':
      /* COMMAND: domProcessor(false, 'getChild', groupName, childName); */
      return DOM.getChild(params[1], params[2]);
    default:
      return null;
  }
};
/* entry point to domProcessor END */

export { domProcessor };

//<form className="ad-form" method="post" encType="multipart/form-data" autoComplete="off">
