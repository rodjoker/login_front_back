'use client';
// components/Accordion.tsx - Acordeón FAQ: un solo panel abierto a la vez.
import React, { useState, useId } from 'react';
import { colors } from '@/lib/colors';
import { cn } from '@/lib/cn';

export interface AccordionItem {
  question: string;
  answer: React.ReactNode; // ReactNode permite pasar texto, links o JSX
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: number | null; // índice abierto al inicio; null = todos cerrados
  className?: string;
  itemClassName?: string;
  questionClassName?: string;
  answerClassName?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpen = null,
  className,
  itemClassName,
  questionClassName,
  answerClassName,
}) => {
  // Un solo número: cuál está abierto (o null). Abrir uno cierra el resto solo.
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);
  const baseId = useId();

  return (
    <div
      className={cn('w-full rounded-lg border overflow-hidden', className)}
      style={{ borderColor: colors.borderColor }}
    >
      {items.map((item, i) => {
        const open = openIndex === i;
        const buttonId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;

        return (
          <div
            key={i}
            className={cn('border-b last:border-b-0', itemClassName)}
            style={{ borderColor: colors.borderColor }}
          >
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : i)}
                className={cn(
                  'flex w-full items-center justify-between gap-4 px-4 py-3 text-left font-medium',
                  'cursor-pointer transition-colors duration-200 hover:opacity-80',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset',
                  questionClassName
                )}
                style={{
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.foregroundColor,
                }}
              >
                <span>{item.question}</span>
                {/* Chevron con CSS: un cuadrado con 2 bordes, rotado 45°.
                    Al abrir gira 180° y apunta hacia arriba. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'shrink-0 h-2.5 w-2.5 border-b-2 border-r-2 transition-transform duration-300',
                    'motion-reduce:transition-none',
                    open ? 'rotate-[225deg]' : 'rotate-45'
                  )}
                />
              </button>
            </h3>

            {/* Panel animado: la fila del grid pasa de 0fr a 1fr, así la altura
                se anima sin medirla con JS. */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                'grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none',
                open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              )}
            >
              <div className="overflow-hidden">
                {/* El padding va acá adentro: si va en el que tiene
                    overflow-hidden, la fila nunca colapsa del todo. */}
                <div
                  className={cn('px-4 py-3', answerClassName)}
                  style={{ color: colors.foregroundSecondary }}
                >
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
