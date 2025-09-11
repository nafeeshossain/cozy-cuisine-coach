import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { UserPreferences } from './useProfile';

interface MealPlan {
  weeklyPlan: {
    [day: string]: {
      breakfast: {
        name: string;
        calories: number;
        prepTime: string;
        rating: number;
      };
      lunch: {
        name: string;
        calories: number;
        prepTime: string;
        rating: number;
      };
      dinner: {
        name: string;
        calories: number;
        prepTime: string;
        rating: number;
      };
    };
  };
}

export const useMealPlan = () => {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateMealPlan = async (preferences: UserPreferences) => {
    setIsLoading(true);
    try {
      console.log('Generating meal plan with preferences:', preferences);
      
      const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
        body: { preferences }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Meal plan response:', data);
      
      if (data.mealPlan) {
        setMealPlan(data.mealPlan);
        toast({
          title: "Meal plan generated! 🍽️",
          description: "Your personalized weekly meal plan is ready!",
        });
      } else {
        throw new Error('No meal plan data received');
      }
    } catch (error) {
      console.error('Error generating meal plan:', error);
      toast({
        title: "Error generating meal plan",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mealPlan,
    isLoading,
    generateMealPlan,
  };
};