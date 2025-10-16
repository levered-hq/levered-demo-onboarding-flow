import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="mb-4 text-4xl font-bold">Moss Onboarding Funnel Demo</h1>
        <p className="text-xl text-muted-foreground">B2B SaaS Multi-Step Survey</p>
        <Button
          onClick={() => navigate("/get-started")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Start Onboarding
        </Button>
      </div>
    </div>
  );
};

export default Index;
