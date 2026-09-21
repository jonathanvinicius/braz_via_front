import { useEffect, useRef, useState, type MouseEvent, type TouchEvent } from 'react';

type Props = {
  images: string[];
  alt: string;
  badge?: string;
  className?: string;
  index?: number;
  onIndexChange?: (index: number) => void;
};

export function ImageCarousel({
  images,
  alt,
  badge,
  className,
  index,
  onIndexChange,
}: Props) {
  const slides = images.length ? images : [];
  const [internalIndex, setInternalIndex] = useState(0);
  const active = index ?? internalIndex;
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (index == null) setInternalIndex(0);
  }, [slides.join('|'), index]);

  const setActive = (value: number) => {
    if (onIndexChange) onIndexChange(value);
    else setInternalIndex(value);
  };

  if (slides.length === 0) {
    return (
      <div className={`carousel ${className ?? ''}`.trim()}>
        <div className="carousel-empty">Sem fotos</div>
      </div>
    );
  }

  const go = (next: number, event?: MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    const total = slides.length;
    setActive((active + next + total) % total);
  };

  const onTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent) => {
    if (touchStartX.current == null) return;
    const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    go(delta < 0 ? 1 : -1);
  };

  return (
    <div
      className={`carousel ${className ?? ''}`.trim()}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <img src={slides[active]} alt={alt} loading="lazy" />
      {badge ? <span className="badge">{badge}</span> : null}

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            className="carousel-nav prev"
            aria-label="Foto anterior"
            onClick={(event) => go(-1, event)}
          >
            ‹
          </button>
          <button
            type="button"
            className="carousel-nav next"
            aria-label="Próxima foto"
            onClick={(event) => go(1, event)}
          >
            ›
          </button>
          <div className="carousel-dots" aria-hidden="true">
            {slides.map((src, i) => (
              <button
                key={src + i}
                type="button"
                className={i === active ? 'dot active' : 'dot'}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setActive(i);
                }}
              />
            ))}
          </div>
          <span className="carousel-count">
            {active + 1}/{slides.length}
          </span>
        </>
      ) : null}
    </div>
  );
}
