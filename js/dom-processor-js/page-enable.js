const pageEnable = (classes, cmnds, ...nodes) => {
  /* nodes - still in the Dom.class */
  nodes.forEach((parentNode) => {
    /* enable parents */
    const parent = cmnds.getDOMNode(parentNode.selector, parentNode.value);
    parent.classList.remove(classes.adFormDisabled);
    /* disable children */
    parentNode.children.toDisable.forEach((prefixSelector) => {
      const children = [...parent.querySelectorAll(`${prefixSelector[0]}${prefixSelector[1]}`)];
      children.forEach((child) => {
        child.disabled = false;
      });
    });
  });
};

export { pageEnable };
