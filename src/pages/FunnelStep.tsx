import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import FunnelLayout from "@/components/FunnelLayout";
import OptionCard from "@/components/OptionCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  STEP_OPTIONS,
  STEP_TITLES,
  STEP_SUBTITLES,
  getNextRoute,
  calculateProgress,
} from "@/lib/funnelLogic";
import { getSession, updateSessionAnswer, getSessionAnswers } from "@/lib/sessionStorage";
import { toast } from "sonner";

const FunnelStep = () => {
  const { sessionId, stepSlug } = useParams<{ sessionId: string; stepSlug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Validate session
    if (!sessionId || !getSession(sessionId)) {
      toast.error("Invalid session");
      navigate("/get-started");
    }
  }, [sessionId, navigate]);

  const handleSelectOption = (value: string) => {
    if (!sessionId || !stepSlug) return;

    updateSessionAnswer(sessionId, stepSlug, value);
    const allAnswers = getSessionAnswers(sessionId);
    const nextRoute = getNextRoute(stepSlug, value, allAnswers);

    setTimeout(() => {
      if (nextRoute.type === "step") {
        navigate(`/funnel-form/${sessionId}/${nextRoute.slug}`);
      } else {
        navigate(`/funnel-outcome/${sessionId}/${nextRoute.slug}`);
      }
    }, 200);
  };

  if (!stepSlug || !STEP_OPTIONS[stepSlug]) {
    return null;
  }

  const options = STEP_OPTIONS[stepSlug];
  const title = STEP_TITLES[stepSlug];
  const subtitle = STEP_SUBTITLES[stepSlug];
  const progress = calculateProgress(stepSlug);

  const showDropdown = stepSlug === "registration-country" || stepSlug === "corporate-form" || stepSlug === "erp";
  const primaryOptions = showDropdown ? options.slice(0, Math.min(8, options.length)) : options;

  return (
    <FunnelLayout progress={progress} showBack>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="space-y-3 pt-4">
          {primaryOptions.map((option) => (
            <OptionCard
              key={option.value}
              title={option.label}
              description={option.description}
              onClick={() => handleSelectOption(option.value)}
            />
          ))}

          {showDropdown && (
            <div className="pt-4 space-y-3">
              <p className="text-sm text-muted-foreground">None of these?</p>
              <Select onValueChange={handleSelectOption}>
                <SelectTrigger className="w-full h-14 text-base border-2">
                  <SelectValue placeholder="Select another option..." />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {stepSlug === "is-credit-required" && (
            <p className="text-sm text-muted-foreground pt-2">*Eligibility and credit checks apply</p>
          )}

          {stepSlug === "erp" && (
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
                  }}
                />
                <label htmlFor="no-software" className="text-sm text-foreground cursor-pointer">
                  I don't want to connect any software to Moss, I will export my data manually.
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </FunnelLayout>
  );
};

export default FunnelStep;
