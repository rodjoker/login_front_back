'use client';
// components/Modal.tsx - Diálogo modal accesible (portal, foco atrapado, Escape, scroll bloqueado).
import React, { useEffect, useId, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { colors } from '@/lib/colors';
import { cn } from '@/lib/cn';

type Size = 'sm' | 'md' | 'lg';

export interface ModalProps {
  open: boolean;
  onClose: () => void; // el padre controla `open`; el modal solo avisa que quiere cerrarse
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode; // zona inferior, típicamente botones
  size?: Size;
  closeOnBackdrop?: boolean; // clic en el fondo oscuro cierra (def. true)
  closeOnEscape?: boolean; // tecla Escape cierra (def. true)
  showCloseButton?: boolean; // botón × arriba a la derecha (def. true)
  initialFocusRef?: React.RefObject<HTMLElement | null>; // a qué elemento darle el foco al abrir
  ariaLabel?: string; // úsalo si no pasas `title`
  className?: string; // panel
  overlayClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

// Clases literales completas: Tailwind solo genera las que ve escritas.
const sizeClasses: Record<Size, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-3xl',
};

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

// true solo en el cliente; evita tocar `document` durante el render del servidor.
const subscribe = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(subscribe, () => true, () => false);

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  initialFocusRef,
  ariaLabel,
  className,
  overlayClassName,
  headerClassName,
  bodyClassName,
  footerClassName,
}) => {
  const isClient = useIsClient();
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const descId = `${baseId}-desc`;

  const panelRef = useRef<HTMLDivElement>(null);

  // Siempre la última versión de onClose, sin volver a montar los listeners.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Al abrir: recuerda quién tenía el foco, bloquea el scroll y mueve el foco adentro.
  // Al cerrar: deshace todo y devuelve el foco.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    // Al ocultar la barra de scroll la página "salta"; se compensa con padding.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    (initialFocusRef?.current ?? panelRef.current)?.focus();

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
      previouslyFocused?.focus?.();
    };
    // initialFocusRef solo importa al abrir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Escape para cerrar y Tab atrapado dentro del panel.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;

      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (focusables.length === 0) {
        e.preventDefault(); // nada enfocable: el foco se queda en el panel
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeEl = document.activeElement;

      if (e.shiftKey && (activeEl === first || activeEl === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      } else if (!panelRef.current.contains(activeEl)) {
        e.preventDefault(); // el foco se escapó: se devuelve al panel
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, closeOnEscape]);

  if (!isClient || !open) return null;

  return createPortal(
    <div
      // mousedown y no click: si el usuario selecciona texto y suelta fuera del panel, no se cierra.
      onMouseDown={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose();
      }}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'bg-black/50 backdrop-blur-sm transition-opacity duration-200',
        'starting:opacity-0 motion-reduce:transition-none',
        overlayClassName
      )}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        aria-label={title ? undefined : ariaLabel}
        tabIndex={-1}
        className={cn(
          'relative flex max-h-[90vh] w-full flex-col rounded-lg border shadow-xl outline-none',
          'transition-all duration-200 starting:opacity-0 starting:scale-95',
          'motion-reduce:transition-none',
          sizeClasses[size],
          className
        )}
        style={{
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
          color: colors.foregroundColor,
        }}
      >
        {(title || description || showCloseButton) && (
          <div className={cn('flex items-start justify-between gap-4 px-6 pt-5', headerClassName)}>
            <div>
              {title && (
                <h2 id={titleId} className="text-lg font-semibold">
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id={descId}
                  className="mt-1 text-sm"
                  style={{ color: colors.foregroundSecondary }}
                >
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className={cn(
                  '-mr-2 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-2xl leading-none',
                  'cursor-pointer transition-opacity hover:opacity-70',
                  'focus:outline-none focus-visible:ring-2'
                )}
                style={{ color: colors.foregroundSecondary }}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            )}
          </div>
        )}

        <div className={cn('overflow-y-auto px-6 py-4', bodyClassName)}>{children}</div>

        {footer && (
          <div
            className={cn('flex flex-wrap justify-end gap-2 border-t px-6 py-4', footerClassName)}
            style={{ borderColor: colors.borderColor }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
