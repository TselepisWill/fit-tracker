const OpenAI = require('openai');
const openai = new OpenAI(process.env.OPENAI_API_KEY);

exports.analyzeMeal = async (description, quantity, unit) => {
  const prompt = `
    Estimate the nutritional content for: ${description}
    ${quantity ? `Quantity: ${quantity} ${unit || ''}` : ''}
    
    Respond with ONLY a JSON object containing:
    - calories (number)
    - protein_g (number, protein in grams)
    - carbs_g (number, carbohydrates in grams)
    - fats_g (number, fats in grams)
    - serving_size (string, description of serving size analyzed)
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { 
        role: "system", 
        content: "You are a nutrition expert that provides accurate estimates of food nutritional content. Only respond with the requested JSON format." 
      },
      { role: "user", content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 200
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from AI');

  return JSON.parse(content);
};
