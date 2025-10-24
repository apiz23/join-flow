"use client";

import { useRef, useState } from "react";
import clsx from "clsx";

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
    background: "bg-background-100",
    text: "text-gray-1000",
    fill: "fill-gray-1000",
  },
  inverted: {
    background: "bg-gray-1000",
    text: "text-gray-100",
    fill: "fill-gray-100",
  },
  success: {
    background: "bg-blue-100",
    text: "text-blue-900",
    fill: "fill-blue-900",
  },
  warning: {
    background: "bg-amber-100",
    text: "text-amber-900",
    fill: "fill-amber-900",
  },
  error: {
    background: "bg-red-100",
    text: "text-red-900",
    fill: "fill-red-900",
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
        "flex px-3 py-2.5 rounded-md border border-gray-alpha-400",
        colors.background,
      )}
      style={{ width }}
    >
      <div className="mr-3">
        {lines.map((line) => (
          <div
            key={line}
            className={clsx(
              "font-mono text-[13px] truncate",
              prompt && "before:content-['$_']",
              colors.text,
            )}
          >
            {line}
          </div>
        ))}
      </div>

      <div className="ml-auto cursor-pointer" onClick={handleCopy}>
        {copied ? (
          <span className={clsx("text-xs font-medium", colors.text)}>
            Copied!
          </span>
        ) : (
          <svg
            height="16"
            width="16"
            viewBox="0 0 16 16"
            className={clsx(colors.fill)}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z"
            />
          </svg>
        )}
      </div>
    </div>
  );
};
