"use client";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "../ui/button";
import { NLLogo } from "../ui/lucide/nl-logo";

export default function Header() {
  const pathName = usePathname();
  const isTestTechnique = pathName === "/test-technique";

  return (
    <header className="bg-background z-10 flex min-h-24 flex-col justify-center p-4 shadow-md shadow-gray-100">
      <div className="flex items-center justify-between gap-2">
        <NLLogo className="h-auto w-64" />
        <Link
          href={isTestTechnique ? "/" : "/test-technique"}
          className={cn(
            buttonVariants({
              variant: "default",
              size: "default",
            }),
            "font-clash text-md w-fit font-medium",
          )}
        >
          {isTestTechnique ? (
            <>
              <ArrowLeft className="size-4" />
              <span className="hidden md:block">Retour à l'énoncé</span>
            </>
          ) : (
            <>
              <span className="hidden md:block">
                Aller vers la page de votre test technique
              </span>
              <ArrowRight className="size-4" />
            </>
          )}
        </Link>
      </div>
    </header>
  );
}
