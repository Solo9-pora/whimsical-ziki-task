# Interaction references (13)

These are mechanics and motion-quality references, not visual assets. The gear silhouette, color, and treatment in the prototype are original and use Ziki’s existing blue/purple interface language.

1. [Rotating SVG gears — CodePen](https://codepen.io/sattellite/pen/megzwg) — counter-rotating gear motion.
2. [Industry Web Gearbox — CodePen](https://codepen.io/iwd/pen/yXWqKW) — interlocking SVG gears.
3. [SVG Animations (Basics) — CodePen](https://codepen.io/mmarquez/pen/oxKpRK) — restrained SVG transform/origin behavior.
4. [Eyes Follow Cursor — CodePen](https://codepen.io/diandrarose/pen/xxbPGKL?anon=true&view=pen) — small visual response to pointer position.
5. [SVG Eyeball Follow Cursor — CodePen](https://codepen.io/GabEsu/pen/VdKjPE) — pointer tracking in SVG.
6. [Cursor follow hover animation — CodePen](https://codepen.io/sanderdebr/pen/XWbPveq?anon=true&view=pen) — eased follower motion.
7. [Cursor Follower — Dribbble](https://dribbble.com/shots/16457115-Cursor-Follower) — minimal follower scale and visual weight.
8. [Magnetic cursor interactions — CodePen](https://codepen.io/PedroIdmkr/pen/bGNzbwz) — cursor response near interface elements.
9. [Cursor Follow & Hover Effect — CodePen](https://codepen.io/alphardex/pen/jOEgYjr) — hover-state responsiveness.
10. [Magnetic cursor hover button and menu items — CodePen](https://codepen.io/nuriaheep/pen/ZEBELvd) — interactive target awareness.
11. [Custom cursor wrapping links — CodePen](https://codepen.io/halo-daniel/pen/rRNLLq) — changing response around interactive controls.
12. [Cursor Reveal Interactive Hover — Dribbble](https://dribbble.com/shots/27462548-Day-93-of-100-Days-UI-Challenge-Cursor-Reveal-Interactive-Hover) — cursor-led reveal as a secondary layer.
13. [Awwwards interactions collection — UI Goodies](https://uigoodies.com/resources/awwwards-interactions) — benchmark for polished, intentional interaction moments.

## Implementation guidance

- [WAI: Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions) and [MDN: Using media queries for accessibility](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using_for_accessibility) informed reduced-motion behavior.
- [MDN: PointerEvent.pointerType](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType) informed opting out of touch-driven cursor motion.
- [MDN: Performance fundamentals](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Fundamentals) informed using `requestAnimationFrame` rather than a timer loop.
