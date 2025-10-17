"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FunnelLayout from "@/components/FunnelLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { createSession } from "@/lib/sessionStorage";
import { toast } from "sonner";

const GetStarted = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    // Create session and navigate to first step
    setTimeout(() => {
      const sessionId = createSession(email);
      router.push(`/funnel-form/${sessionId}/employees`);
      setIsLoading(false);
    }, 300);
  };

  return (
    <FunnelLayout progress={0}>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Discover smarter spend management for your business.
          </h1>
          <p className="text-lg text-muted-foreground">
            Answer a few questions to see what Hay can do for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="What's your work email?"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-14 px-6 text-base border-2 focus:border-primary"
              required
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              Next
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            You accept our{" "}
            <a href="#" className="underline hover:text-foreground">
              privacy policy
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-foreground">
              consent
            </a>{" "}
            to Hay updates. You can opt out anytime.
          </p>
        </form>

        <div className="pt-12 border-t border-border">
          <div className="text-center space-y-6">
            <p className="text-sm text-muted-foreground font-medium">
              Trusted by 6,000+ finance teams
            </p>
            <div className="flex items-center justify-center gap-8 flex-wrap opacity-60">
              <div className="text-xl font-bold">PIZZA PILGRIMS</div>
              <div className="text-xl font-bold">Flink</div>
              <div className="text-xl font-bold">AUTO1</div>
              <div className="text-xl font-bold">Moonfare</div>
              <div className="text-xl font-bold">Florence</div>
            </div>
          </div>
        </div>
      </div>
    </FunnelLayout>
  );
};

export default GetStarted;
