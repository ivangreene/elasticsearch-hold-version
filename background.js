let esDocsVersion = '';

chrome.runtime.onMessage.addListener(message => {
  if (message.newVersionChosen) {
    newVersionChosen();
  }
});

function newVersionChosen() {
  chrome.storage.sync.get({
    esDocsVersion: '2.4',
  }, function({ esDocsVersion: confVersion }) {
    esDocsVersion = confVersion;
  });
}

newVersionChosen();

chrome.webRequest.onHeadersReceived.addListener(response => {
  if (response.type === "main_frame" && response.url.match(/^https?:\/\/www\.elastic\.co.*reference/)
    && !response.url.match(`reference/${esDocsVersion}`) && !response.url.match('noredirect')
    && response.initiator && response.initiator.match(/^https?:\/\/www\.google\.com/)) {
    return {
      redirectUrl: response.url.replace(/reference\/[^/]+/, `reference/${esDocsVersion}`),
    };
  } else if (response.statusLine === "HTTP/1.1 404" && response.url.match(`reference/${esDocsVersion}`)) {
    return {
      redirectUrl: response.url.replace(`reference/${esDocsVersion}`, 'reference/current')
        .replace(/$/, '#noredirect'),
    };
  }
  return {};
}, {
  urls: ["*://*.elastic.co/*"],
  types: ["main_frame"]
}, ["blocking", "responseHeaders"]);
