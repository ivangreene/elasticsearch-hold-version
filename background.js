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
  let responseHeaders = response.responseHeaders;
  if (response.type === "main_frame" && response.url.match(/^https?:\/\/www\.elastic\.co.*reference/)
    && !response.url.match(`reference/${esDocsVersion}`)
    && response.initiator && response.initiator.match(/^https?:\/\/www\.google\.com/)) {
    return {
      redirectUrl: response.url.replace(/reference\/[^/]+/, `reference/${esDocsVersion}`),
    };
  }
  return {};
}, {
  urls: ["*://*.elastic.co/*"],
  types: ["main_frame"]
}, ["blocking", "responseHeaders"]);
