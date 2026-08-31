import { useCallback, useEffect, useState } from 'react'
import { randomPalette, readableTextColor, regeneratePalette } from './colors'
import './App.css'

function App() {
  const [palette, setPalette] = useState(() => randomPalette())

  const regenerate = useCallback(() => {
    // Read the previous state via the updater argument rather than the `palette`
    // variable. If we used `palette` directly we'd have to list it as a
    // dependency, which would rebuild this function on every render and leave
    // the keydown listener below re-subscribing constantly.
    setPalette((current) => regeneratePalette(current))
  }, [])

  const toggleLock = useCallback((index: number) => {
    setPalette((current) =>
      current.map((swatch, i) =>
        i === index ? { ...swatch, locked: !swatch.locked } : swatch,
      ),
    )
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
        {palette.map((swatch, index) => {
          const textColor = readableTextColor(swatch.hex)

          return (
            <div
              key={index}
              className="swatch"
              style={{ backgroundColor: swatch.hex, color: textColor }}
            >
              <button
                type="button"
                className="lock"
                onClick={() => toggleLock(index)}
                aria-pressed={swatch.locked}
                aria-label={
                  swatch.locked
                    ? `Unlock ${swatch.hex}`
                    : `Lock ${swatch.hex}`
                }
                style={{ color: textColor }}
              >
                {swatch.locked ? '🔒' : '🔓'}
              </button>
              <span className="hex">{swatch.hex}</span>
            </div>
          )
        })}
      </div>

      <footer className="bar">
        <button type="button" className="generate" onClick={regenerate}>
          Generate
        </button>
        <span className="hint">
          or press <kbd>space</kbd> — locked colors stay put
        </span>
      </footer>
    </main>
  )
}

export default App
