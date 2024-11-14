chrome.runtime.onStartup.addListener(async () => {
  const data = await chrome.storage.sync.get(['urls', 'openInNewWindow']);
  const urls = data.urls || [];
  const openInNewWindow = data.openInNewWindow || false;

  if (urls.length > 0) {
    // Get existing tabs
    const existingTabs = await chrome.tabs.query({});
    const existingUrls = existingTabs.map(tab => tab.url);

    // Filter out URLs that are already open
    const urlsToOpen = urls.filter(url => !existingUrls.some(existingUrl => 
      existingUrl.includes(new URL(url).hostname)
    ));

    if (urlsToOpen.length > 0) {
      if (openInNewWindow) {
        chrome.windows.create({ url: urlsToOpen });
      } else {
        urlsToOpen.forEach(url => chrome.tabs.create({ url }));
      }
    }
  }
});