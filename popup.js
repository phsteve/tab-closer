chrome.tabs.query({}, (tabs) => {
  const tabList = document.getElementById("tabList");
  const counts = {}
  tabs.forEach(tab => {
    try {
      const tabUrl = tab.url ? new URL(tab.url) : { hostname: "" }
      if (counts.hasOwnProperty(tabUrl.hostname)) {
        counts[tabUrl.hostname]++
      } else {
        counts[tabUrl.hostname] = 1
      }

    } catch(err) {
      console.log(`err: ${err}`)
      console.log(`skipping invalid url from tab ${tab.id}: -${tab.url}-`)
    }
  })
  // convert freqs to array so we can sort it by hostname count
  sortedTabs = []
  for (const hostname in counts) {
    sortedTabs.push([hostname, counts[hostname]])
  };
  sortedTabs.sort((a, b) => {
    return b[1] - a[1]
  });
  sortedTabs.forEach(tab => {
    li = document.createElement("li")
    button = document.createElement("button")
    button.innerHTML = "Close"
    button.setAttribute("hostname", tab[0])
    button.addEventListener('click', closeTabsByHostname)
    const displayName = tab[0] ? tab[0] : "(empty URL)"
    text = document.createTextNode(`${tab[1]} from ${displayName}`)
    li.appendChild(button)
    li.appendChild(text)
    tabList.appendChild(li)
  })
});

const closeTabsByHostname = (event) => {
  const buttonHostname = event.target.getAttribute('hostname')
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      try {
        const url = new URL(tab.url)
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
