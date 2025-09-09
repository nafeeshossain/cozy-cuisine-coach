import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Utensils, Target, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-meal-planning.jpg";

interface WelcomeHeroProps {
  onStartPlanning: () => void;
}

export const WelcomeHero = ({ onStartPlanning }: WelcomeHeroProps) => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Text Content */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Heart className="w-6 h-6 fill-current" />
              <span className="text-sm font-medium uppercase tracking-wider">Your Personal Nutrition Friend</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Eat Well,{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Feel Amazing
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Your caring companion for personalized meal planning. We'll help you nourish your body beautifully 
              with meals that match your lifestyle, preferences, and goals. 💕
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="border-none shadow-gentle">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Personal Goals</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-gentle">
              <CardContent className="p-4 text-center">
                <Utensils className="w-8 h-8 mx-auto mb-2 text-accent" />
                <p className="text-sm font-medium">Smart Planning</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-gentle">
              <CardContent className="p-4 text-center">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-success" />
                <p className="text-sm font-medium">Joyful Journey</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={onStartPlanning}
              className="text-lg px-8 py-6"
            >
              Start Your Journey 🌟
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={onStartPlanning}
              className="text-lg px-8 py-6"
            >
              Sign In
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            ✨ Join thousands who've transformed their relationship with food
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl transform scale-110"></div>
          <img 
            src={heroImage}
            alt="Healthy meal planning with fresh ingredients"
            className="relative rounded-3xl shadow-warm w-full h-auto"
          />
          <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-4 shadow-warm">
            <Heart className="w-8 h-8 text-primary fill-current" />
          </div>
        </div>
      </div>
    </section>
  );
};