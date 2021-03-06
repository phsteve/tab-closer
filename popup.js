chrome.tabs.query({}, (tabs) => {
  const tabList = document.getElementById("tabList");
  const counts = new Map()
  for (const tab of tabs) {
    try {
      const tabUrl = tab.url ? new URL(tab.url) : { hostname: "" }
      let curr = counts.get(tabUrl.hostname)
      if (curr) {
        counts.set(tabUrl.hostname, curr + 1)
      } else {
        counts.set(tabUrl.hostname, 1)
      }
    } catch(err) {
      console.log(`err: ${err}`)
      console.log(`skipping invalid url from tab ${tab.id}: -${tab.url}-`)
    }
  }
  sortedTabs = Array.from(counts).sort((a, b) => {
    // sort descending
    return b[1] - a[1]
  })
  for (const tab of sortedTabs) {
    li = document.createElement("li")
    li.setAttribute("id", tab[0])
    const button = document.createElement("button")
    button.innerHTML = "Close"
    button.setAttribute("hostname", tab[0])
    button.setAttribute("style", "background-color:f14e4e")
    button.addEventListener('click', closeTabsByHostname)
    const displayName = tab[0] || "(empty URL)"
    const text = document.createTextNode(`${tab[1]} tabs from ${displayName}`)
    li.appendChild(button)
    li.appendChild(text)
    tabList.appendChild(li)
  }
});

const closeTabsByHostname = (event) => {
  const buttonHostname = event.target.getAttribute('hostname')
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
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
    }
  })
  const li = document.getElementById(buttonHostname)
  li.remove()
}
