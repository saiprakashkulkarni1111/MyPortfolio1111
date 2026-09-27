import React, { useEffect, useRef } from 'react';
import { soundFx } from '../utils/soundEffects';

interface AstraStar {
  // Polar coords relative to galaxy center
  baseRadius: number;
  baseAngle: number;
  armIndex: number;
  t: number; // 0 to 1 along arm
  
  // Visual appearance
  colorType: 'cyan' | 'amber' | 'white';
  baseSize: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  hasSpike: boolean;
  spikeSize: number;
  
  // Interactive kinetic physics & spring restitution
  offsetX: number;
  offsetY: number;
  vx: number;
  vy: number;
  angularVelocity: number;
  flashIntensity: number; // 0 to 1 surge on click/wake
}

interface BackgroundStar {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  strength: number;
  alpha: number;
  colorType: 'cyan' | 'amber' | 'white';
}

interface ClickSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

interface ParticleCanvasProps {
  isPaused?: boolean;
}

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ isPaused = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let isMobile = width < 768;
    
    // Detect low internet connection / data-saver / low-power hardware
    const navConn = typeof navigator !== 'undefined' ? (navigator as any).connection : null;
    const isSaveData = Boolean(navConn?.saveData);
    const isSlowNetwork = Boolean(navConn?.effectiveType && ['slow-2g', '2g', '3g'].includes(navConn.effectiveType));
    const isLowConcurrency = typeof navigator !== 'undefined' && typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;
    const isLowPower = isSaveData || isSlowNetwork || isLowConcurrency;

    // Cap DPR on mobile / low-power to 1.0 - 1.25 for buttery 60fps on slow networks
    let dpr = isLowPower 
      ? 1.0 
      : Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5);

    const resize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      isMobile = width < 768;
      dpr = isLowPower 
        ? 1.0 
        : Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resize();
    window.addEventListener('resize', resize);

    // Dynamic scroll pausing: when user scrolls down to projects/contact, pause rendering loop to save CPU & battery
    let isCanvasVisible = true;
    const handleScroll = () => {
      // If user has scrolled past hero section, pause canvas
      isCanvasVisible = window.scrollY < height * 1.35;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Pause when browser tab is inactive
    let isTabActive = !document.hidden;
    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
      if (isTabActive && isCanvasVisible && !animationFrameId) {
        render();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Dynamic Galaxy Center tracking mouse/touch with smooth damping
    let targetX = width * 0.5;
    let targetY = isMobile ? height * 0.32 : height * 0.42;
    let currentX = targetX;
    let currentY = targetY;
    let prevMouseX = targetX;
    let prevMouseY = targetY;
    let mouseVx = 0;
    let mouseVy = 0;
    let mouseSpeed = 0;
    let isPointerDown = false;

    // Interactive shockwaves & sparks
    const shockwaves: Shockwave[] = [];
    const clickSparks: ClickSpark[] = [];

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        // Very gentle tracking on mobile touch to avoid disrupting scroll
        targetX = e.touches[0].clientX;
        targetY = e.touches[0].clientY;
      }
    };

    // Trigger supernova shockwave on pointer click/tap (only on background empty canvas area)
    const triggerCosmicPulse = (clientX: number, clientY: number) => {
      if (!isMobile) {
        soundFx.playChirp(750, 0.05, 'triangle', 0.025);
      }

      const colorRoll = Math.random();
      const waveColor: 'cyan' | 'amber' | 'white' = 
        colorRoll < 0.55 ? 'cyan' : (colorRoll < 0.85 ? 'amber' : 'white');

      const maxRad = isMobile ? width * 0.38 : Math.min(width, height) * 0.55;

      // Add main expanding shockwave
      shockwaves.push({
        x: clientX,
        y: clientY,
        radius: 4,
        maxRadius: maxRad,
        speed: isMobile ? 8 : 11,
        strength: isMobile ? 12 : 20,
        alpha: 0.75,
        colorType: waveColor,
      });

      // Spawn lightweight cosmic sparks
      const sparkCount = isMobile ? 6 : 14;
      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * (isMobile ? 4 : 7) + 2;
        const sparkColor = Math.random() < 0.6 
          ? 'rgba(186, 230, 253,' 
          : (Math.random() < 0.85 ? 'rgba(254, 215, 170,' : 'rgba(255, 255, 255,');

        clickSparks.push({
          x: clientX,
          y: clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * (isMobile ? 0.8 : 1.4) + 0.6,
          alpha: 0.9,
          decay: Math.random() * 0.03 + 0.025,
          color: sparkColor,
        });
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      // Ignore clicks on UI elements (buttons, inputs, links, cards, modals)
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, input, textarea, select, aside, [role="dialog"], form, nav');
        if (interactive) return;
      }

      isPointerDown = true;
      targetX = e.clientX;
      targetY = e.clientY;
      triggerCosmicPulse(e.clientX, e.clientY);
    };

    const handlePointerUp = () => {
      isPointerDown = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });

    // Generate Galaxy Stars with optimized, balanced count for mobile and desktop
    const STAR_COUNT = isLowPower 
      ? (isMobile ? 85 : 170) 
      : (isMobile ? 160 : 380);
    const stars: AstraStar[] = [];

    // Helper for box-muller normal distribution
    const randomGaussian = () => {
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    };

    // Scaled galaxy radius: balanced for mobile viewports
    const maxGalaxyRadius = isMobile 
      ? Math.min(width * 0.44, 160) 
      : Math.min(width, height) * 0.44;

    for (let i = 0; i < STAR_COUNT; i++) {
      // Primary logarithmic spiral arms
      const armType = Math.random();
      let armIndex = 0;
      if (armType < 0.45) {
        armIndex = 0;
      } else if (armType < 0.90) {
        armIndex = 1;
      } else {
        armIndex = 2; // subtle accent arm
      }

      const armBaseAngle = armIndex * Math.PI;

      // Parametric progress t along arm: 0 (center) to 1 (outer tip)
      const t = Math.pow(Math.random(), 1.3);
      
      const coreRadius = isMobile ? 8 : 12;
      const r = coreRadius + (maxGalaxyRadius - coreRadius) * Math.pow(t, 1.15);

      // Logarithmic spiral angle winding
      const spiralWinding = 4.4 * Math.pow(t, 0.86);
      const angle = armBaseAngle + spiralWinding;

      // Tight radial & angular dispersion to keep crisp spiral streams
      const radialDispersion = (isMobile ? (3 + 18 * t) : (4 + 26 * t)) * randomGaussian();
      const angularDispersion = (0.03 + 0.08 * t) * randomGaussian();

      const finalRadius = Math.max(2, r + radialDispersion);
      const finalAngle = angle + angularDispersion;

      // Color distribution matching Astra image
      const colorRand = Math.random();
      let colorType: 'cyan' | 'amber' | 'white';
      if (colorRand < 0.52) {
        colorType = 'cyan';
      } else if (colorRand < 0.80) {
        colorType = 'amber';
      } else {
        colorType = 'white';
      }

      // Optimized star sizes: fine crystalline stardust (0.4px - 1.6px)
      // Eliminates the bloated giant discs shown in the mobile screenshot
      const sizeRand = Math.random();
      let baseSize: number;
      let hasSpike = false;
      let spikeSize = 0;

      if (isMobile) {
        if (sizeRand < 0.80) {
          baseSize = Math.random() * 0.4 + 0.45; // fine micro-dust (0.45 - 0.85px)
        } else if (sizeRand < 0.95) {
          baseSize = Math.random() * 0.35 + 0.85; // medium star (0.85 - 1.2px)
        } else {
          baseSize = Math.random() * 0.4 + 1.2; // delicate beacon (1.2 - 1.6px)
          if (Math.random() < 0.3) {
            hasSpike = true;
            spikeSize = baseSize * 3.5;
          }
        }
      } else {
        if (sizeRand < 0.75) {
          baseSize = Math.random() * 0.5 + 0.55; // fine dust (0.55 - 1.05px)
        } else if (sizeRand < 0.93) {
          baseSize = Math.random() * 0.5 + 1.05; // medium star (1.05 - 1.55px)
        } else {
          baseSize = Math.random() * 0.6 + 1.55; // beacon star (1.55 - 2.15px)
          if (Math.random() < 0.4) {
            hasSpike = true;
            spikeSize = baseSize * 4.0;
          }
        }
      }

      const isNearCore = finalRadius < (isMobile ? 35 : 55);
      const baseAlpha = isNearCore 
        ? Math.random() * 0.25 + 0.65 
        : Math.random() * 0.35 + 0.40;

      stars.push({
        baseRadius: finalRadius,
        baseAngle: finalAngle,
        armIndex,
        t,
        colorType,
        baseSize,
        baseAlpha,
        twinkleSpeed: Math.random() * 0.03 + 0.015,
        twinklePhase: Math.random() * Math.PI * 2,
        hasSpike,
        spikeSize,
        offsetX: 0,
        offsetY: 0,
        vx: 0,
        vy: 0,
        angularVelocity: 0.0011 + (1 - t) * 0.0005,
        flashIntensity: 0,
      });
    }

    // Dense central cluster stars (luminous core)
    const CORE_STARS_COUNT = isLowPower 
      ? (isMobile ? 12 : 24) 
      : (isMobile ? 20 : 45);
    for (let i = 0; i < CORE_STARS_COUNT; i++) {
      const maxCoreR = isMobile ? 22 : 40;
      const coreR = Math.pow(Math.random(), 2) * maxCoreR;
      const coreAngle = Math.random() * Math.PI * 2;
      const colorRand = Math.random();
      stars.push({
        baseRadius: coreR,
        baseAngle: coreAngle,
        armIndex: 0,
        t: 0.01,
        colorType: colorRand < 0.6 ? 'white' : (colorRand < 0.85 ? 'cyan' : 'amber'),
        baseSize: isMobile ? Math.random() * 0.5 + 0.5 : Math.random() * 0.8 + 0.7,
        baseAlpha: Math.random() * 0.3 + 0.65,
        twinkleSpeed: Math.random() * 0.035 + 0.02,
        twinklePhase: Math.random() * Math.PI * 2,
        hasSpike: i < (isMobile ? 2 : 5),
        spikeSize: isMobile ? Math.random() * 4 + 6 : Math.random() * 7 + 10,
        offsetX: 0,
        offsetY: 0,
        vx: 0,
        vy: 0,
        angularVelocity: 0.0018,
        flashIntensity: 0,
      });
    }

    // Deep space backdrop stars
    const BG_STAR_COUNT = isLowPower 
      ? (isMobile ? 16 : 30) 
      : (isMobile ? 30 : 60);
    const bgStars: BackgroundStar[] = [];
    for (let i = 0; i < BG_STAR_COUNT; i++) {
      const isCyan = Math.random() < 0.6;
      bgStars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * (isMobile ? 0.7 : 1.0) + 0.4,
        baseAlpha: Math.random() * 0.3 + 0.15,
        twinkleSpeed: Math.random() * 0.02 + 0.008,
        twinklePhase: Math.random() * Math.PI * 2,
        color: isCyan ? 'rgba(186, 230, 253,' : 'rgba(254, 215, 170,',
      });
    }

    let globalRotation = 0;
    let time = 0;

    // Render loop with low-power scroll & visibility throttling
    const render = () => {
      // Pause completely if modal is active, tab is hidden, or scrolled past hero view
      if (isPausedRef.current || !isTabActive || !isCanvasVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      // Calculate mouse velocity for kinetic wake
      mouseVx = targetX - prevMouseX;
      mouseVy = targetY - prevMouseY;
      mouseSpeed = Math.sqrt(mouseVx * mouseVx + mouseVy * mouseVy);
      prevMouseX = targetX;
      prevMouseY = targetY;

      // Gentle smooth damping towards target position (smoother on mobile)
      const lerp = isMobile ? 0.025 : 0.038;
      currentX += (targetX - currentX) * lerp;
      currentY += (targetY - currentY) * lerp;

      // Continuous celestial rotation
      const holdBoost = isPointerDown ? 0.002 : 0;
      globalRotation += 0.0012 + Math.min(mouseSpeed * 0.00008, 0.003) + holdBoost;
      time += 0.016;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Background Stars
      for (let i = 0; i < bgStars.length; i++) {
        const bg = bgStars[i];
        const alpha = bg.baseAlpha + Math.sin(time * bg.twinkleSpeed * 60 + bg.twinklePhase) * 0.12;
        ctx.fillStyle = `${bg.color} ${Math.max(0.05, Math.min(0.8, alpha))})`;
        ctx.beginPath();
        ctx.arc(bg.x * width, bg.y * height, bg.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Parallax 3D tilt
      const normX = (currentX - width * 0.5) / (width * 0.5 || 1);
      const normY = (currentY - height * 0.5) / (height * 0.5 || 1);
      const tiltScaleX = 1.0 - Math.abs(normY) * (isMobile ? 0.03 : 0.05);
      const tiltScaleY = 1.0 - Math.abs(normX) * (isMobile ? 0.03 : 0.05);

      ctx.save();
      ctx.translate(currentX, currentY);
      ctx.scale(tiltScaleX, tiltScaleY);

      // Additive blending for subtle celestial starlight
      ctx.globalCompositeOperation = 'lighter';

      // 2. Center Astra Core Glow (proportional & refined)
      const coreR = isMobile ? 26 : 52;
      const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR);
      coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      coreGradient.addColorStop(0.18, 'rgba(224, 242, 254, 0.6)');
      coreGradient.addColorStop(0.45, 'rgba(56, 189, 248, 0.22)');
      coreGradient.addColorStop(0.8, 'rgba(14, 165, 233, 0.06)');
      coreGradient.addColorStop(1, 'rgba(7, 11, 22, 0)');

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(0, 0, coreR, 0, Math.PI * 2);
      ctx.fill();

      // Subtle warm core halo
      const warmR = isMobile ? 16 : 32;
      const warmCoreGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, warmR);
      warmCoreGlow.addColorStop(0, 'rgba(255, 247, 237, 0.7)');
      warmCoreGlow.addColorStop(0.3, 'rgba(253, 186, 116, 0.25)');
      warmCoreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = warmCoreGlow;
      ctx.beginPath();
      ctx.arc(0, 0, warmR, 0, Math.PI * 2);
      ctx.fill();

      // 3. Central Cross Spike (clean & elegant)
      ctx.save();
      ctx.rotate(globalRotation * 0.4);
      const spikeLen = isMobile ? 24 : 38;
      const spikeGradient = ctx.createLinearGradient(-spikeLen, 0, spikeLen, 0);
      spikeGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      spikeGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)');
      spikeGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.strokeStyle = spikeGradient;
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(-spikeLen, 0);
      ctx.lineTo(spikeLen, 0);
      ctx.stroke();

      const spikeGradientV = ctx.createLinearGradient(0, -spikeLen, 0, spikeLen);
      spikeGradientV.addColorStop(0, 'rgba(255, 255, 255, 0)');
      spikeGradientV.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)');
      spikeGradientV.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.strokeStyle = spikeGradientV;
      ctx.beginPath();
      ctx.moveTo(0, -spikeLen);
      ctx.lineTo(0, spikeLen);
      ctx.stroke();
      ctx.restore();

      // 4. Propagate Shockwaves
      for (let w = shockwaves.length - 1; w >= 0; w--) {
        const wave = shockwaves[w];
        wave.radius += wave.speed;
        wave.alpha = Math.max(0, 1 - wave.radius / wave.maxRadius);

        if (wave.alpha <= 0.01 || wave.radius >= wave.maxRadius) {
          shockwaves.splice(w, 1);
        }
      }

      // Physics settings
      const springK = 0.035;
      const springDamping = 0.89;
      const cursorRadius = isMobile ? 90 : 150;
      const cursorRadiusSq = cursorRadius * cursorRadius;

      // 5. Draw Spiral Galaxy Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        const currentAngle = star.baseAngle + globalRotation + (star.angularVelocity * time * 50);

        const idealX = Math.cos(currentAngle) * star.baseRadius;
        const idealY = Math.sin(currentAngle) * star.baseRadius;

        const currentStarX = idealX + star.offsetX;
        const currentStarY = idealY + star.offsetY;

        const screenStarX = currentX + currentStarX * tiltScaleX;
        const screenStarY = currentY + currentStarY * tiltScaleY;

        // Interactive Response A: Gentle Cursor Deflection
        const mdx = screenStarX - targetX;
        const mdy = screenStarY - targetY;
        const mDistSq = mdx * mdx + mdy * mdy;

        if (mDistSq < cursorRadiusSq && mDistSq > 1) {
          const mDist = Math.sqrt(mDistSq);
          const factor = Math.pow(1 - mDist / cursorRadius, 1.4);

          // Gentle tangential swirl
          const tangentX = -mdy / mDist;
          const tangentY = mdx / mDist;
          const swirlForce = factor * (isMobile ? 0.7 : 1.2);
          star.vx += tangentX * swirlForce;
          star.vy += tangentY * swirlForce;

          // Gentle push away
          const repelForce = factor * 0.5;
          star.vx += (mdx / mDist) * repelForce;
          star.vy += (mdy / mDist) * repelForce;

          if (isPointerDown) {
            star.flashIntensity = Math.min(0.8, star.flashIntensity + factor * 0.3);
          }
        }

        // Interactive Response B: Shockwave blast
        for (let w = 0; w < shockwaves.length; w++) {
          const wave = shockwaves[w];
          const wdx = screenStarX - wave.x;
          const wdy = screenStarY - wave.y;
          const wDist = Math.sqrt(wdx * wdx + wdy * wdy);

          const diff = Math.abs(wDist - wave.radius);
          if (diff < 28 && wDist > 1) {
            const waveProximity = (1 - diff / 28) * wave.alpha;
            const pushMag = waveProximity * (wave.strength / (1 + wDist * 0.004));

            star.vx += (wdx / wDist) * pushMag;
            star.vy += (wdy / wDist) * pushMag;
            star.flashIntensity = Math.min(0.8, star.flashIntensity + waveProximity * 0.6);
          }
        }

        // Hooke's Law spring restitution
        star.vx += -star.offsetX * springK;
        star.vy += -star.offsetY * springK;
        star.vx *= springDamping;
        star.vy *= springDamping;
        star.offsetX += star.vx;
        star.offsetY += star.vy;

        star.flashIntensity *= 0.92;

        // Twinkle calculation
        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinklePhase);
        const dynamicAlpha = Math.max(
          0.12, 
          Math.min(0.95, star.baseAlpha + twinkle * 0.18 + star.flashIntensity * 0.5)
        );

        // Color selection
        let mainColor: string;
        let haloColor: string;

        if (star.flashIntensity > 0.4) {
          mainColor = `rgba(255, 255, 255, ${dynamicAlpha})`;
          haloColor = `rgba(186, 230, 253, ${dynamicAlpha * 0.4})`;
        } else if (star.colorType === 'cyan') {
          mainColor = `rgba(186, 230, 253, ${dynamicAlpha})`;
          haloColor = `rgba(56, 189, 248, ${dynamicAlpha * 0.25})`;
        } else if (star.colorType === 'amber') {
          mainColor = `rgba(254, 215, 170, ${dynamicAlpha})`;
          haloColor = `rgba(251, 146, 60, ${dynamicAlpha * 0.25})`;
        } else {
          mainColor = `rgba(255, 255, 255, ${dynamicAlpha})`;
          haloColor = `rgba(224, 242, 254, ${dynamicAlpha * 0.3})`;
        }

        const renderX = currentStarX;
        const renderY = currentStarY;
        const effectiveSize = star.baseSize * (1 + star.flashIntensity * 0.4);

        // ONLY draw subtle halo on prominent beacon stars (avoids clumped blobs on mobile)
        if (effectiveSize > (isMobile ? 1.4 : 1.7) || star.flashIntensity > 0.35) {
          ctx.fillStyle = haloColor;
          ctx.beginPath();
          ctx.arc(renderX, renderY, effectiveSize * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw crisp core stardust particle
        ctx.fillStyle = mainColor;
        ctx.beginPath();
        ctx.arc(renderX, renderY, effectiveSize, 0, Math.PI * 2);
        ctx.fill();

        // 4-point cross diffraction spikes on key beacons
        if (star.hasSpike && dynamicAlpha > 0.45) {
          const s = star.spikeSize * (0.85 + twinkle * 0.15);
          ctx.strokeStyle = mainColor;
          ctx.lineWidth = 0.65;
          ctx.beginPath();
          ctx.moveTo(renderX - s, renderY);
          ctx.lineTo(renderX + s, renderY);
          ctx.moveTo(renderX, renderY - s);
          ctx.lineTo(renderX, renderY + s);
          ctx.stroke();
        }
      }

      ctx.restore();

      // 6. Draw Shockwave Rings
      for (let w = 0; w < shockwaves.length; w++) {
        const wave = shockwaves[w];
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        ctx.strokeStyle = wave.colorType === 'amber'
          ? `rgba(254, 215, 170, ${wave.alpha * 0.7})`
          : (wave.colorType === 'white' 
              ? `rgba(255, 255, 255, ${wave.alpha * 0.8})` 
              : `rgba(56, 189, 248, ${wave.alpha * 0.7})`);
        ctx.lineWidth = Math.max(0.8, 2.0 * wave.alpha);
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      // 7. Draw Click Sparks
      for (let s = clickSparks.length - 1; s >= 0; s--) {
        const spark = clickSparks[s];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vx *= 0.94;
        spark.vy *= 0.94;
        spark.alpha -= spark.decay;

        if (spark.alpha <= 0.02) {
          clickSparks.splice(s, 1);
          continue;
        }

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        ctx.fillStyle = `${spark.color} ${spark.alpha})`;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
};
