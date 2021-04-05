let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

console.log("eita");
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  //if (changeInfo.status == 'complete') {

    console.log("foi kct");

    chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: traduzir,
    });

  //}
})

function traduzir() {
  console.log("tradusuy");
}

