function save_options() {
  const esDocsVersion = document.getElementById('version').value;
  chrome.storage.sync.set({
    esDocsVersion,
  }, function() {
    chrome.runtime.sendMessage({ newVersionChosen: true });
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    esDocsVersion: '2.4',
  }, function({ esDocsVersion }) {
    document.getElementById('version').value = esDocsVersion;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
