"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
"@/components/ui/select";
import { getSession } from "@/lib/sessionStorage";
import { toast } from "sonner";

const FunnelOutcome = () => {
  const params = useParams();
  const router = useRouter();
  const sessionId = Array.isArray(params?.sessionId)
    ? params.sessionId[0]
    : params?.sessionId;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    role: "",
    phone: ""
  });

  useEffect(() => {
    if (!sessionId || !getSession(sessionId)) {
      toast.error("Invalid session");
      router.push("/get-started");
    }
  }, [sessionId, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! We'll be in touch soon.");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Form */}
      <div className="flex-1 bg-background p-8 lg:p-16 flex items-center">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-foreground">

              <path d="M4 8L8 4L12 8V28H4V8Z" fill="currentColor" />
              <path d="M14 12L18 8L22 12V28H14V12Z" fill="currentColor" />
              <path d="M24 16L28 12V28H24V16Z" fill="currentColor" />
            </svg>
<<<<<<< HEAD
            <span className="text-2xl font-bold" data-levered-id="69ed4160e8">moss</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight" data-levered-id="5e0c755042">
              Moss is a great match for you! Let's set you up with a product
=======
            <span className="text-2xl font-bold">hay</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Hay is a great match for you! Let's set you up with a product
>>>>>>> tmp
              expert to find out how.
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First name *
                </label>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="h-12" />

              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last name *
                </label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="h-12" />

              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium">
                Company name *
              </label>
              <Input
                id="company"
                required
                value={formData.company}
                onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
                }
                className="h-12" />

            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role *
              </label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                setFormData({ ...formData, role: value })
                }>

                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ceo">CEO</SelectItem>
                  <SelectItem value="cfo">CFO</SelectItem>
                  <SelectItem value="finance">Finance Manager</SelectItem>
                  <SelectItem value="controller">Controller</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone number *
              </label>
              <div className="flex gap-2">
                <Select defaultValue="+49">
                  <SelectTrigger className="w-24 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+49">🇩🇪 +49</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    <SelectItem value="+31">🇳🇱 +31</SelectItem>
                    <SelectItem value="+43">🇦🇹 +43</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  type="tel"
                  required
                  placeholder="00000 0000000"
                  value={formData.phone}
                  onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                  }
                  className="flex-1 h-12" />

              </div>
              <p className="text-xs text-muted-foreground" data-levered-id="7878df5701">
                Required for verification
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-primary hover:bg-primary/90 text-lg font-medium">

              Book an intro
            </Button>

<<<<<<< HEAD
            <p className="text-sm text-muted-foreground" data-levered-id="3dc69d2f80">
              By proceeding, you agree to Moss{" "}
=======
            <p className="text-sm text-muted-foreground">
              By proceeding, you agree to Hay{" "}
>>>>>>> tmp
              <a href="#" className="underline hover:text-foreground">
                terms and conditions
              </a>
              .
            </p>
          </form>
        </div>
      </div>

      {/* Right side - Info panel */}
      <div className="lg:w-[540px] bg-hay-gradient p-8 lg:p-12 text-white flex flex-col justify-between min-h-screen">
        <div className="space-y-12 flex-1 flex flex-col justify-center">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight" data-levered-id="b3f058bebb">
              Here's what you can expect
            </h2>

            <ol className="space-y-5 text-base lg:text-lg leading-relaxed">
              <li className="flex gap-3">
                <span className="font-semibold flex-shrink-0" data-levered-id="8fb723dac6">1.</span>
                <span data-levered-id="56447f7708">Share your challenges and priorities.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold flex-shrink-0" data-levered-id="075792c8b3">2.</span>
                <span data-levered-id="e74130f073">Get a personalized walkthrough of the platform.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold flex-shrink-0" data-levered-id="d108c57819">3.</span>
                <span data-levered-id="70deaa95ca">Receive expert advice tailored to your needs.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold flex-shrink-0" data-levered-id="dc63f3cd78">4.</span>
                <span data-levered-id="1db72144de">No commitment to sign up.</span>
              </li>
            </ol>
          </div>

          <div className="pt-4">
            <Image
              src="https://getmoss.com/public/media/images/banners/demo.png"
              alt="Hay platform preview"
              className="rounded-lg shadow-2xl w-full"
              width={540}
              height={304}
              priority />

          </div>
        </div>

        <div className="space-y-6 pt-12 border-t border-white/20 mt-auto">
          <p className="text-base font-medium" data-levered-id="1b29f5f55b">
            Trusted by 6,000+ finance teams
          </p>
          <div className="flex items-center gap-8 flex-wrap text-white/90">
            <div className="text-base font-bold tracking-wide">
              PIZZA PILGRIMS
            </div>
            <div className="text-base font-bold tracking-wide">Flink*</div>
            <div className="text-base font-bold tracking-wide">AUTO1</div>
            <div className="text-base font-bold tracking-wide">Moonfare</div>
            <div className="text-base font-bold tracking-wide">Florence</div>
          </div>
        </div>
      </div>
    </div>);

};

export default FunnelOutcome;
