import { useEffect, useRef } from "react";
import { openBooking, type PackageData } from "../../stores/booking";

interface AnimatedArrowProps {
  text: string;
  href?: string;
  onClick?: () => void;
  isBookingTrigger?: boolean;
  bookingData?: PackageData;
  className?: string;
  strokeColor?: string;
  hideBorders?: boolean;
  slideLeft?: boolean;
  textClassName?: string;
  paddingClassName?: string;
  ariaLabel?: string;
}

export default function AnimatedArrowIsland({
  text,
  href,
  onClick,
  isBookingTrigger = false,
  bookingData,
  className = "",
  strokeColor = "#111111",
  hideBorders = false,
  slideLeft = false,
  textClassName = "text-[11px] font-bold",
  paddingClassName = "py-[11px]",
  ariaLabel,
}: AnimatedArrowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<any>(null);
  const topBorderRef = useRef<HTMLDivElement>(null);
  const bottomBorderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef<"rest" | "hover">("rest");
  const animRef = useRef({
    curTip: 0,
    curAmp: 0,
    fromTip: 0,
    toTip: 0,
    fromAmp: 0,
    toAmp: 0,
    dur: 0,
    easeFn: (t: number) => t,
    raf: null as number | null,
    t0: null as number | null,
    W: 0,
    H: 0,
    ctx: null as CanvasRenderingContext2D | null,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const track = trackRef.current;
    const container = containerRef.current;
    if (!canvas || !track || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    animRef.current.ctx = ctx;

    const ARROW_BODY = 58;
    const HEAD_LEN = 11;
    const HEAD_H = 6.5;
    const WAVE_LEN = 38;

    function easeInOutCubic(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function easeOutElastic(t: number) {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      const p = 0.42,
        s = p / 4;
      return Math.pow(2, -10 * t) * Math.sin(((t - s) * 2 * Math.PI) / p) + 1;
    }

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function draw(tipX: number, waveAmp: number) {
      const { ctx, W, H } = animRef.current;
      if (!ctx) return;
      const CY = H / 2;

      ctx.clearRect(0, 0, W, H);
      ctx.save();

      if (slideLeft) {
        ctx.translate(W - tipX, 0);
      }

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const headBase = tipX - HEAD_LEN;
      const bodyStart = headBase - ARROW_BODY;
      const waveStart = bodyStart;

      ctx.beginPath();
      ctx.moveTo(0, CY);

      if (waveAmp > 0.15) {
        ctx.lineTo(waveStart, CY);
        const N = 56;
        for (let i = 1; i <= N; i++) {
          const t = i / N;
          const x = waveStart + t * WAVE_LEN;
          const env = Math.sin(t * Math.PI);
          const y = CY + Math.sin(t * Math.PI * 2 * 1.5) * waveAmp * env;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(headBase, CY);
      } else {
        ctx.lineTo(headBase, CY);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(headBase, CY - HEAD_H);
      ctx.lineTo(tipX, CY);
      ctx.lineTo(headBase, CY + HEAD_H);
      ctx.stroke();

      ctx.restore();

      if (slideLeft && textRef.current) {
        textRef.current.style.transform = `translateX(-${tipX + 18}px)`;
      }
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const W = track!.clientWidth || 200;
      const H = track!.clientHeight || 28;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = W + "px";
      canvas!.style.height = H + "px";
      ctx!.setTransform(1, 0, 0, 1, 0, 0); // Reset transform before scaling
      ctx!.scale(dpr, dpr);
      animRef.current.W = W;
      animRef.current.H = H;
    }

    const restTip = () => (animRef.current.W || 200) * 0.22;
    const hoverTip = () => {
      if (slideLeft && textRef.current) {
        const textW = textRef.current.offsetWidth;
        return Math.max(restTip(), (animRef.current.W || 200) - textW - 18);
      }
      return (animRef.current.W || 200) - 2;
    };

    function tick(ts: number) {
      const anim = animRef.current;
      if (!anim.t0) anim.t0 = ts;
      const elapsed = ts - anim.t0;
      const p = Math.min(elapsed / anim.dur, 1);
      const e = anim.easeFn(p);

      anim.curTip = lerp(anim.fromTip, anim.toTip, e);

      /* wave appears only in the last 40% of hover travel */
      const waveP =
        stateRef.current === "hover"
          ? Math.max(0, (e - 0.6) / 0.4)
          : lerp(anim.fromAmp, anim.toAmp, e) / (anim.fromAmp || 1);

      anim.curAmp =
        stateRef.current === "hover"
          ? lerp(0, anim.toAmp, waveP)
          : lerp(anim.fromAmp, anim.toAmp, e);

      draw(anim.curTip, anim.curAmp);

      if (p < 1) {
        anim.raf = requestAnimationFrame(tick);
      } else {
        anim.curTip = anim.toTip;
        anim.curAmp = anim.toAmp;
        anim.t0 = null;
        anim.raf = null;
      }
    }

    function animate(
      tt: number,
      ta: number,
      d: number,
      ease: (t: number) => number,
    ) {
      const anim = animRef.current;
      if (anim.raf) {
        cancelAnimationFrame(anim.raf);
        anim.raf = null;
        anim.t0 = null;
      }
      anim.fromTip = anim.curTip;
      anim.fromAmp = anim.curAmp;
      anim.toTip = tt;
      anim.toAmp = ta;
      anim.dur = d;
      anim.easeFn = ease;
      anim.raf = requestAnimationFrame(tick);
    }

    function onEnter() {
      if (stateRef.current === "hover") return;
      stateRef.current = "hover";
      if (topBorderRef.current) {
        topBorderRef.current.style.opacity = "1";
        topBorderRef.current.style.transform = "scaleX(1)";
      }
      if (bottomBorderRef.current) {
        bottomBorderRef.current.style.opacity = "1";
        bottomBorderRef.current.style.transform = "scaleX(1)";
      }
      animate(hoverTip(), 6.5, 520, easeInOutCubic);
    }

    function onLeave() {
      if (stateRef.current === "rest") return;
      stateRef.current = "rest";
      if (topBorderRef.current) {
        topBorderRef.current.style.transform = "scaleX(0)";
        topBorderRef.current.style.opacity = "0";
      }
      if (bottomBorderRef.current) {
        bottomBorderRef.current.style.transform = "scaleX(0)";
        bottomBorderRef.current.style.opacity = "0";
      }
      animate(restTip(), 0, 740, easeOutElastic);
    }

    resize();
    animRef.current.curTip = restTip();
    draw(animRef.current.curTip, 0);

    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);

    const onTouchStart = () => {
      onEnter();
      setTimeout(onLeave, 800);
    };
    container.addEventListener("touchstart", onTouchStart, { passive: true });

    const handleResize = () => {
      resize();
      animRef.current.curTip =
        stateRef.current === "hover" ? hoverTip() : restTip();
      draw(animRef.current.curTip, animRef.current.curAmp);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
      container.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("resize", handleResize);
      if (animRef.current.raf) cancelAnimationFrame(animRef.current.raf);
    };
  }, [strokeColor]);

  const Component: any = href ? "a" : "div";

  const props: any = {
    ref: containerRef,
    className: `relative flex items-center cursor-pointer select-none no-underline w-full ${paddingClassName} ${className}`,
    style: { WebkitTapHighlightColor: "transparent" },
    onClick: isBookingTrigger 
      ? () => openBooking(bookingData) 
      : (e: any) => {
          if (href) {
            window.location.href = href;
          } else if (onClick) {
            onClick();
          }
        },
  };

  if (href) {
    props.href = href;
    props["data-astro-prefetch"] = "true";
    if (ariaLabel) {
      props["aria-label"] = ariaLabel;
    }
  }

  return (
    <Component {...props}>
      {!hideBorders && (
        <>
          <div
            ref={topBorderRef}
            className="absolute left-0 right-0 top-0 h-px bg-black opacity-0 pointer-events-none origin-left"
            style={{
              transform: "scaleX(0)",
              transition:
                "transform 0.48s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease",
            }}
          />
          <div
            ref={bottomBorderRef}
            className="absolute left-0 right-0 bottom-0 h-px bg-black opacity-0 pointer-events-none origin-left"
            style={{
              transform: "scaleX(0)",
              transition:
                "transform 0.48s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease",
            }}
          />
        </>
      )}

      {slideLeft ? (
        <>
          <div className="absolute right-0 top-0 bottom-0 flex items-center z-10 pointer-events-none">
            <div
              ref={textRef}
              className={`${textClassName} tracking-[0.13em] uppercase text-black whitespace-nowrap leading-none`}
            >
              {text}
            </div>
          </div>
          <div ref={trackRef} className="flex-1 relative h-[28px] min-w-0">
            <canvas ref={canvasRef} className="block w-full h-full" />
          </div>
        </>
      ) : (
        <>
          <div
            className={`${textClassName} tracking-[0.13em] uppercase text-black whitespace-nowrap shrink-0 relative z-10 leading-none`}
          >
            {text}
          </div>
          <div
            ref={trackRef}
            className="flex-1 relative h-[28px] ml-[18px] min-w-0"
          >
            <canvas ref={canvasRef} className="block w-full h-full" />
          </div>
        </>
      )}
    </Component>
  );
}
