import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { preferences } = await req.json();
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    console.log('Generating meal plan for preferences:', preferences);

    const prompt = `Generate a personalized 7-day meal plan for a person with these preferences:
    - Name: ${preferences.name}
    - Diet Type: ${preferences.dietType?.join(', ') || 'No restrictions'}
    - Goals: ${preferences.goals?.join(', ') || 'General health'}
    - Allergies: ${preferences.allergies || 'None'}
    - Favorite Foods: ${preferences.favoritefoods || 'No specific preferences'}
    - Dislikes: ${preferences.dislikes || 'None'}
    - Calorie Target: ${preferences.calorieTarget || 'Not specified'}

    Please create a detailed meal plan with:
    - 7 days (Monday to Sunday)
    - Breakfast, Lunch, and Dinner for each day
    - Estimated calories for each meal
    - Preparation time for each meal
    - A rating (4.0-5.0) for each meal

    Return the response as a JSON object with this exact structure:
    {
      "weeklyPlan": {
        "Monday": {
          "breakfast": { "name": "...", "calories": 350, "prepTime": "15 min", "rating": 4.8 },
          "lunch": { "name": "...", "calories": 500, "prepTime": "25 min", "rating": 4.6 },
          "dinner": { "name": "...", "calories": 650, "prepTime": "35 min", "rating": 4.9 }
        },
        // ... repeat for all 7 days
      }
    }

    Make sure each meal fits the dietary restrictions and preferences. Be creative and provide variety throughout the week.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
      }),
    });

    const data = await response.json();
    console.log('Gemini API response:', data);

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('Generated text:', generatedText);

    // Parse the JSON response
    let mealPlan;
    try {
      // Clean the response text to extract JSON
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        mealPlan = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      // Fallback meal plan if parsing fails
      mealPlan = generateFallbackMealPlan(preferences);
    }

    return new Response(JSON.stringify({ mealPlan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-meal-plan function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      mealPlan: generateFallbackMealPlan({}) 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateFallbackMealPlan(preferences: any) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const weeklyPlan: any = {};

  days.forEach(day => {
    weeklyPlan[day] = {
      breakfast: {
        name: `Healthy ${day} Breakfast`,
        calories: 350,
        prepTime: "15 min",
        rating: 4.5
      },
      lunch: {
        name: `Nutritious ${day} Lunch`,
        calories: 500,
        prepTime: "25 min",
        rating: 4.3
      },
      dinner: {
        name: `Delicious ${day} Dinner`,
        calories: 650,
        prepTime: "35 min",
        rating: 4.7
      }
    };
  });

  return { weeklyPlan };
}