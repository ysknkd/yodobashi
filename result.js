
/**
 * @param {object} dom - append dom
 */
async function inject(json) {
  const iframe = document.createElement('iframe')
  const template = await fetch(chrome.extension.getURL('/result-template.html'))
    .then(res => res.text())
    .then(html => {
      const parser = new DOMParser()
      const dom = parser.parseFromString(html, 'text/html')
      return dom
    })
    .catch(() => null)

  if (!template) {
    console.error('cannot find the template')
    return
  }

  template.body.querySelector('#result').textContent = JSON.stringify(json)
  iframe.srcdoc = template.body.innerHTML
  iframe.style = 'border: none; display: block; height: 260px; overflow: hidden; position: fixed; right: 0px; top: 0px; left: auto; float: none; width: 335px; z-index: 2147483647; background: transparent;'
  document.body.appendChild(iframe)
}

function result() {
  chrome.storage.sync.get('json', async (data) => {
    inject(data.json)
  })
}
result()
