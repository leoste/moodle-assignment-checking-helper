import { configRepository } from '../background/repository/ConfigRepository'

const folderNameEl = document.getElementById('folder-name')!
const selectBtn = document.getElementById('select-btn')!

async function updateDisplay(): Promise<void> {
  const { directoryHandle } = await configRepository.getConfig()
  folderNameEl.textContent = directoryHandle ? directoryHandle.name : 'Kaust valimata'
}

selectBtn.addEventListener('click', async () => {
  try {
    const directoryHandle = await window.showDirectoryPicker({ mode: 'read' })
    await configRepository.setConfig({ directoryHandle })
    await updateDisplay()
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return
    console.error('Kausta valimine ebaõnnestus:', e)
  }
})

updateDisplay()
