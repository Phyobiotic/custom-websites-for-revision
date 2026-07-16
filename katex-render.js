window.addEventListener('load', function () {
  function renderTextNodes(node) {
    if (!node || !window.katex) return;

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (text.includes('\\(') || text.includes('\\[')) {
        const parent = node.parentElement;
        if (parent && !parent.classList.contains('katex')) {
          let html = text;
          
          // Render display math \[ ... \]
          html = html.replace(/\\\[([\s\S]*?)\\\]/g, function (_, expr) {
            try {
              return katex.renderToString(expr, { displayMode: true, throwOnError: false, strict: false });
            } catch (e) {
              return '\\[' + expr + '\\]';
            }
          });
          
          // Render inline math \( ... \)
          html = html.replace(/\\\(([\s\S]*?)\\\)/g, function (_, expr) {
            try {
              return katex.renderToString(expr, { displayMode: false, throwOnError: false, strict: false });
            } catch (e) {
              return '\\(' + expr + '\\)';
            }
          });
          
          const wrapper = document.createElement('span');
          wrapper.innerHTML = html;
          parent.insertBefore(wrapper, node);
          parent.removeChild(node);
        }
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;
      const children = Array.from(node.childNodes);
      children.forEach(renderTextNodes);
    }
  }

  renderTextNodes(document.body);
});
