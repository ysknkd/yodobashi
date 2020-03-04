//chrome.runtime.onInstalled.addListener(() => {
//  chrome.storage.sync.set({color: '#3aa757'}, () => {
//    console.log('The color is green')
//  })
//  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
//    chrome.declarativeContent.onPageChanged.addRules([{
//      conditions: [
//        new chrome.declarativeContent.PageStateMatcher({
//          pageUrl: {hostEquals: 'developer.chrome.com'},
//        })
//      ],
//      actions: [new chrome.declarativeContent.ShowPageAction()]
//    }])
//  })
//})

/**
 * @param {string} word - words for search
 * @returns Promise<DOM>
 */
function searchInYodobashi(word) {
  const reqUrl = `https://www.yodobashi.com/?word=${word}`

  return fetch(reqUrl)
    .then(res => res.text())
    .then(html => {
      const parser = new DOMParser()
      return parser.parseFromString(html, 'text/html')
    })
}

/**
 * @param {object} dom - yodobashi search result
 * @returns JSON
 */
function extractResultsWithJson(dom) {
  const kUrl = 'https://www.yodobashi.com'
  const results = dom.querySelectorAll('#listContents > .spt_hznList > .pListBlock')

  const json = []
  for (let i = 0, max = 10; i < max; i += 1) {
    const result = results[i]
    const item = {
      href: `${kUrl}${result.querySelector('a.js_productListPostTag').pathname}`,
      src: result.querySelector('.pImg img').src,
      name: Array.from(result.querySelector('.js_productListPostTag').querySelectorAll('.pName p')).map(p => p.textContent).join(' / '),
      price: result.querySelector('.pInfo .productPrice').textContent
    }
    json.push(item)
  }

  return json
}

async function search(word, inTab = false) {
  if (inTab) {
    const reqUrl = `https://www.yodobashi.com/?word=${word}`
    chrome.tabs.create({
      url: reqUrl,
      active: false
    })
    return
  }

  const json = await searchInYodobashi(word).then(dom => extractResultsWithJson(dom)).catch(() => null)
  chrome.storage.sync.set({word: word, json: json}, () => {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, (tabs) => {
      chrome.tabs.executeScript(tabs[0].id, {file: 'result.js'})
    })
  })
}

chrome.contextMenus.create({
  id: 'search_in_yodobashi',
  title: 'Search in Yodobashi',
  contexts: ["selection"]
})
chrome.contextMenus.onClicked.addListener(async (info) => {
  switch(info.menuItemId) {
    case 'search_in_yodobashi':
      search(info.selectionText)
      break
    default:
      break
  }
})

