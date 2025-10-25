"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { Copy, CheckCheck } from "lucide-react";

type TSnippetType = "success" | "warning" | "error";

interface SnippetProps {
  text: string | string[];
  width?: string;
  onCopy?: () => void;
  prompt?: boolean;
  dark?: boolean;
  type?: TSnippetType;
}

const variant = {
  default: {
    background: "bg-muted/50",
    border: "border-border",
    text: "text-foreground",
    button: "text-muted-foreground hover:text-foreground hover:bg-accent",
    success: "text-green-600",
  },
  inverted: {
    background: "bg-gray-1000",
    border: "border-gray-600",
    text: "text-gray-100",
    button: "text-gray-400 hover:text-white hover:bg-gray-700",
    success: "text-green-400",
  },
  success: {
    background: "bg-green-50 dark:bg-green-950/20",
    border: "border-green-200 dark:border-green-800",
    text: "text-green-900 dark:text-green-100",
    button:
      "text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30",
    success: "text-green-600 dark:text-green-400",
  },
  warning: {
    background: "bg-amber-50 dark:bg-amber-950/20",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-900 dark:text-amber-100",
    button:
      "text-amber-600 hover:text-amber-700 hover:bg-amber-100 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-900/30",
    success: "text-amber-600 dark:text-amber-400",
  },
  error: {
    background: "bg-red-50 dark:bg-red-950/20",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-900 dark:text-red-100",
    button:
      "text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30",
    success: "text-red-600 dark:text-red-400",
  },
};

const getVariant = (inverted: boolean, type: TSnippetType | undefined) => {
  if (inverted) return variant.inverted;
  return type ? variant[type] : variant.default;
};

export const Snippet = ({
  text,
  width = "100%",
  onCopy,
  prompt = true,
  dark = false,
  type,
}: SnippetProps) => {
  const [copied, setCopied] = useState(false);
  const animationTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lines = typeof text === "string" ? [text] : text;
  const colors = getVariant(dark, type);

  const handleCopy = () => {
    if (animationTimeout.current) clearTimeout(animationTimeout.current);

    navigator.clipboard.writeText(lines.join("\n"));
    onCopy?.();
    setCopied(true);

    animationTimeout.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={clsx(
        "group flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200",
        colors.background,
        colors.border,
        "hover:shadow-sm",
      )}
      style={{ width }}
    >
      <div className="flex-1 min-w-0">
        {lines.map((line, index) => (
          <div
            key={index}
            className={clsx(
              "font-mono text-sm font-medium truncate",
              prompt && "before:mr-2 before:opacity-60",
              colors.text,
            )}
          >
            {line}
          </div>
        ))}
      </div>

      <button
        onClick={handleCopy}
        className={clsx(
          "ml-4 flex-shrink-0 p-2 rounded-md transition-all duration-200",
          "hover:scale-110 active:scale-95",
          colors.button,
          copied && "scale-110",
          copied && colors.success,
        )}
        title={copied ? "Copied!" : "Copy to clipboard"}
      >
        {copied ? (
          <CheckCheck className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};
