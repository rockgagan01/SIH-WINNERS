/**
 * WHAT THIS COMPONENT DOES
 * ------------------------
 * Renders 4 buttons. Clicking one asks the live Speckle `viewer` (passed
 * down as a prop from App.jsx) to smoothly fly its camera to a preset
 * position/target -- exactly like a "preset view" in Revit.
 *
 * HOW CAMERA POSITIONS WORK IN SPECKLE:
 * Under the hood, Speckle's camera uses a library called `camera-controls`.
 * Its main method is `setLookAt(px, py, pz, tx, ty, tz, enableTransition)`:
 *   - (px, py, pz) = where the CAMERA sits in 3D space
 *   - (tx, ty, tz) = the point the camera is LOOKING AT
 *   - enableTransition = true gives a smooth fly-to animation instead of a snap cut
 *
 * IMPORTANT: The numbers below are placeholders. Every building has different
 * real-world coordinates in Revit (depends on your project's shared
 * coordinates/survey point). Once your real model is loaded, open the
 * browser console and run:
 *     window.__viewer.getRenderer().sceneBox
 * This prints your model's actual bounding box -- use those min/max
 * numbers to set realistic camera positions for each preset below.
 */

const PRESETS = [
  {
    label: 'Exterior / Site View',
    // Pulled back and elevated, looking at the building's center
    lookAt: [40, -40, 30, 0, 0, 5],
  },
  {
    label: 'Structural Frame',
    // Closer, angled to show columns/beams
    lookAt: [15, -20, 10, 0, 0, 5],
  },
  {
    label: 'Interior Lobby',
    // Low camera height, near ground floor, looking inward
    lookAt: [5, -8, 2, 0, 0, 2],
  },
  {
    label: 'Section Cut / Exploded View',
    // Elevated straight-on view, good for a manually-triggered section box
    lookAt: [0, -35, 20, 0, 0, 8],
  },
]

export default function CameraTourBar({ viewer }) {
  function goTo(preset) {
    if (!viewer) return
    const controls = viewer.cameraHandler?.controls
    if (!controls) {
      console.warn('Camera controls not ready yet')
      return
    }
    const [px, py, pz, tx, ty, tz] = preset.lookAt
    controls.setLookAt(px, py, pz, tx, ty, tz, true) // true = animate the transition
  }

  return (
    <div style={barStyle}>
      {PRESETS.map((preset) => (
        <button key={preset.label} onClick={() => goTo(preset)} style={btnStyle}>
          {preset.label}
        </button>
      ))}
    </div>
  )
}

const barStyle = {
  display: 'flex',
  gap: '0.6rem',
  flexWrap: 'wrap',
  padding: '0.75rem 1rem',
  background: '#12181f',
  borderBottom: '1px solid #263140',
}

const btnStyle = {
  padding: '0.5rem 1rem',
  borderRadius: '999px',
  border: '1px solid #3a4a5c',
  background: '#1b2430',
  color: '#dce6f0',
  fontSize: '0.85rem',
  cursor: 'pointer',
}
