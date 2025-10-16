import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const OptionCard = ({ title, description, icon, onClick, className, disabled }: OptionCardProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center justify-between p-5 bg-card border border-border rounded-lg",
        "hover:border-primary hover:bg-accent/5 transition-all duration-200",
        "text-left group",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:bg-card",
        className
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div className="flex-1">
          <div className="font-medium text-foreground text-base">{title}</div>
          {description && (
            <div className="text-sm text-muted-foreground mt-1">{description}</div>
          )}
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
    </button>
  );
};

export default OptionCard;
