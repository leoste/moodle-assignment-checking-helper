async function omg() {
  const response = await chrome.runtime.sendMessage("test")
  alert(response)
}

omg()
