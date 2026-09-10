import { useEffect, useRef, useState } from 'react'
import { Viewer, DefaultViewerParams, SpeckleLoader, UrlHelper } from '@speckle/viewer'

/**
 * WHAT THIS COMPONENT DOES
 * ------------------------
 * 1. Creates a <div> to act as the 3D canvas.
 * 2. Boots up Speckle's `Viewer` class inside that div (this is the same
 *    WebGL renderer that powers the viewer on app.speckle.systems).
 * 3. Loads your model's data from a Speckle "Model URL" and hands the
 *    geometry to the viewer to display.
 * 4. Exposes the `viewer` instance upward (via onReady) so sibling
 *    components -- like our camera tour buttons -- can control the
 *    same 3D scene (move the camera, isolate objects, etc).
 *
 * WHY A REF INSTEAD OF STATE FOR THE VIEWER:
 * The Viewer object manages its own WebGL context and animation loop.
 * We don't want React re-rendering to recreate it, so we store it in a
 * `ref` (a box that persists across renders without retriggering them)
 * rather than in `useState`.
 */

// ---- CONFIG: swap this once your team has a real Speckle model ----
// Right now this points at a public Speckle sample project (an architectural
// model Speckle publishes for demos) so you can see everything working today.
// Replace with your own model's URL once Step 2 (Revit -> Speckle) is done.
export const SPECKLE_MODEL_URL =
  'https://app.speckle.systems/projects/3ed8357f29/models/6b2c0edc45'

export default function SpeckleViewer({ modelUrl = SPECKLE_MODEL_URL, onReady }) {
  const containerRef = useRef(null)
  const viewerRef = useRef(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const params = DefaultViewerParams
        params.showStats = false
        params.verbose = false

        const viewer = new Viewer(containerRef.current, params)
        await viewer.init()
        if (cancelled) return

        viewerRef.current = viewer

        // UrlHelper turns a Speckle web URL into the direct object-data URLs
        // the loader needs (a model can contain multiple "versions").
        const urls = await UrlHelper.getResourceUrls(modelUrl)
        for (const url of urls) {
          const loader = new SpeckleLoader(viewer.getWorldTree(), url, '')
          await viewer.loadObject(loader, true)
        }

        if (cancelled) return
        setStatus('ready')
        onReady?.(viewer)
      } catch (err) {
        console.error('Speckle viewer failed to load:', err)
        if (!cancelled) {
          setStatus('error')
          setErrorMsg(err.message || 'Unknown error')
        }
      }
    }

    init()

    // Cleanup: if this component unmounts, tear down the WebGL context
    // so we don't leak memory (important since Vite's dev mode hot-reloads).
    return () => {
      cancelled = true
      viewerRef.current?.dispose?.()
    }
  }, [modelUrl])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {status === 'loading' && (
        <div style={overlayStyle}>Loading 3D model…</div>
      )}
      {status === 'error' && (
        <div style={overlayStyle}>
          Couldn't load the model.<br />
          <small>{errorMsg}</small>
        </div>
      )}
    </div>
  )
}

const overlayStyle = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(15, 23, 32, 0.85)',
  color: '#e7edf3',
  fontFamily: 'system-ui, sans-serif',
  fontSize: '0.95rem',
  textAlign: 'center',
  padding: '1rem',
}
