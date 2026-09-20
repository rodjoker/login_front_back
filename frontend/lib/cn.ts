// lib/cn.ts - Une clases de Tailwind resolviendo conflictos.
// cn('rounded-lg p-2', 'rounded-none') -> 'p-2 rounded-none'  (gana la última)
// Sin esto, con clases en conflicto gana la que Tailwind emita al final del
// CSS, no la que escribas al final, y el override del desarrollador falla.
import { twMerge } from 'tailwind-merge';

export function cn(...classes: Array<string | false | null | undefined>): string {
  return twMerge(classes.filter(Boolean).join(' '));
}
