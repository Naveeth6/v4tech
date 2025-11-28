import { useEffect, useRef } from "react";
import { Renderer, Triangle, Program, Mesh } from "ogl";

const Prism = ({
  height = 11,
  baseWidth = 5.5,
  animationType = 'rotate',
  glow = 1,
  offset = { x: 0, y: -300 },
  noise = 0.5,
  transparent = true,
  scale = 2.2,
  hueShift = 0,
  colorFrequency = 1,
  hoverStrength = 2,
  inertia = 0.05,
  bloom = 1,
  suspendWhenOffscreen = false,
  timeScale = 0.3
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ----------------------------
    // MOBILE PERFORMANCE DETECTION
    // ----------------------------
    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 ||
        /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent));

    const RES_SCALE = isMobile ? 0.55 : 1.0; // cut rendering resolution
    const MAX_DPR = isMobile ? 1 : 2; // reduce GPU load
    const MOBILE_STEPS = isMobile ? 40 : 100; // raymarching steps reduced
    const MOBILE_TS = isMobile ? Math.max(0.1, timeScale * 0.5) : timeScale;
    const MOBILE_NOISE = isMobile ? noise * 0.3 : noise;
    const MOBILE_GLOW = isMobile ? glow * 0.6 : glow;
    const USE_SUSPEND = suspendWhenOffscreen || isMobile;

    // Base parameters
    const H = Math.max(0.001, height);
    const BW = Math.max(0.001, baseWidth);
    const BASE_HALF = BW * 0.5;

    const offX = offset.x || 0;
    const offY = offset.y || 0;

    const SAT = transparent ? 1.5 : 1;
    const SCALE = Math.max(0.001, scale);

    const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);

    // Renderer
    const renderer = new Renderer({
      dpr,
      alpha: transparent,
      antialias: false,
    });

    const gl = renderer.gl;
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.BLEND);

    Object.assign(gl.canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
    });
    container.appendChild(gl.canvas);

    // --------------------------------------
    // FRAGMENT SHADER WITH MOBILE OPTIMIZATION
    // --------------------------------------
    const vertex = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragment = `
      #define STEPS ${MOBILE_STEPS}
      precision highp float;

      uniform vec2  iResolution;
      uniform float iTime;

      uniform float uHeight;
      uniform float uBaseHalf;
      uniform mat3  uRot;
      uniform int   uUseBaseWobble;
      uniform float uGlow;
      uniform vec2  uOffsetPx;
      uniform float uNoise;
      uniform float uSaturation;
      uniform float uScale;
      uniform float uHueShift;
      uniform float uColorFreq;
      uniform float uBloom;
      uniform float uCenterShift;
      uniform float uInvBaseHalf;
      uniform float uInvHeight;
      uniform float uMinAxis;
      uniform float uPxScale;
      uniform float uTimeScale;

      vec4 tanh4(vec4 x){
        vec4 e2x = exp(2.0*x);
        return (e2x - 1.0) / (e2x + 1.0);
      }

      float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float sdOctaAnisoInv(vec3 p){
        vec3 q = vec3(abs(p.x) * uInvBaseHalf, abs(p.y) * uInvHeight, abs(p.z) * uInvBaseHalf);
        float m = q.x + q.y + q.z - 1.0;
        return m * uMinAxis * 0.57735026918;
      }

      float sdPyramidUpInv(vec3 p){
        float oct = sdOctaAnisoInv(p);
        float halfSpace = -p.y;
        return max(oct, halfSpace);
      }

      void main(){
        vec2 f = (gl_FragCoord.xy - 0.5 * iResolution.xy - uOffsetPx) * uPxScale;

        float z = 5.0;
        vec4 o = vec4(0.0);

        const float cf = 1.0;

        mat2 wob = mat2(1.0);
        if (uUseBaseWobble == 1) {
          float t = iTime * uTimeScale;
          wob = mat2(cos(t), -sin(t), sin(t), cos(t));
        }

        for (int i = 0; i < STEPS; i++) {
          vec3 p = vec3(f, z);
          p.xz = p.xz * wob;
          p = uRot * p;

          float d = 0.1 + 0.2 * abs(sdPyramidUpInv(p));
          z -= d;

          o += (sin((p.y + z) * uColorFreq + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0) / d;
        }

        o = tanh4(o * o * (uGlow * uBloom) / 1e5);

        vec3 col = o.rgb;

        float n = rand(gl_FragCoord.xy + vec2(iTime));
        col += (n - 0.5) * uNoise;

        col = clamp(col, 0.0, 1.0);

        float L = dot(col, vec3(0.2126, 0.7152, 0.0722));
        col = mix(vec3(L), col, uSaturation);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const geometry = new Triangle(gl);
    const iResBuf = new Float32Array([0, 0]);
    const offsetPxBuf = new Float32Array([0, 0]);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iResolution: { value: iResBuf },
        iTime: { value: 0 },

        uHeight: { value: H },
        uBaseHalf: { value: BASE_HALF },

        uRot: { value: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]) },

        uUseBaseWobble: { value: isMobile ? 0 : 1 },

        uGlow: { value: MOBILE_GLOW },
        uOffsetPx: { value: offsetPxBuf },
        uNoise: { value: MOBILE_NOISE },
        uSaturation: { value: SAT },
        uScale: { value: SCALE },
        uHueShift: { value: hueShift },
        uColorFreq: { value: colorFrequency },
        uBloom: { value: bloom },
        uCenterShift: { value: H * 0.25 },

        uInvBaseHalf: { value: 1 / BASE_HALF },
        uInvHeight: { value: 1 / H },
        uMinAxis: { value: Math.min(BASE_HALF, H) },

        uPxScale: { value: 1 },
        uTimeScale: { value: MOBILE_TS },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    // -----------------------
    // RESIZE WITH RES SCALE
    // -----------------------
    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;

      renderer.setSize(
        Math.max(1, Math.floor(w * RES_SCALE)),
        Math.max(1, Math.floor(h * RES_SCALE))
      );

      iResBuf[0] = gl.drawingBufferWidth;
      iResBuf[1] = gl.drawingBufferHeight;

      offsetPxBuf[0] = offX * dpr;
      offsetPxBuf[1] = offY * dpr;

      program.uniforms.uPxScale.value =
        1 / ((gl.drawingBufferHeight || 1) * 0.1 * SCALE);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // -----------------------
    // ROTATION HANDLING
    // -----------------------
    const rotBuf = new Float32Array(9);

    const setMat3FromEuler = (yawY, pitchX, rollZ, out) => {
      const cy = Math.cos(yawY),
        sy = Math.sin(yawY);
      const cx = Math.cos(pitchX),
        sx = Math.sin(pitchX);
      const cz = Math.cos(rollZ),
        sz = Math.sin(rollZ);

      out[0] = cy * cz + sy * sx * sz;
      out[1] = cx * sz;
      out[2] = -sy * cz + cy * sx * sz;

      out[3] = -cy * sz + sy * sx * cz;
      out[4] = cx * cz;
      out[5] = sy * sz + cy * sx * cz;

      out[6] = sy * cx;
      out[7] = -sx;
      out[8] = cy * cx;

      return out;
    };

    let raf = 0;
    const t0 = performance.now();

    const startRAF = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    const stopRAF = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    let yaw = 0,
      pitch = 0,
      roll = 0;

    const render = (t) => {
      const time = (t - t0) * 0.001;
      program.uniforms.iTime.value = time;

      yaw = time * 0.4;
      pitch = Math.sin(time * 0.3) * 0.4;
      roll = Math.sin(time * 0.2) * 0.3;

      program.uniforms.uRot.value = setMat3FromEuler(
        yaw,
        pitch,
        roll,
        rotBuf
      );

      renderer.render({ scene: mesh });

      raf = requestAnimationFrame(render);
    };

    // Intersection Observer
    if (USE_SUSPEND) {
      const io = new IntersectionObserver((entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible) startRAF();
        else stopRAF();
      });
      io.observe(container);
      container.__prismIO = io;
    } else {
      startRAF();
    }

    // Cleanup
    return () => {
      stopRAF();
      ro.disconnect();
      if (container.__prismIO) container.__prismIO.disconnect();
      if (gl.canvas.parentElement === container)
        container.removeChild(gl.canvas);
    };
  }, []);

  return <div className="w-full h-full relative" ref={containerRef} />;
};

export default Prism;
