// OmniGateway Content Script (Manifest V3)

// Listen for messages from popup or sidepanel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'EXTRACT_PAGE_CONTENT') {
    try {
      const pageTitle = document.title || '';
      const selectedText = window.getSelection() ? window.getSelection().toString().trim() : '';

      // If user has highlighted text, prefer selection
      if (selectedText.length > 0) {
        sendResponse({
          ok: true,
          type: 'selection',
          title: pageTitle,
          text: selectedText,
          url: window.location.href
        });
        return true;
      }

      // Otherwise extract readable text from main / article / body
      const clone = document.body.cloneNode(true);

      // Strip useless interactive elements
      const elementsToRemove = clone.querySelectorAll('script, style, noscript, iframe, svg, nav, footer, header');
      elementsToRemove.forEach(el => el.remove());

      let textContent = clone.innerText || clone.textContent || '';
      // Clean up whitespace
      textContent = textContent.replace(/\s+/g, ' ').trim();

      // Cap to reasonable length (first 12,000 characters to fit easily in token limits)
      const maxLen = 12000;
      if (textContent.length > maxLen) {
        textContent = textContent.substring(0, maxLen) + '... [Content truncated]';
      }

      sendResponse({
        ok: true,
        type: 'page',
        title: pageTitle,
        text: textContent,
        url: window.location.href
      });
    } catch (err) {
      sendResponse({ ok: false, error: err.message });
    }
    return true;
  }
});
