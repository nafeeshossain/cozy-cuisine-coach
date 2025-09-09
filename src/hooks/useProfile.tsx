import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserProfile {
  id: string;
  user_id: string;
  name: string | null;
  diet_types: string[] | null;
  allergies: string | null;
  favorite_foods: string | null;
  dislikes: string | null;
  goals: string[] | null;
  calorie_target: number | null;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  name: string;
  dietType: string[];
  allergies: string;
  favoritefoods: string;
  dislikes: string;
  goals: string[];
  calorieTarget: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (preferences: UserPreferences) => {
      if (!user) throw new Error('No user');

      const profileData = {
        user_id: user.id,
        name: preferences.name,
        diet_types: preferences.dietType,
        allergies: preferences.allergies || null,
        favorite_foods: preferences.favoritefoods || null,
        dislikes: preferences.dislikes || null,
        goals: preferences.goals,
        calorie_target: preferences.calorieTarget ? parseInt(preferences.calorieTarget) : null,
      };

      const { data, error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
  };
};