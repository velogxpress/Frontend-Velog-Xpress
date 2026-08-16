"use client";

import React, { FC, forwardRef, useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { Camera, X } from "lucide-react";


interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  defaultValue?: string | number;
  value?: string | number; // Added value prop
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  step?: number;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string; // Optional hint text
}

const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(({
  type = "text",
  id,
  name,
  placeholder,
  defaultValue,
  onChange,
  onKeyUp,
  onKeyDown,
  onBlur,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
  value,
}, ref) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerError, setScannerError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerControlsRef = useRef<IScannerControls | null>(null);
  const isSearchField = /recher|search/i.test(placeholder ?? "") || type === "search";

  const applyScannedValue = (scannedValue: string) => {
    const eventTarget = { value: scannedValue } as HTMLInputElement;
    onChange?.({ target: eventTarget, currentTarget: eventTarget } as React.ChangeEvent<HTMLInputElement>);
    globalThis.setTimeout(() => {
      onKeyUp?.({ key: "Enter", target: eventTarget, currentTarget: eventTarget } as React.KeyboardEvent<HTMLInputElement>);
    }, 0);
  };

  useEffect(() => {
    if (!isScannerOpen || !videoRef.current) return;

    let active = true;
    const formats = [
      BarcodeFormat.QR_CODE,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.ITF,
      BarcodeFormat.DATA_MATRIX,
      BarcodeFormat.PDF_417,
    ];
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    hints.set(DecodeHintType.TRY_HARDER, true);
    const reader = new BrowserMultiFormatReader(hints, {
      delayBetweenScanAttempts: 180,
      delayBetweenScanSuccess: 500,
    });
    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      const isExpectedScanMiss =
        typeof args[0] === "string" &&
        args[0].includes("MultiFormatReader: non-ReaderException from reader") &&
        String(args[1]).includes("NotFoundException");
      if (!isExpectedScanMiss) originalWarn(...args);
    };
    setScannerError("");

    reader
      .decodeFromConstraints({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      }, videoRef.current, (result, _error, controls) => {
        if (!active || !result) return;
        const scannedValue = result.getText().trim();
        controls.stop();
        scannerControlsRef.current = null;
        applyScannedValue(scannedValue);
        setIsScannerOpen(false);
      })
      .then((controls) => {
        if (!active) {
          controls.stop();
          return;
        }
        scannerControlsRef.current = controls;
      })
      .catch(() => {
        if (active) {
          setScannerError("Kamera a pa disponib. Verifye pèmisyon kamera telefòn nan.");
        }
      });

    return () => {
      active = false;
      scannerControlsRef.current?.stop();
      scannerControlsRef.current = null;
      console.warn = originalWarn;
    };
  }, [isScannerOpen]);

  const closeScanner = () => {
    scannerControlsRef.current?.stop();
    scannerControlsRef.current = null;
    setIsScannerOpen(false);
  };

  // Determine input styles based on state (disabled, success, error)
  let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`;

  if (isSearchField && !disabled) {
    inputClasses += " pr-12";
  }

  // Add styles for the different states
  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    inputClasses += ` text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10  dark:text-error-400 dark:border-error-500`;
  } else if (success) {
    inputClasses += ` text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300  dark:text-success-400 dark:border-success-500`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
  }

  return (
    <div className="relative">
      <input
        ref={ref}
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={inputClasses}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        value={value}
      />

      {isSearchField && !disabled && (
        <button
          type="button"
          title="Eskane yon kòd ak kamera"
          aria-label="Eskane yon kòd ak kamera"
          onClick={() => setIsScannerOpen(true)}
          className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:bg-brand-50 hover:text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:text-gray-400 dark:hover:bg-brand-500/10 dark:hover:text-brand-400"
        >
          <Camera className="h-4.5 w-4.5" />
        </button>
      )}

      {/* Optional Hint Text */}
      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-error-500"
              : success
              ? "text-success-500"
              : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}


      {isScannerOpen && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-gray-950/80 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-white/[0.08]">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Eskane kòd la</h3>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Mete QR code oswa barcode la anndan kad la.</p>
              </div>
              <button type="button" onClick={closeScanner} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[0.06]" aria-label="Fèmen scanner la">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative aspect-[3/4] max-h-[65vh] bg-black sm:aspect-square">
              <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
              <div className="pointer-events-none absolute inset-[12%] rounded-2xl border-2 border-emerald-400 shadow-[0_0_0_999px_rgba(0,0,0,0.28)]" />
            </div>
            {scannerError && <p className="px-5 py-4 text-sm text-error-600 dark:text-error-400">{scannerError}</p>}
          </div>
        </div>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
