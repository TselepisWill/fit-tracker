const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const z = require('zod'); // We'll validate the result using Zod (npm i zod)

// Schema to validate AI response
const NutritionSchema = z.object({
  calories: z.number().min(0),
  protein_g: z.number().min(0),
  carbs_g: z.number().min(0),
  fats_g: z.number().min(0),
  serving_size: z.string().min(1)
});

exports.analyzeMeal = async (description, quantity, unit) => {
  const formattedQuantity = quantity ? `\nQuantity: ${quantity} ${unit || ''}` : '';
  
  const prompt = `
Estimate the nutritional content for the following food:

Food: "${description}"${formattedQuantity}

Respond ONLY with a pure JSON object with these fields:
{
  "calories": number,
  "protein_g": number,
  "carbs_g": number,
  "fats_g": number,
  "serving_size": string
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a certified nutritionist. Always respond with only valid JSON containing the requested nutrition info."
      },
      {
        role: "user",
        content: prompt.trim()
      }
    ],
    temperature: 0.2,
    max_tokens: 200
  });

  const rawContent = response.choices?.[0]?.message?.content;
  if (!rawContent) throw new Error("No content returned from OpenAI");

  let parsed;
  try {
    // Clean up common issues like extra text or markdown
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON detected in AI response.");

    parsed = JSON.parse(jsonMatch[0]);

    // Validate using Zod
    const validated = NutritionSchema.parse(parsed);

    return validated;
  } catch (err) {
    console.error("OpenAI parsing or validation error:", err);
    throw new Error("Invalid nutrition data returned from AI");
  }
};
