import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

// A field of glowing particles that morphs between five shapes on the GPU:
// 0 core (sphere + rings) · 1 double helix · 2 data grid · 3 galaxy · 4 portal
export function createParticles(canvas) {
  const mobile = window.innerWidth < 768;
  const N = mobile ? 9000 : 16000;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  renderer.setClearColor('#06070a', 1);
  const scene = new THREE.Scene();
  // Colour-managed background (a raw clear colour gets gamma-encoded twice by the post-processing chain)
  scene.background = new THREE.Color('#06070a');
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.z = 11;

  const rnd = Math.random;
  const gauss = () => (rnd() + rnd() + rnd() - 1.5) / 1.5;
  const A = new Float32Array(N * 3), B = new Float32Array(N * 3), C = new Float32Array(N * 3), D = new Float32Array(N * 3), E = new Float32Array(N * 3);
  const R = new Float32Array(N);
  const set = (arr, i, x, y, z) => { arr[i * 3] = x; arr[i * 3 + 1] = y; arr[i * 3 + 2] = z; };
  const golden = Math.PI * (3 - Math.sqrt(5));
  const gridW = Math.ceil(Math.sqrt(N * 1.9)), gridH = Math.ceil(N / gridW);

  for (let i = 0; i < N; i++) {
    R[i] = rnd();
    // 0 — energy core: fibonacci sphere shell + two orbital rings
    if (i % 5 === 0) {
      const a = rnd() * Math.PI * 2, r = 3.1 + gauss() * 0.06, tilt = i % 10 === 0 ? 1.2 : -0.5;
      set(A, i, Math.cos(a) * r, Math.sin(a) * r * Math.sin(tilt) * 0.35, Math.sin(a) * r * Math.cos(tilt));
    } else {
      const y = 1 - (i / (N - 1)) * 2, rr = Math.sqrt(1 - y * y), th = golden * i, s = 2.1 * (0.92 + rnd() * 0.12);
      set(A, i, Math.cos(th) * rr * s, y * s, Math.sin(th) * rr * s);
    }
    // 1 — double helix (DNA of the work)
    const t = i / N;
    if (i % 7 === 0) {
      const k = Math.floor(t * 60) / 60, ang = k * Math.PI * 16, u = rnd() * 2 - 1;
      set(B, i, (k - 0.5) * 13, Math.cos(ang) * 1.15 * u, Math.sin(ang) * 1.15 * u);
    } else {
      const strand = i % 2, ang = t * Math.PI * 16 + strand * Math.PI;
      set(B, i, (t - 0.5) * 13, Math.cos(ang) * 1.15 + gauss() * 0.05, Math.sin(ang) * 1.15 + gauss() * 0.05);
    }
    // 2 — data grid (a wide rolling floor)
    const gx = i % gridW, gy = Math.floor(i / gridW);
    set(C, i, (gx / gridW - 0.5) * 18, -1.6, (gy / gridH - 0.5) * 10);
    // 3 — three-arm galaxy
    const rr = Math.pow(rnd(), 0.55) * 5.2, arm = i % 3, ga = rr * 1.25 + (arm * Math.PI * 2) / 3 + gauss() * 0.35 / (rr * 0.4 + 0.5);
    set(D, i, Math.cos(ga) * rr, gauss() * 0.18 * (1.2 - rr / 6), Math.sin(ga) * rr);
    // 4 — portal ring
    const pa = rnd() * Math.PI * 2, pb = rnd() * Math.PI * 2, minor = 0.12 + Math.pow(rnd(), 3) * 0.6;
    set(E, i, Math.cos(pa) * (2.7 + Math.cos(pb) * minor), Math.sin(pa) * (2.7 + Math.cos(pb) * minor), Math.sin(pb) * minor);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(A.slice(), 3));
  geo.setAttribute('pA', new THREE.BufferAttribute(A, 3));
  geo.setAttribute('pB', new THREE.BufferAttribute(B, 3));
  geo.setAttribute('pC', new THREE.BufferAttribute(C, 3));
  geo.setAttribute('pD', new THREE.BufferAttribute(D, 3));
  geo.setAttribute('pE', new THREE.BufferAttribute(E, 3));
  geo.setAttribute('aRand', new THREE.BufferAttribute(R, 1));

  const uniforms = {
    uTime: { value: 0 }, uMorph: { value: 0 }, uPR: { value: 1 }, uSize: { value: mobile ? 3.2 : 2.6 },
    uMouse: { value: new THREE.Vector2(99, 99) }, uRepel: { value: 0.9 }, uOpacity: { value: 0 },
    uC1: { value: new THREE.Color('#5ef2ff') }, uC2: { value: new THREE.Color('#8b5cff') }, uC3: { value: new THREE.Color('#ffb86b') },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */ `
      uniform float uTime, uMorph, uPR, uSize, uRepel;
      uniform vec2 uMouse;
      uniform vec3 uC1, uC2, uC3;
      attribute vec3 pA, pB, pC, pD, pE;
      attribute float aRand;
      varying vec3 vColor; varying float vAlpha;

      vec3 rotX(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z); }
      vec3 rotY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z); }
      vec3 rotZ(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z); }

      vec3 shape(float i) {
        if (i < 0.5) return rotY(pA, uTime * 0.12);
        if (i < 1.5) return rotX(pB, uTime * 0.35);
        if (i < 2.5) {
          vec3 p = pC;
          p.y += sin(p.x * 0.7 + uTime * 1.1) * cos(p.z * 0.6 + uTime * 0.8) * 0.45;
          return p;
        }
        if (i < 3.5) return rotX(rotY(pD, uTime * 0.07), 0.95);
        return rotZ(pE, uTime * 0.25);
      }

      void main() {
        float m = clamp(uMorph, 0.0, 4.0);
        float fl = floor(m);
        float t = clamp((m - fl - aRand * 0.35) / 0.65, 0.0, 1.0);
        t = t * t * (3.0 - 2.0 * t);
        vec3 p = mix(shape(fl), shape(min(fl + 1.0, 4.0)), t);
        float transit = sin(3.14159 * t);
        p += transit * vec3(sin(aRand * 40.0 + uTime), cos(aRand * 23.0 + uTime * 0.8), sin(aRand * 17.0)) * 0.9;
        p += 0.045 * vec3(sin(uTime * 0.7 + aRand * 30.0 + p.y), cos(uTime * 0.6 + aRand * 20.0 + p.x), sin(uTime * 0.5 + aRand * 10.0));

        vec4 world = modelMatrix * vec4(p, 1.0);
        vec2 d = world.xy - uMouse;
        world.xy += normalize(d + 1e-4) * uRepel * pow(smoothstep(1.7, 0.0, length(d)), 1.5);
        vec4 mv = viewMatrix * world;
        gl_Position = projectionMatrix * mv;

        float big = step(0.985, aRand);
        gl_PointSize = uSize * (0.5 + aRand * 0.9 + big * 2.5) * uPR * (10.0 / -mv.z);
        vColor = mix(uC1, uC2, smoothstep(-2.0, 2.0, p.y + (aRand - 0.5) * 2.5));
        if (aRand > 0.93) vColor = uC3;
        vAlpha = (0.45 + 0.55 * abs(sin(uTime * 0.8 + aRand * 60.0))) * (0.7 + transit * 0.5);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      varying vec3 vColor; varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vColor * (0.6 + a * 0.8), a * a * vAlpha * uOpacity);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  const holder = new THREE.Group();
  holder.add(points);
  scene.add(holder);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), mobile ? 0.45 : 0.55, 0.35, 0.18);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const state = { x: 0, y: 0, scale: 1, morph: 0, opacity: 0 };
  const mouse = new THREE.Vector2(99, 99), mouseN = new THREE.Vector2(), mouseL = new THREE.Vector2();
  let halfW = 1, halfH = 1;

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    const pr = Math.min(window.devicePixelRatio, mobile ? 1.5 : 1.75);
    renderer.setPixelRatio(pr);
    renderer.setSize(w, h, false);
    composer.setPixelRatio(pr);
    composer.setSize(w, h);
    bloom.resolution.set(w / 2, h / 2);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    halfW = halfH * camera.aspect;
    uniforms.uPR.value = pr;
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', (e) => {
    mouseN.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    mouse.set(mouseN.x * halfW, mouseN.y * halfH);
  });
  window.addEventListener('pointerleave', () => mouse.set(99, 99));

  function update(t) {
    uniforms.uTime.value = t;
    uniforms.uMorph.value = state.morph;
    uniforms.uOpacity.value = state.opacity;
    uniforms.uMouse.value.lerp(mouse, 0.12);
    mouseL.lerp(mouseN, 0.05);
    holder.position.set(state.x * halfW, state.y * halfH, 0);
    holder.scale.setScalar(state.scale * (mobile ? 0.62 : camera.aspect < 1.2 ? 0.8 : 1));
    holder.rotation.set(-mouseL.y * 0.18, mouseL.x * 0.3, 0);
    composer.render();
  }

  return { state, update, palette: uniforms };
}
