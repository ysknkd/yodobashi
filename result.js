chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const message = request.message || 'MSG_UNKNOWN'

  switch (message) {
    case 'MSG_START_SEARCH':
      initFrame()
      onStartSearch(request.word)
      break
    case 'MSG_END_SEARCH':
      onEndSearch(request.word, request.json)
      break
    default:
      break
  }
})

function fetchResultTemplate() {
  return fetch(chrome.extension.getURL('/result-template.html'))
    .then(res => res.text())
    .then(html => {
      const parser = new DOMParser()
      const dom = parser.parseFromString(html, 'text/html')
      return dom
    })
}

function generateResultDom(results) {
  const ul = document.createElement('ul')
  ul.className = 'pItemList'

  console.log(results)
  if (!results) {
    return ul
  }
  for (const res of results) {
    const li = document.createElement('li')
    li.className = 'pItem'

    const a = document.createElement('a')
    a.href = res.href
    a.target = '_blank'

    const img = document.createElement('img')
    img.className = 'pImg'
    img.src = res.src

    const textContainer = document.createElement('div')
    textContainer.className = 'pTextContainer'

    const name = document.createElement('p')
    name.textContent = res.name

    const price = document.createElement('p')
    price.textContent = res.price

    textContainer.appendChild(name)
    textContainer.appendChild(price)

    a.appendChild(img)
    a.appendChild(textContainer)
    li.appendChild(a)
    ul.appendChild(li)
  }

  return ul
}

function initFrame() {
  let iframe = document.querySelector('#search_in_yodobashi')
  if (!iframe) {
    iframe = document.createElement('iframe')
    iframe.id = 'search_in_yodobashi'
    iframe.style = 'border: none; display: block; height: 320px; overflow: hidden; position: fixed; right: 8px; top: 8px; left: auto; float: none; width: 335px; z-index: 2147483647; background: #FFF; filter: drop-shadow(0px 3px 3px rgba(0,0,0,0.6));'
    document.body.appendChild(iframe)
  }
}

async function onStartSearch(word) {
  const template = await fetchResultTemplate().catch(() => null)
  if (!template) {
    console.error('cannot load the template')
    return
  }
  template.body.querySelector('.searchWord').textContent = `"${word}" で検索中...`
  let iframe = document.querySelector('#search_in_yodobashi')
  iframe.srcdoc = template.body.innerHTML
}

async function onEndSearch(word, json) {
  const template = await fetchResultTemplate().catch(() => null)
  if (!template) {
    console.error('cannot load the template')
    return
  }
  template.body.querySelector('.searchWord').textContent = `"${word}" の検索結果 / Top 10`
  template.body.querySelector('#result').appendChild(generateResultDom(json))

  let iframe = document.querySelector('#search_in_yodobashi')
  iframe.srcdoc = template.body.innerHTML
}

