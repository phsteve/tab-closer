let color = '#3aa757'
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color }, () => {
    console.log("Default bg color set to %cgreen.", `color: ${color}`);
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
