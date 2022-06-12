/* disable: domProcessor(false, 'pageDisable') */
/* enable: domProcessor(false, 'pageEnable') */
const pageStateToggle = (toggle, DOM_CLASSES, ...DOM_CONTAINERS) => {
  /* DOM_CLASSES - whole DOM.CLASSES, could be reduced to used classes only */
  DOM_CONTAINERS.forEach((container) => {
    /* toggle containers state */
    /* container.selector e.g. - '.' container.value e.g. 'className'*/
    const containerRealNode = document.querySelector(`${container.selector}${container.value}`);
    containerRealNode.classList.toggle(DOM_CLASSES.adFormDisabled, toggle);
    /* Toggle children state */
    /* selector0Value1 e.g. - ['', 'input'] */
    /* selector0Value1 e.g. - ['.', 'className'] */
    if (container.children.pageToggle.length) {
      container.children.pageToggle.forEach((selector0Value1) => {
        [...containerRealNode.querySelectorAll(`${selector0Value1[0]}${selector0Value1[1]}`)]
          .forEach((child) => {
            child.disabled = toggle;
          });
      });
    }
  });
};

export { pageStateToggle };
