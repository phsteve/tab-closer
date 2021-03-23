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
  let tabList = document.getElementById("tabList");
  tabs.forEach(tab => {
    try {
      let url = new URL(tab.url)
      if (freqs.hasOwnProperty(url.hostname)) {
        freqs[url.hostname]++
      } else {
        freqs[url.hostname] = 1
      }
    } catch(err) {
      console.log(`err: ${err}`)
      console.log(`skipping invalid url when populating: ${tab.url}`)
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
  console.log("sorted tabs")
  sortedTabs.forEach(tab => {
    item = document.createElement("li")
    button = document.createElement("button")
    button.innerHTML = "Close"
    button.setAttribute("hostname", tab[0])
    button.addEventListener('click', closeTabs)
    text = document.createTextNode(`${tab[1]} from ${tab[0]}`)
    item.appendChild(button)
    item.appendChild(text)
    tabList.appendChild(item)
  })
});

const closeTabs = (event) => {
  let buttonHostname = event.target.getAttribute('hostname')
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      try {
        let url = new URL(tab.url)
        if (url.hostname == buttonHostname) {
          chrome.tabs.remove(tab.id, () => {
            console.log(`closed id: ${tab.id} hostname: ${buttonHostname}`)            
          })
        }
      } catch(err) {
        console.log(`err: ${err}`)        
        console.log(`skipping invalid url when closing: ${tab.url}`)
        return
      }

    })
  })
}
