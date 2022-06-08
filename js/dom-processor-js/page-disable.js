const pageDisable = (classes, cmnds, ...nodes) => {
  /* nodes - still in the Dom.class */
  nodes.forEach((parentNode) => {
    /* disable parents */
    const parent = cmnds.getDOMNode(parentNode.selector, parentNode.value);
    parent.classList.add(classes.adFormDisabled);
    /* disable children */
    parentNode.children.toDisable.forEach((prefixSelector) => {
      const children = [...parent.querySelectorAll(`${prefixSelector[0]}${prefixSelector[1]}`)];
      children.forEach((child) => {
        child.disabled = true;
      });
    });
  });
};

export { pageDisable };
