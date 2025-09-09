import { useState } from "react";
import { WelcomeHero } from "@/components/WelcomeHero";
import { PreferencesForm } from "@/components/PreferencesForm";
import { MealPlanDashboard } from "@/components/MealPlanDashboard";

interface UserPreferences {
  name: string;
  dietType: string[];
  allergies: string;
  favoritefoods: string;
  dislikes: string;
  goals: string[];
  calorieTarget: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'preferences' | 'dashboard'>('welcome');
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);

  const handleStartPlanning = () => {
    setCurrentStep('preferences');
  };

  const handlePreferencesComplete = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    setCurrentStep('dashboard');
  };

  if (currentStep === 'welcome') {
    return <WelcomeHero onStartPlanning={handleStartPlanning} />;
  }

  if (currentStep === 'preferences') {
    return <PreferencesForm onComplete={handlePreferencesComplete} />;
  }

  if (currentStep === 'dashboard' && userPreferences) {
    return <MealPlanDashboard preferences={userPreferences} />;
  }

  return null;
};

export default Index;