import { useState } from 'react'
import SpeckleViewer from './components/SpeckleViewer.jsx'
import CameraTourBar from './components/CameraTourBar.jsx'

/**
 * WHAT THIS COMPONENT DOES
 * ------------------------
 * This is the "conductor." It doesn't render 3D or buttons itself --
 * it just holds the single shared `viewer` instance in state, and passes
 * it down to whichever child components need to control the 3D scene.
 *
 * WHY LIFT `viewer` UP TO HERE:
 * SpeckleViewer creates the viewer. CameraTourBar needs to USE it.
 * In React, when two sibling components need to share something, that
 * something has to live in their common parent (this file) and get
 * passed down as props. This is called "lifting state up."
 *
 * As we add more features in later steps (solar slider, energy badges,
 * IoT cards, floor plan hotspots), they'll all plug in here the same way:
 * as siblings that receive `viewer` as a prop.
 */
export default function App() {
  const [viewer, setViewer] = useState(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={headerStyle}>
        <h1 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 600 }}>
          SIH Mixed-Use Building — Interactive BIM Explorer
        </h1>
      </header>

      <CameraTourBar viewer={viewer} />

      <main style={{ flex: 1, position: 'relative' }}>
        <SpeckleViewer onReady={setViewer} />
      </main>
    </div>
  )
}

const headerStyle = {
  padding: '0.9rem 1.25rem',
  background: '#0b0f14',
  color: '#f2f5f8',
  borderBottom: '1px solid #263140',
}
