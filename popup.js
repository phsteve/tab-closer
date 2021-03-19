let tabInfo = document.getElementById("tabInfo");

let freqs = {}

// tab example
//{"active":false,
// "audible":false,
// "autoDiscardable":true,
// "discarded":false,
// "favIconUrl":"https://developer.chrome.com/images/meta/favicon-32x32.png",
// "groupId":-1,
// "height":737,
// "highlighted":false,
// "id":1690,
// "incognito":false,
// "index":4,
// "mutedInfo":{"muted":false},
// "pinned":false,
// "selected":false,
// "status":"complete",
// "title":"chrome.tabs - Chrome Developers",
// "url":"https://developer.chrome.com/docs/extensions/reference/tabs/#method-query",
// "width":714,
// "windowId":602},

chrome.tabs.query({}, (tabs) => {
  tabs.forEach(tab => {
    try {
      let url = new URL(tab.url)
      console.log(`got ${url.hostname}`)
      if (freqs.hasOwnProperty(url.hostname)) {
        freqs[url.hostname]++
      } else {
        freqs[url.hostname] = 1
        console.log(JSON.stringify(freq))
      }
    } catch(err) {
      console.log(`skipping invalid url: ${tab.url}`)
      return
    }

  })
  sortedTabs = []
  for (let hostname in freqs) {
    sortedTabs.push([hostname, freqs[hostname]])
  };
  sortedTabs.sort((a, b) => {
    return b[1] - a[1]
  });
  console.log(JSON.stringify(sortedTabs))
  tabInfo.innerHTML = JSON.stringify(sortedTabs)
});
