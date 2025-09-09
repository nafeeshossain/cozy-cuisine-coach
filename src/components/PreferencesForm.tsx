import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Leaf, Fish, Wheat, Heart, ChefHat, Target } from "lucide-react";

interface UserPreferences {
  name: string;
  dietType: string[];
  allergies: string;
  favoritefoods: string;
  dislikes: string;
  goals: string[];
  calorieTarget: string;
}

interface PreferencesFormProps {
  onComplete: (preferences: UserPreferences) => void;
}

export const PreferencesForm = ({ onComplete }: PreferencesFormProps) => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<UserPreferences>({
    name: "",
    dietType: [],
    allergies: "",
    favoritefoods: "",
    dislikes: "",
    goals: [],
    calorieTarget: ""
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const dietOptions = [
    { id: "vegetarian", label: "Vegetarian", icon: Leaf },
    { id: "vegan", label: "Vegan", icon: Leaf },
    { id: "pescatarian", label: "Pescatarian", icon: Fish },
    { id: "keto", label: "Keto", icon: Target },
    { id: "paleo", label: "Paleo", icon: ChefHat },
    { id: "gluten-free", label: "Gluten-Free", icon: Wheat },
    { id: "none", label: "No Restrictions", icon: Heart }
  ];

  const goalOptions = [
    "Weight Loss",
    "Muscle Gain", 
    "Balanced Nutrition",
    "Energy Boost",
    "Better Digestion",
    "Heart Health"
  ];

  const toggleSelection = (value: string, field: 'dietType' | 'goals') => {
    setPreferences(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(preferences);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return preferences.name.trim() !== "";
      case 2: return preferences.dietType.length > 0;
      case 3: return true; // Optional fields
      case 4: return preferences.goals.length > 0;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-warm border-0">
        <CardHeader className="text-center pb-4">
          <div className="space-y-2">
            <Progress value={progress} className="w-full h-2" />
            <p className="text-sm text-muted-foreground">Step {step} of {totalSteps}</p>
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Let's get to know you! 💖
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">What should we call you?</h3>
                <p className="text-muted-foreground">Your personal meal planning journey starts here!</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your beautiful name..."
                  value={preferences.name}
                  onChange={(e) => setPreferences(prev => ({ ...prev, name: e.target.value }))}
                  className="text-lg py-3"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">What's your dietary style? 🥗</h3>
                <p className="text-muted-foreground">Select all that apply - we'll craft meals just for you!</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {dietOptions.map((diet) => {
                  const Icon = diet.icon;
                  const isSelected = preferences.dietType.includes(diet.id);
                  return (
                    <Button
                      key={diet.id}
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => toggleSelection(diet.id, 'dietType')}
                      className="h-auto p-4 flex flex-col items-center space-y-2"
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-sm">{diet.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">Tell us more about your tastes 😋</h3>
                <p className="text-muted-foreground">Help us personalize your perfect meals</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="allergies">Any allergies or foods to avoid?</Label>
                  <Input
                    id="allergies"
                    placeholder="e.g., nuts, dairy, shellfish..."
                    value={preferences.allergies}
                    onChange={(e) => setPreferences(prev => ({ ...prev, allergies: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favorites">What are your favorite foods?</Label>
                  <Textarea
                    id="favorites"
                    placeholder="Tell us what makes you happy! e.g., pasta, chocolate, fresh berries..."
                    value={preferences.favoritefoods}
                    onChange={(e) => setPreferences(prev => ({ ...prev, favoritefoods: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dislikes">Anything you'd prefer to avoid?</Label>
                  <Input
                    id="dislikes"
                    placeholder="e.g., spicy food, mushrooms..."
                    value={preferences.dislikes}
                    onChange={(e) => setPreferences(prev => ({ ...prev, dislikes: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">What are your wellness goals? 🎯</h3>
                <p className="text-muted-foreground">We'll help you achieve them, one delicious meal at a time!</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {goalOptions.map((goal) => {
                  const isSelected = preferences.goals.includes(goal);
                  return (
                    <Badge
                      key={goal}
                      variant={isSelected ? "default" : "outline"}
                      className="p-3 cursor-pointer justify-center transition-all duration-200 hover:scale-105"
                      onClick={() => toggleSelection(goal, 'goals')}
                    >
                      {goal}
                    </Badge>
                  );
                })}
              </div>
              <div className="space-y-2">
                <Label htmlFor="calories">Daily calorie target (optional)</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="e.g., 2000"
                  value={preferences.calorieTarget}
                  onChange={(e) => setPreferences(prev => ({ ...prev, calorieTarget: e.target.value }))}
                />
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <Button 
              variant="hero" 
              onClick={handleNext}
              disabled={!canProceed()}
              className="ml-auto"
            >
              {step === totalSteps ? "Complete Setup ✨" : "Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};