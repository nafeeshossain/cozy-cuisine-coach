import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, Utensils, Heart, Star, Award, Sparkles } from "lucide-react";

interface UserPreferences {
  name: string;
  dietType: string[];
  goals: string[];
}

interface MealPlanDashboardProps {
  preferences: UserPreferences;
}

export const MealPlanDashboard = ({ preferences }: MealPlanDashboardProps) => {
  const weeklyMeals = [
    {
      day: "Monday",
      breakfast: { name: "Berry Smoothie Bowl", calories: 320, time: "10 min", rating: 4.8 },
      lunch: { name: "Mediterranean Quinoa Salad", calories: 450, time: "15 min", rating: 4.9 },
      dinner: { name: "Herb-Crusted Salmon", calories: 520, time: "25 min", rating: 4.7 }
    },
    {
      day: "Tuesday", 
      breakfast: { name: "Avocado Toast with Poached Egg", calories: 380, time: "12 min", rating: 4.6 },
      lunch: { name: "Thai Coconut Soup", calories: 420, time: "20 min", rating: 4.8 },
      dinner: { name: "Stuffed Bell Peppers", calories: 480, time: "35 min", rating: 4.5 }
    },
    {
      day: "Wednesday",
      breakfast: { name: "Overnight Oats with Berries", calories: 290, time: "5 min", rating: 4.7 },
      lunch: { name: "Chickpea Buddha Bowl", calories: 510, time: "18 min", rating: 4.9 },
      dinner: { name: "Lemon Garlic Chicken", calories: 550, time: "30 min", rating: 4.8 }
    }
  ];

  const achievements = [
    { title: "Healthy Hero", description: "3 days of nutritious meals!", icon: Heart },
    { title: "Balanced Boss", description: "Great protein-carb balance!", icon: Award },
    { title: "Variety Star", description: "Trying new cuisines!", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/5 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">
            Welcome back, {preferences.name}! 🌟
          </h1>
          <p className="text-lg text-muted-foreground">
            You're doing amazing! Here's your personalized meal plan for this week.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {preferences.dietType.map(diet => (
              <Badge key={diet} variant="outline" className="bg-primary/10">
                {diet.charAt(0).toUpperCase() + diet.slice(1)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Progress & Achievements */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="shadow-gentle border-0">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Weekly Progress</span>
                  <span className="text-2xl">💪</span>
                </div>
                <Progress value={75} className="h-3" />
                <p className="text-sm text-muted-foreground">3 of 4 goals on track!</p>
              </div>
            </CardContent>
          </Card>

          {achievements.slice(0, 2).map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <Card key={index} className="shadow-gentle border-0 bg-gradient-to-br from-accent/20 to-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/20 rounded-full">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Weekly Meal Plan */}
        <Card className="shadow-warm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="w-6 h-6 text-primary" />
              Your Personalized Meal Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {weeklyMeals.map((day, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">
                    {day.day}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { type: "Breakfast", meal: day.breakfast, color: "from-accent/20 to-accent/5" },
                      { type: "Lunch", meal: day.lunch, color: "from-primary/20 to-primary/5" },
                      { type: "Dinner", meal: day.dinner, color: "from-success/20 to-success/5" }
                    ].map((mealSlot, mealIndex) => (
                      <Card key={mealIndex} className={`border-0 bg-gradient-to-br ${mealSlot.color} hover:shadow-gentle transition-all duration-300 cursor-pointer group`}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                {mealSlot.type}
                              </span>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-warning text-warning" />
                                <span className="text-xs">{mealSlot.meal.rating}</span>
                              </div>
                            </div>
                            <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                              {mealSlot.meal.name}
                            </h4>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {mealSlot.meal.time}
                              </div>
                              <span>{mealSlot.meal.calories} cal</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="lg" className="gap-2">
            <Sparkles className="w-5 h-5" />
            Generate New Plan
          </Button>
          <Button variant="warm" size="lg" className="gap-2">
            <Users className="w-5 h-5" />
            Shopping List
          </Button>
          <Button variant="outline" size="lg">
            View Recipes
          </Button>
        </div>

        {/* Encouraging Message */}
        <Card className="border-0 bg-gradient-to-r from-primary/10 to-accent/10 shadow-gentle">
          <CardContent className="p-6 text-center">
            <p className="text-lg font-medium text-foreground">
              "You're nourishing yourself beautifully! 💕"
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Keep up the wonderful work - your body will thank you!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};