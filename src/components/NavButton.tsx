"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  label: string;
  icon: string;
  href?: string;
  onClick?: () => void;
};

export default function NavButton({ label, icon, href, onClick }: Props) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) onClick();
    if (href) router.push(href);
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className="cursor-pointer border border-border bg-white/40 dark:bg-black/20 backdrop-blur-md hover:bg-white/70 
      dark:hover:bg-black/40 hover:border-white/60 hover:scale-105 transition-all duration-200"
    >
      <span className="mr-1.5">{icon}</span>
      {label}
    </Button>
  );
}
