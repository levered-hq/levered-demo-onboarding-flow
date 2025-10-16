import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

interface FunnelLayoutProps {
  children: ReactNode;
  progress: number;
  showBack?: boolean;
  onBack?: () => void;
}

const FunnelLayout = ({ children, progress, showBack = false, onBack }: FunnelLayoutProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-foreground"
          >
            <path
              d="M4 8L8 4L12 8V28H4V8Z"
              fill="currentColor"
            />
            <path
              d="M14 12L18 8L22 12V28H14V12Z"
              fill="currentColor"
            />
            <path
              d="M24 16L28 12V28H24V16Z"
              fill="currentColor"
            />
          </svg>
          <span className="text-2xl font-bold">moss</span>
        </div>
        <div className="flex items-center gap-2">
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 30'%3E%3CclipPath id='a'%3E%3Cpath d='M0 0v30h60V0z'/%3E%3C/clipPath%3E%3CclipPath id='b'%3E%3Cpath d='M30 15h30v15zv15H0zH0V0zV0h30z'/%3E%3C/clipPath%3E%3Cg clip-path='url(%23a)'%3E%3Cpath d='M0 0v30h60V0z' fill='%23012169'/%3E%3Cpath d='M0 0l60 30m0-30L0 30' stroke='%23fff' stroke-width='6'/%3E%3Cpath d='M0 0l60 30m0-30L0 30' clip-path='url(%23b)' stroke='%23C8102E' stroke-width='4'/%3E%3Cpath d='M30 0v30M0 15h60' stroke='%23fff' stroke-width='10'/%3E%3Cpath d='M30 0v30M0 15h60' stroke='%23C8102E' stroke-width='6'/%3E%3C/g%3E%3C/svg%3E"
            alt="UK"
            className="w-6 h-4"
          />
          <svg
            className="w-4 h-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {children}
          {showBack && (
            <button
              onClick={handleBack}
              className="mt-8 flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 md:px-12 text-center text-sm text-muted-foreground border-t border-border">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <span>© 2019 - 2025 Nufin GmbH</span>
          <a href="#" className="hover:text-foreground transition-colors">
            Imprint
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Cookie Consent
          </a>
        </div>
      </footer>
    </div>
  );
};

export default FunnelLayout;
