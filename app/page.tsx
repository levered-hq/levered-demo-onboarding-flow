"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="mb-4 text-4xl font-bold">Hay Onboarding Funnel Demo</h1>
        <p className="text-xl text-muted-foreground">
          B2B SaaS Multi-Step Survey
        </p>

        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Link href="/get-started" passHref>
            Get Started
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
