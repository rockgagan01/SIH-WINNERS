# SIH Mixed-Use Building — Interactive BIM Explorer

## What's built so far (Phase 1)

- A React + Vite project scaffold
- A live Speckle 3D viewer (`SpeckleViewer.jsx`) rendering a placeholder public
  model, so you can see it working immediately
- A "Guided Camera Tour" bar with 4 preset-view buttons that fly the camera
  around the model

## Prerequisites

You need **Node.js** installed (v18 or newer). Check with:
```
node -v
```
If that fails, download it from nodejs.org first.

## Running it locally

```
cd sih-bim-site
npm install     # downloads React, Vite, and the Speckle viewer library
npm run dev     # starts a local server, prints a URL like http://localhost:5173
```
Open that URL in your browser. You should see a dark toolbar with 4 buttons
above a 3D model — click the buttons to fly the camera around.

## Swapping in YOUR real Revit model

Once you've published your model to Speckle (see the steps Claude walked you
through — Speckle account → Manager → Revit connector → Send), open:

```
src/components/SpeckleViewer.jsx
```

and change this line near the top:

```js
export const SPECKLE_MODEL_URL =
  'https://app.speckle.systems/projects/3ed8357f29/models/6b2c0edc45'
```

to your own model's URL (copied from your browser address bar on
app.speckle.systems).

## Tuning the camera presets to your building

The 4 camera positions in `src/components/CameraTourBar.jsx` are placeholder
numbers — every Revit project has different real-world coordinates. After
your real model loads, open the browser DevTools console (F12) and run:

```js
window.__viewer.getRenderer().sceneBox
```
*(you'll need to briefly add `window.__viewer = viewer` inside
`SpeckleViewer.jsx`'s `onReady` call to expose it for debugging)*

This prints your model's actual bounding box — use those coordinates to set
realistic `lookAt` values for each of the 4 presets.

## Roadmap — what we're building next, in order

1. ✅ **Speckle viewer + Guided Camera Tour** (this phase)
2. **2D Floor Plan & Navigation** — export floor plan images from Revit,
   build a tab bar (Ground / First / Roof), add clickable hotspots that
   trigger camera flights to specific rooms
3. **Floor Selector / Isolation** — buttons that hide all floors except the
   selected one, using Speckle's object-filtering API
4. **Solar Study & Daylight Slider** — a time-of-day slider that rotates a
   virtual sun light and updates shadows in the viewer
5. **Energy Performance Badges** — color-coded overlay tags pointing at solar
   panels, rainwater harvesting, glazing, green roofs
6. **IoT Sensor Simulation Cards** — floating cards with mock
   temperature/occupancy/AQI numbers attached to specific rooms

Each phase will be a new component that plugs into `App.jsx` the same way
`CameraTourBar` does — as a sibling that receives the shared `viewer` object.
