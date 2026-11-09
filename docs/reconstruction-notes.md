# Reconstruction notes

This project is a pixel-accurate reimplementation of the Mello coffee landing
page. It was built by measuring the reference rendering and reproducing the
result with React + hand-written CSS.

## How it was measured

- A headless Chromium (Playwright) harness loaded the reference page and the
  local build side by side at several widths (`320, 390, 768, 1024, 1440`).
- For each breakpoint we compared the geometry (position, size, font metrics)
  of every meaningful element against the reference, using
  `getBoundingClientRect()` and computed styles.
- Screenshots were diffed pixel-by-pixel; remaining differences are limited to
  font anti-aliasing and the phase of idle doodle animations.
- Animation timings (durations, delays, easing curves and springs) were sampled
  frame by frame from the reference and reproduced as CSS keyframes and
  `linear()` easings.

## Motion

- Scroll reveals are triggered with `IntersectionObserver` and toggled via
  `.is-in` classes on each section.
- The marquee ticker is a pure-CSS translation whose duration is derived from a
  target pixel speed, so it stays consistent across widths.
- All animations and transitions are disabled when the user requests
  `prefers-reduced-motion: reduce`; content is shown in its final state.

## Assets

Fonts and section artwork are the original exported assets, self-hosted and
imported through Vite.

## Git history

The commit history was reconstructed from a single snapshot. Commits are
organised by feature and concern (Conventional Commits), but their order and
dates reflect the reconstruction rather than the original development timeline.
