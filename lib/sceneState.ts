/**
 * Mutable state shared between the DOM (GSAP / ScrollTrigger) and the render loops.
 * Plain objects on purpose: written every frame, read in useFrame, never triggers React renders.
 */
export const heroState = {
  enter: 0, // 0 → 1 once the preloader hands over
  scroll: 0, // hero pin progress
  intro: 0, // intro section progress
  pointerX: 0,
  pointerY: 0,
};

export const experienceState = {
  progress: 0, // section scroll progress
  dragVelocity: 0,
  dragRotation: 0,
  dragging: false,
  pointerX: 0,
  pointerY: 0,
};
