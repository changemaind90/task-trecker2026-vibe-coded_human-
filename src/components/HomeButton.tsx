"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomeButton() {
  return (
    <Link href="/">
      <Button variant="outline" size="sm">
        🏠 На главную
      </Button>
    </Link>
  );
}