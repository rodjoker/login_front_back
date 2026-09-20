// components/Carousel.tsx - Carrusel de imágenes reutilizable.
// Trae estilo predeterminado; cada parte se puede sobreescribir con su
// propia prop *ClassName (las clases que pases ganan sobre las de fábrica).
'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

export interface CarouselImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface CarouselProps {
  images: CarouselImage[];

  // Comportamiento
  orientation?: 'horizontal' | 'vertical'; // forma del marco: ancho (16:9) o alto (2:3)
  autoPlay?: boolean; // avanza solo (se pausa con mouse/foco encima)
  interval?: number; // ms entre slides cuando autoPlay
  loop?: boolean; // del último vuelve al primero
  showArrows?: boolean;
  showDots?: boolean;
  initialIndex?: number;
  onChange?: (index: number) => void;
  ariaLabel?: string;

  // Estilos: cada prop reemplaza/ajusta solo esa parte
  className?: string; // contenedor raíz
  viewportClassName?: string; // marco visible (aquí va el aspect-ratio y el borde redondeado)
  imageClassName?: string; // cada <img>
  arrowClassName?: string; // ambas flechas
  captionClassName?: string;
  dotsClassName?: string; // contenedor de los puntos
  dotClassName?: string; // cada punto
  activeDotClassName?: string; // el punto activo
}

const styles = {
  root: 'relative w-full',
  viewport: 'relative overflow-hidden rounded-lg bg-[var(--background-secondary)]',
  track: 'flex h-full transition-transform duration-500 ease-out motion-reduce:transition-none',
  slide: 'relative h-full w-full shrink-0',
  image: 'h-full w-full object-cover',
  caption:
    'absolute inset-x-0 bottom-0 bg-black/50 px-4 py-2 text-sm text-white',
  arrow:
    'absolute top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-white disabled:opacity-30 disabled:cursor-not-allowed',
  dots: 'mt-3 flex justify-center gap-2',
  dot: 'h-2.5 w-2.5 rounded-full bg-[var(--foreground-secondary)] opacity-40 transition hover:opacity-70',
  activeDot: 'bg-[var(--primary-color)] opacity-100',
};

// Lo que cambia según la orientación (el desarrollador puede sobreescribirlo
// con className / viewportClassName).
const orientationStyles = {
  horizontal: { root: '', viewport: 'aspect-video' },
  vertical: { root: 'max-w-sm mx-auto', viewport: 'aspect-[2/3]' },
};

const Carousel: React.FC<CarouselProps> = ({
  images,
  orientation = 'horizontal',
  autoPlay = false,
  interval = 4000,
  loop = true,
  showArrows = true,
  showDots = true,
  initialIndex = 0,
  onChange,
  ariaLabel = 'Carrusel de imágenes',
  className,
  viewportClassName,
  imageClassName,
  arrowClassName,
  captionClassName,
  dotsClassName,
  dotClassName,
  activeDotClassName,
}) => {
  const total = images.length;
  const layout = orientationStyles[orientation];
  const [index, setIndex] = useState(Math.min(Math.max(initialIndex, 0), Math.max(total - 1, 0)));
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      let target = next;
      if (loop) target = (next + total) % total;
      else target = Math.min(Math.max(next, 0), total - 1);
      setIndex(target);
      onChange?.(target);
    },
    [total, loop, onChange],
  );

  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  // Autoplay: avanza cada `interval` ms, salvo pausa o preferencia de menos movimiento.
  useEffect(() => {
    if (!autoPlay || paused || total < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => goTo(index + 1), interval);
    return () => clearInterval(id);
  }, [autoPlay, paused, total, interval, index, goTo]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  };

  // Swipe táctil
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
  };

  if (total === 0) return null;

  const atStart = !loop && index === 0;
  const atEnd = !loop && index === total - 1;

  return (
    <div
      className={cn(styles.root, layout.root, className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className={cn(styles.viewport, layout.viewport, viewportClassName)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className={styles.track}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((img, i) => (
            <div
              key={`${img.src}-${i}`}
              className={styles.slide}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${total}`}
              aria-hidden={i !== index}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                loading={i === 0 ? 'eager' : 'lazy'}
                draggable={false}
                className={cn(styles.image, imageClassName)}
              />
              {img.caption && (
                <div className={cn(styles.caption, captionClassName)}>{img.caption}</div>
              )}
            </div>
          ))}
        </div>

        {showArrows && total > 1 && (
          <>
            <button
              type="button"
              aria-label="Imagen anterior"
              onClick={prev}
              disabled={atStart}
              className={cn(styles.arrow, 'left-3', arrowClassName)}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Imagen siguiente"
              onClick={next}
              disabled={atEnd}
              className={cn(styles.arrow, 'right-3', arrowClassName)}
            >
              ›
            </button>
          </>
        )}
      </div>

      {showDots && total > 1 && (
        <div className={cn(styles.dots, dotsClassName)}>
          {images.map((img, i) => (
            <button
              key={`dot-${img.src}-${i}`}
              type="button"
              aria-label={`Ir a la imagen ${i + 1}`}
              aria-current={i === index}
              onClick={() => goTo(i)}
              className={cn(styles.dot, dotClassName, i === index && styles.activeDot, i === index && activeDotClassName)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
