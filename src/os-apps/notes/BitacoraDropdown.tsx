import { useEffect, useRef, useState, useId } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import styles from "./BitacoraDropdown.module.css";

export interface BitacoraDropdownOption<T extends string = string> {
  value: T;
  label: string;
  dotColor?: string;
  badge?: string;
}

export interface BitacoraDropdownProps<T extends string = string> {
  value: T;
  options: BitacoraDropdownOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  isDark: boolean;
  inputBg: string;
  inputBorder: string;
  textPrimary: string;
  textMuted: string;
  accentColor?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}

export function BitacoraDropdown<T extends string = string>({
  value,
  options,
  onChange,
  placeholder = "Seleccionar...",
  isDark,
  inputBg,
  inputBorder,
  textPrimary,
  textMuted,
  accentColor = "#1893ff",
  style,
  ariaLabel,
}: BitacoraDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const openDropdown = () => {
    const idx = options.findIndex((opt) => opt.value === value);
    setFocusedIndex(idx >= 0 ? idx : 0);
    setIsOpen(true);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleToggle = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  const handleSelect = (val: T) => {
    onChange(val);
    closeDropdown();
    triggerRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        openDropdown();
      } else {
        setFocusedIndex((prev) => (prev + 1) % options.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) {
        openDropdown();
      } else {
        setFocusedIndex(
          (prev) => (prev - 1 + options.length) % options.length,
        );
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!isOpen) {
        openDropdown();
      } else if (focusedIndex >= 0 && focusedIndex < options.length) {
        handleSelect(options[focusedIndex].value);
      }
    } else if (e.key === "Escape") {
      if (isOpen) {
        e.preventDefault();
        closeDropdown();
        triggerRef.current?.focus();
      }
    } else if (e.key === "Tab") {
      if (isOpen) {
        closeDropdown();
      }
    }
  };

  // Glassmorphic popover background
  const menuBg = isDark ? "rgba(22, 27, 34, 0.94)" : "rgba(255, 255, 255, 0.96)";
  const menuBorder = isDark
    ? "rgba(255, 255, 255, 0.12)"
    : "rgba(0, 0, 0, 0.12)";
  const menuShadow = isDark
    ? "0 12px 28px -4px rgba(0, 0, 0, 0.55), 0 3px 8px rgba(0, 0, 0, 0.3)"
    : "0 12px 24px -4px rgba(0, 0, 0, 0.14), 0 3px 8px rgba(0, 0, 0, 0.05)";

  return (
    <div
      ref={containerRef}
      className={styles.dropdownRoot}
      style={{
        zIndex: isOpen ? 60 : 1,
        ...style,
      }}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ""}`}
        style={{
          background: inputBg,
          borderColor: isOpen ? accentColor : inputBorder,
          color: textPrimary,
          minHeight: 33,
        }}
        onClick={handleToggle}
      >
        <div className={styles.triggerContent}>
          {selectedOption?.dotColor && (
            <span
              className={styles.dot}
              style={{
                background: selectedOption.dotColor,
                boxShadow: `0 0 5px ${selectedOption.dotColor}88`,
              }}
            />
          )}
          <span
            className={styles.triggerText}
            style={{ color: (selectedOption || value) ? textPrimary : textMuted }}
          >
            {selectedOption ? selectedOption.label : (value || placeholder)}
          </span>
        </div>

        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          style={{ color: isOpen ? accentColor : textMuted }}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          className={styles.menu}
          style={{
            background: menuBg,
            borderColor: menuBorder,
            borderStyle: "solid",
            borderWidth: 1,
            boxShadow: menuShadow,
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
        >
          {options.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isFocused = idx === focusedIndex;

            let itemBg = "transparent";
            let itemColor = textPrimary;

            if (isSelected) {
              itemBg = isDark
                ? "rgba(24, 147, 255, 0.18)"
                : "rgba(24, 147, 255, 0.12)";
              itemColor = accentColor;
            } else if (isFocused) {
              itemBg = isDark
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.05)";
            }

            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                className={`${styles.optionItem} ${isSelected ? styles.optionSelected : ""}`}
                style={{
                  background: itemBg,
                  color: itemColor,
                  fontWeight: isSelected ? 600 : 400,
                }}
                onClick={() => handleSelect(opt.value)}
                onMouseEnter={() => setFocusedIndex(idx)}
              >
                <div className={styles.optionContent}>
                  {opt.dotColor && (
                    <span
                      className={styles.dot}
                      style={{
                        background: opt.dotColor,
                        boxShadow: isSelected
                          ? `0 0 6px ${opt.dotColor}`
                          : "none",
                      }}
                    />
                  )}
                  <span className={styles.optionText}>{opt.label}</span>
                </div>

                {isSelected && (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={accentColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.checkIcon}
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
