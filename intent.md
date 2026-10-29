# Ziki Settings — tiny agent-noticing moment

- **What:** Two small interlocking SVG gears emerge from behind “Settings” and roll toward a nearby safe spot by the pointer.
- **Why Ziki:** The gears suggest cooperating agents; their gentle response makes the interface feel attentive without pretending to be a person.
- **Interaction:** Motion is pointer-led, short, and quiet; gears stop when the pointer settles and tuck away when it leaves Settings.
- **Text safety:** The gears choose a clear path around headings, labels, inputs, and buttons; if no clear route exists, they stay out of the way.
- **Accessibility:** Decorative SVGs are hidden from assistive tech and never receive input. Keyboard users keep the normal page and controls.
- **Reduced motion:** `prefers-reduced-motion` disables cursor-following and rotation; the gears remain a still, low-contrast detail.
- **Mobile/performance:** Touch devices get no cursor chase. No Three.js, external fonts, images, or animation library; JavaScript is limited to pointer routing and path geometry.
- **Deliberately left out:** No custom cursor replacement, sound, trails, heavy 3D, autonomous gear behavior, or motion over the settings controls. A small SVG extrusion and restrained highlight help the teeth read at this scale.

## QA status

The prototype is a self-contained static page with no external requests; JavaScript syntax passes `node --check`, and the local page renders its settings controls and content. The motion is disabled for touch/coarse pointers and reduced-motion preferences, replanning is throttled, and layout changes cancel the current route. A physical low-cost Android device and a deployed slow-network test remain outstanding. Vercel CLI is installed, but its account check failed in this environment before deployment, so there is no live URL yet.

## References

See [references.md](./references.md) for the 13 interaction references and implementation guidance.
