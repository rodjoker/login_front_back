'use client';
// components/Select.tsx - Select propio. Por defecto solo se elige de una lista;
// con `searchable` el campo permite escribir para filtrar las opciones.
import React, { useState, useId, useRef, useEffect } from 'react';
import { colors } from '@/lib/colors';
import { cn } from '@/lib/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string; // controlado: el padre decide el valor
  defaultValue?: string; // no controlado: valor inicial
  onChange?: (value: string) => void;
  placeholder?: string;
  searchable?: boolean; // true = se puede escribir para filtrar
  disabled?: boolean;
  label?: string;
  name?: string; // si se pasa, el valor viaja en formularios (<form>)
  emptyMessage?: string; // texto cuando el filtro no encuentra nada
  className?: string;
  triggerClassName?: string;
  listClassName?: string;
  optionClassName?: string;
}

// "Peru" encuentra "Perú": se comparan sin tildes ni mayúsculas.
const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  defaultValue = '',
  onChange,
  placeholder = 'Selecciona una opción',
  searchable = false,
  disabled = false,
  label,
  name,
  emptyMessage = 'Sin resultados',
  className,
  triggerClassName,
  listClassName,
  optionClassName,
}) => {
  const [innerValue, setInnerValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0); // índice resaltado dentro de la lista visible

  const baseId = useId();
  const triggerId = `${baseId}-trigger`;
  const listId = `${baseId}-list`;
  const optionId = (i: number) => `${baseId}-opt-${i}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement & HTMLInputElement>(null);

  const current = value !== undefined ? value : innerValue;
  const selected = options.find((o) => o.value === current);

  // Lista visible: todas, o solo las que coinciden con lo escrito.
  const filtered =
    searchable && query
      ? options.filter((o) => normalize(o.label).includes(normalize(query)))
      : options;

  const firstEnabled = (list: SelectOption[]) => {
    const i = list.findIndex((o) => !o.disabled);
    return i === -1 ? 0 : i;
  };

  const openList = () => {
    if (disabled) return;
    setQuery('');
    const i = options.findIndex((o) => o.value === current);
    setActive(i >= 0 ? i : firstEnabled(options));
    setOpen(true);
  };

  const closeList = () => {
    setOpen(false);
    setQuery('');
  };

  // Mueve el resaltado saltando las opciones deshabilitadas (con vuelta al inicio).
  const move = (dir: 1 | -1) => {
    if (filtered.length === 0) return;
    let i = active;
    for (let step = 0; step < filtered.length; step++) {
      i = (i + dir + filtered.length) % filtered.length;
      if (!filtered[i].disabled) break;
    }
    setActive(i);
  };

  const choose = (opt: SelectOption | undefined) => {
    if (!opt || opt.disabled) return;
    setInnerValue(opt.value);
    onChange?.(opt.value);
    closeList();
    triggerRef.current?.focus();
  };

  // Clic fuera cierra la lista.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Con el teclado, mantiene visible la opción resaltada.
  useEffect(() => {
    if (!open) return;
    document.getElementById(optionId(active))?.scrollIntoView({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (open) move(1);
        else openList();
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (open) move(-1);
        else openList();
        break;
      case 'Home':
        if (open && !searchable) {
          e.preventDefault();
          setActive(firstEnabled(filtered));
        }
        break;
      case 'End':
        if (open && !searchable) {
          e.preventDefault();
          setActive(filtered.length - 1);
        }
        break;
      case 'Enter':
        if (open) {
          e.preventDefault();
          choose(filtered[active]);
        } else if (!searchable) {
          e.preventDefault();
          openList();
        }
        break;
      case ' ':
        // En el modo con input el espacio es un carácter más.
        if (!searchable) {
          e.preventDefault();
          if (open) choose(filtered[active]);
          else openList();
        }
        break;
      case 'Escape':
        if (open) {
          e.preventDefault();
          closeList();
        }
        break;
      case 'Tab':
        closeList();
        break;
    }
  };

  const fieldClasses = cn(
    'flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-left',
    'transition-colors duration-200',
    'focus:outline-none focus-visible:ring-2',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    triggerClassName
  );
  const fieldStyle: React.CSSProperties = {
    backgroundColor: colors.backgroundColor,
    borderColor: colors.borderColor,
    color: colors.foregroundColor,
  };

  // Ambos modos comparten estas props de accesibilidad (patrón combobox).
  const comboboxProps = {
    id: triggerId,
    role: 'combobox' as const,
    'aria-expanded': open,
    'aria-controls': listId,
    'aria-haspopup': 'listbox' as const,
    'aria-activedescendant': open && filtered.length > 0 ? optionId(active) : undefined,
    disabled,
    onKeyDown,
  };

  const chevron = (
    <span
      aria-hidden="true"
      className={cn(
        'shrink-0 h-2.5 w-2.5 border-b-2 border-r-2 transition-transform duration-200',
        'motion-reduce:transition-none',
        open ? 'rotate-[225deg]' : 'rotate-45 -translate-y-0.5'
      )}
    />
  );

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {label && (
        <label
          htmlFor={triggerId}
          className="mb-1 block text-sm font-medium"
          style={{ color: colors.foregroundColor }}
        >
          {label}
        </label>
      )}

      {searchable ? (
        <div className="relative">
          <input
            {...comboboxProps}
            ref={triggerRef}
            type="text"
            autoComplete="off"
            aria-autocomplete="list"
            // Abierto: muestra lo que se escribe. Cerrado: la opción elegida.
            value={open ? query : (selected?.label ?? '')}
            placeholder={open && selected ? selected.label : placeholder}
            onClick={() => !open && openList()}
            onChange={(e) => {
              const text = e.target.value;
              setQuery(text);
              setOpen(true);
              const next = text
                ? options.filter((o) => normalize(o.label).includes(normalize(text)))
                : options;
              setActive(firstEnabled(next));
            }}
            className={cn(fieldClasses, 'pr-9')}
            style={fieldStyle}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            {chevron}
          </span>
        </div>
      ) : (
        <button
          {...comboboxProps}
          ref={triggerRef}
          type="button"
          onClick={() => (open ? closeList() : openList())}
          // El teclado ya se resolvió en keydown; evita el clic doble en Firefox.
          onKeyUp={(e) => e.key === ' ' && e.preventDefault()}
          className={fieldClasses}
          style={fieldStyle}
        >
          <span
            className="truncate"
            style={{ color: selected ? colors.foregroundColor : colors.foregroundSecondary }}
          >
            {selected?.label ?? placeholder}
          </span>
          {chevron}
        </button>
      )}

      {name && <input type="hidden" name={name} value={current} />}

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={label ? undefined : triggerId}
          className={cn(
            'absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border py-1 shadow-lg',
            listClassName
          )}
          style={{
            backgroundColor: colors.backgroundColor,
            borderColor: colors.borderColor,
          }}
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm" style={{ color: colors.foregroundSecondary }}>
              {emptyMessage}
            </li>
          ) : (
            filtered.map((opt, i) => {
              const isSelected = opt.value === current;
              return (
                <li
                  key={opt.value}
                  id={optionId(i)}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={opt.disabled || undefined}
                  // mousedown + preventDefault: el campo no pierde el foco al hacer clic.
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(opt)}
                  onMouseEnter={() => !opt.disabled && setActive(i)}
                  className={cn(
                    'px-3 py-2',
                    opt.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                    isSelected && 'font-semibold',
                    optionClassName
                  )}
                  style={{
                    backgroundColor: i === active ? colors.backgroundSecondary : 'transparent',
                    color: isSelected ? colors.primaryColor : colors.foregroundColor,
                  }}
                >
                  {opt.label}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
};

export default Select;
