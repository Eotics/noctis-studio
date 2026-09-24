let cached: boolean | null = null;

const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render|microsoft basic/i;

/** WebGL is used only with a real GPU: software rendering would make the whole page stutter. */
export function hasWebGL() {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ?? canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return (cached = false);
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    const forced = new URLSearchParams(window.location.search).has("webgl");
    cached = forced || !SOFTWARE_RENDERER.test(renderer);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}

export function getQuality() {
  const mobile = window.matchMedia("(max-width: 767px)").matches || window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const low = mobile || cores <= 4 || memory <= 4;
  return {
    low,
    dpr: Math.min(window.devicePixelRatio || 1, low ? 1 : 1.25),
  };
}
