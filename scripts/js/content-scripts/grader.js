async function omg(text) {
  const message = {
    type: "test",
    content: {
      text: text
    }
  }
  const response = await chrome.runtime.sendMessage(message)
  alert(response)
}

jesus = async() => {
  await omg("test")
  await omg("mega")
  await omg("see on nii lahe")
}

jesus()