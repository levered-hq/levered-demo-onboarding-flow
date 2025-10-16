"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FunnelLayout from "@/components/FunnelLayout";
import OptionCard from "@/components/OptionCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
"@/components/ui/select";
import {
  STEP_OPTIONS,
  STEP_TITLES,
  STEP_SUBTITLES,
  calculateProgress } from
"@/lib/funnelLogic";
import {
  getSession,
  updateSessionAnswer,
  updateLeadData,
  storeProgressInfo,
  getProgressInfo } from
"@/lib/sessionStorage";
import { updateLeadFunnelStep, buildLeadUpdateDto } from "@/lib/api/funnelApi";
import {
  mapStepSlugToBackend,
  mapStepSlugFromBackend,
  isOutcomeStep } from
"@/lib/stepMapping";
import { toast } from "sonner";

const FunnelStep = () => {
  const params = useParams();
  const router = useRouter();
  const sessionId = Array.isArray(params?.sessionId) ?
  params.sessionId[0] :
  params?.sessionId;
  const stepSlug = Array.isArray(params?.stepSlug) ?
  params?.stepSlug[0] :
  params?.stepSlug;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Validate session
    if (!sessionId || !getSession(sessionId)) {
      toast.error("Invalid session");
      router.push("/get-started");
    }
  }, [sessionId, router]);

  const handleSelectOption = async (value: string) => {
    if (!sessionId || !stepSlug || loading) return;

    setLoading(true);

    try {
      // Map frontend slug to backend enum
      const backendStep = mapStepSlugToBackend(stepSlug);

      // Build the update DTO
      const updateDto = buildLeadUpdateDto(stepSlug, value);

      // Call the API
      const response = await updateLeadFunnelStep(
        sessionId,
        backendStep,
        updateDto
      );

      // Update session storage
      updateSessionAnswer(sessionId, stepSlug, value);
      updateLeadData(sessionId, updateDto);
      storeProgressInfo(sessionId, response.stepNumber, response.totalSteps);

      // Map backend response to frontend slug
      const nextSlug = mapStepSlugFromBackend(response.nextFunnelStep);

      // Navigate after successful API call
      if (isOutcomeStep(response.nextFunnelStep)) {
        router.push(`/funnel-outcome/${sessionId}/${nextSlug}`);
      } else {
        router.push(`/funnel-form/${sessionId}/${nextSlug}`);
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!stepSlug || !STEP_OPTIONS[stepSlug]) {
    return null;
  }

  const options = STEP_OPTIONS[stepSlug];
  const title = STEP_TITLES[stepSlug];
  const subtitle = STEP_SUBTITLES[stepSlug];

  // Get progress info from API if available
  const progressInfo = sessionId ? getProgressInfo(sessionId) : null;
  const progress = calculateProgress(
    stepSlug,
    progressInfo?.stepNumber,
    progressInfo?.totalSteps
  );

  const showDropdown =
  stepSlug === "registration-country" ||
  stepSlug === "corporate-form" ||
  stepSlug === "erp";
  const primaryOptions = showDropdown ?
  options.slice(0, Math.min(8, options.length)) :
  options;

  return (
    <FunnelLayout progress={progress} showBack>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground" data-levered-id="6f177971de">
            {title}
          </h1>
          {subtitle && <p className="text-muted-foreground" data-levered-id="5725973ac8">{subtitle}</p>}
        </div>

        <div className="space-y-3 pt-4">
          {primaryOptions.map((option) =>
          <OptionCard
            key={option.value}
            title={option.label}
            description={option.description}
            onClick={() => handleSelectOption(option.value)}
            disabled={loading} />

          )}

          {showDropdown &&
          <div className="pt-4 space-y-3">
              <p className="text-sm text-muted-foreground" data-levered-id="583d2cba69">None of these?</p>
              <Select onValueChange={handleSelectOption}>
                <SelectTrigger className="w-full h-14 text-base border-2">
                  <SelectValue placeholder="Select another option..." />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) =>
                <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                )}
                </SelectContent>
              </Select>
            </div>
          }

          {stepSlug === "is-credit-required" &&
          <p className="text-sm text-muted-foreground pt-2" data-levered-id="bfea17f4d8">
              *Eligibility and credit checks apply
            </p>
          }

          {stepSlug === "erp" &&
          <div className="pt-4 space-y-3">
              <div className="flex items-start gap-3">
                <input
                type="checkbox"
                id="no-software"
                className="mt-1 h-4 w-4 rounded border-border"
                onChange={(e) => {
                  if (e.target.checked) {
                    handleSelectOption("manual-export");
                  }
                }} />

                <label
                htmlFor="no-software"
                className="text-sm text-foreground cursor-pointer">

                  I don't want to connect any software to Moss, I will export my
                  data manually.
                </label>
              </div>
            </div>
          }
        </div>
      </div>
    </FunnelLayout>);

};

export default FunnelStep;