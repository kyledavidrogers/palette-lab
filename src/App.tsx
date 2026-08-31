import { useCallback, useEffect, useState } from 'react'
import { randomPalette, readableTextColor } from './colors'
import './App.css'

function App() {
  const [palette, setPalette] = useState(() => randomPalette())

  const regenerate = useCallback(() => {
    setPalette(randomPalette())
  }, [])

  // Spacebar regenerates, the way the well-known palette tools do it.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.code !== 'Space') return
      event.preventDefault() // stop the page from scrolling
      regenerate()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [regenerate])

  return (
    <main className="app">
      <div className="palette">
        {palette.map((swatch, index) => (
          <div
            key={index}
            className="swatch"
            style={{
              backgroundColor: swatch.hex,
              color: readableTextColor(swatch.hex),
            }}
          >
            <span className="hex">{swatch.hex}</span>
          </div>
        ))}
      </div>

      <footer className="bar">
        <button type="button" className="generate" onClick={regenerate}>
          Generate
        </button>
        <span className="hint">
          or press <kbd>space</kbd>
        </span>
      </footer>
    </main>
  )
}

export default App
