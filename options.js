document.querySelectorAll('.resType').forEach(node => {
  node.addEventListener('click', (e) => {
    const type = e.target.value || 'frame'
    chrome.storage.sync.set({type: type})
  })
})

