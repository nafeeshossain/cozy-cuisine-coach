import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, type UserPreferences } from "@/hooks/useProfile";
import { WelcomeHero } from "@/components/WelcomeHero";
import { PreferencesForm } from "@/components/PreferencesForm";
import { MealPlanDashboard } from "@/components/MealPlanDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'preferences' | 'dashboard'>('welcome');
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, isLoading: profileLoading, updateProfile } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      // User is not authenticated, stay on welcome page
      setCurrentStep('welcome');
    } else if (user && profile) {
      // User is authenticated and has a profile with preferences
      if (profile.diet_types?.length && profile.goals?.length) {
        setCurrentStep('dashboard');
      } else {
        setCurrentStep('preferences');
      }
    } else if (user && !profileLoading && !profile) {
      // User is authenticated but no profile exists yet
      setCurrentStep('preferences');
    }
  }, [user, profile, authLoading, profileLoading]);

  const handleStartPlanning = () => {
    if (!user) {
      navigate('/auth');
    } else {
      setCurrentStep('preferences');
    }
  };

  const handlePreferencesComplete = async (preferences: UserPreferences) => {
    updateProfile(preferences);
    toast({
      title: "Preferences saved! 🎉",
      description: "Your personalized meal plan is ready!",
    });
    setCurrentStep('dashboard');
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      setCurrentStep('welcome');
      toast({
        title: "See you soon! 👋",
        description: "Come back anytime for more delicious meal plans!",
      });
    }
  };

  const convertProfileToPreferences = (profile: any): UserPreferences => {
    return {
      name: profile.name || '',
      dietType: profile.diet_types || [],
      allergies: profile.allergies || '',
      favoritefoods: profile.favorite_foods || '',
      dislikes: profile.dislikes || '',
      goals: profile.goals || [],
      calorieTarget: profile.calorie_target?.toString() || ''
    };
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center">
        <Card className="shadow-warm border-0">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your meal planning journey...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show auth button when user is logged in
  const AuthButton = () => (
    user ? (
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2">
          <User className="w-4 h-4" />
          {profile?.name || user.email}
        </Button>
        <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    ) : null
  );

  if (currentStep === 'welcome') {
    return (
      <>
        <AuthButton />
        <WelcomeHero onStartPlanning={handleStartPlanning} />
      </>
    );
  }

  if (currentStep === 'preferences') {
    return (
      <>
        <AuthButton />
        <PreferencesForm onComplete={handlePreferencesComplete} />
      </>
    );
  }

  if (currentStep === 'dashboard' && profile) {
    const preferences = convertProfileToPreferences(profile);
    return (
      <>
        <AuthButton />
        <MealPlanDashboard preferences={preferences} />
      </>
    );
  }

  return null;
};

export default Index;