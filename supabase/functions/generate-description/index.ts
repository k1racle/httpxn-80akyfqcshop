import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, title, registrationNumber, currentDescription } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const categoryLabels: Record<string, string> = {
      trademarks: "товарный знак",
      patents: "патент (изобретение, полезная модель)",
      industrial: "промышленный образец",
      software: "программное обеспечение, IT-продукт",
      copyrights: "авторское право (текст, дизайн, фото)",
      databases: "база данных",
      knowhow: "ноу-хау / коммерческая тайна",
      specifications: "технические спецификации",
      commercial: "коммерческое обозначение",
      educational: "обучающие материалы",
      methods: "методики и технологии",
      prototypes: "прототипы и R&D разработки",
    };

    const categoryName = categoryLabels[category] || category;

    const systemPrompt = `Ты — эксперт по интеллектуальной собственности и копирайтер. Твоя задача — создавать профессиональные, убедительные описания объектов интеллектуальной собственности для размещения на маркетплейсе.

Требования к описанию:
- Длина: 150-300 слов
- Тон: профессиональный, деловой, убедительный
- Структура: назначение, ключевые особенности, преимущества, потенциал применения
- Формат: связный текст без заголовков и списков
- Язык: русский

Не используй:
- Маркетинговый "хайп" и преувеличения
- Фразы вроде "уникальный", "лучший", "революционный" без обоснования
- Технический жаргон без пояснений`;

    const userPrompt = currentDescription 
      ? `Улучши и дополни следующее описание для объекта интеллектуальной собственности:

Тип объекта: ${categoryName}
Название: ${title || "Не указано"}
Рег. номер: ${registrationNumber || "Не указан"}

Текущее описание:
${currentDescription}

Сохрани суть, но сделай описание более профессиональным, структурированным и привлекательным для потенциальных покупателей.`
      : `Создай профессиональное описание для объекта интеллектуальной собственности:

Тип объекта: ${categoryName}
Название: ${title || "Не указано"}
Рег. номер: ${registrationNumber || "Не указан"}

Напиши убедительное описание, которое раскроет ценность объекта для потенциальных покупателей. Учти специфику типа ИС.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Слишком много запросов. Попробуйте позже." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Превышен лимит использования AI." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Ошибка генерации описания" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const generatedDescription = data.choices?.[0]?.message?.content;

    if (!generatedDescription) {
      throw new Error("No content in AI response");
    }

    return new Response(
      JSON.stringify({ description: generatedDescription.trim() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("generate-description error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});