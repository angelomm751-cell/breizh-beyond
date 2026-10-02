import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  tone?: "gold" | "navy" | "outline" | "ghost";
  arrow?: boolean;
};

export function Button({ children, tone = "navy", arrow = false, className, ...props }: Props) {
  return (
    <button className={cn("brand-button", `brand-button--${tone}`, className)} {...props}>
      <span>{children}</span>
      {arrow && <ArrowRight aria-hidden="true" size={16} />}
    </button>
  );
}