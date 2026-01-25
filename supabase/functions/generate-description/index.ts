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
    const { 
      category, 
      title, 
      registrationNumber, 
      currentDescription,
      isDemo = false,
      documentInfo = null,
      ownerInfo = null
    } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const categoryLabels: Record<string, string> = {
      technological_packages: "технологический пакет",
      ai_models: "модель ИИ / алгоритм",
      software_and_code: "программное обеспечение, IT-продукт",
      datasets: "датасет / выборка данных",
      patents: "патент (изобретение, полезная модель)",
      databases: "база данных",
      know_how: "ноу-хау / секрет производства",
      technical_specifications: "техническая спецификация",
      trademarks: "товарный знак",
      copyrights: "объект авторского права",
      digital_twins: "цифровой двойник",
      rnd_prototypes: "прототип / R&D разработка",
      // Legacy category mappings
      industrial: "промышленный образец",
      software: "программное обеспечение, IT-продукт",
      knowhow: "ноу-хау / секрет производства",
      specifications: "технические спецификации",
      commercial: "коммерческое обозначение",
      educational: "обучающие материалы",
      methods: "методики и технологии",
      prototypes: "прототипы и R&D разработки",
    };

    const categoryName = categoryLabels[category] || category;

    const systemPrompt = `Ты — юридико-технологический редактор платформы интеллектуальной собственности.

ПРАВИЛА ГЕНЕРАЦИИ:

1. Описание строится ТОЛЬКО на основе предоставленных данных.
2. Если данных недостаточно — явно указать, что именно отсутствует.
3. Использовать нейтральный, юридически корректный язык.
4. Минимальный объём описания: 1800-2500 знаков.

ЗАПРЕЩЕНО:
- Использовать Markdown, звёздочки, символы списков (-, *, •)
- Рекламные формулировки и обещания выгоды
- Домыслы и предположения, не основанные на документах
- Преувеличения и оценочные суждения

ОБЯЗАТЕЛЬНО указать:
- Правовой статус объекта
- Область применения
- Ограничения (при наличии)

СТРУКТУРА ВЫВОДА (строго в этом порядке, каждый раздел с новой строки):

1. ОБЩЕЕ ОПИСАНИЕ ОБЪЕКТА
Краткая характеристика объекта ИС, его назначение и функциональные особенности.

2. ЮРИДИЧЕСКОЕ ОСНОВАНИЕ И СТАТУС ПРАВ
Сведения о регистрации, правообладателе, основаниях возникновения прав.

3. СОСТАВ И СОДЕРЖАНИЕ ОБЪЕКТА
Структура объекта, основные компоненты, технические характеристики.

4. ОБЛАСТЬ ПРИМЕНЕНИЯ
Отрасли, сценарии использования, целевая аудитория.

5. ОГРАНИЧЕНИЯ И ТЕКУЩИЙ СТАТУС
Территориальные ограничения, срок действия, условия использования, текущий правовой статус.

Формат: связный текст без заголовков-разделителей. Разделы должны плавно переходить друг в друга.`;

    let userPrompt = "";

    if (isDemo) {
      userPrompt = `Создай ознакомительное описание для демонстрационного объекта интеллектуальной собственности:

Тип объекта: ${categoryName}
Название: ${title || "Не указано"}
Рег. номер: ${registrationNumber || "Не указан"}
Статус: ОЗНАКОМИТЕЛЬНЫЙ (демонстрационная карточка)

ВАЖНО: Объект предназначен для демонстрации структуры каталога и формата представления информации. Не является офертой и не предназначен для заключения сделки.

В конце описания ОБЯЗАТЕЛЬНО добавь абзац: "Настоящая карточка носит ознакомительный характер и предназначена для демонстрации структуры и формата каталога интеллектуальной собственности. Не является офертой, публичным предложением или приглашением к заключению сделки. Представленная информация не отражает фактическую регистрацию прав на объект интеллектуальной собственности."`;
    } else if (currentDescription) {
      userPrompt = `Улучши и дополни следующее описание для объекта интеллектуальной собственности:

Тип объекта: ${categoryName}
Название: ${title || "Не указано"}
Рег. номер: ${registrationNumber || "Не указан"}
${documentInfo ? `Сведения из документов: ${documentInfo}` : "Документы: не предоставлены"}
${ownerInfo ? `Сведения о правообладателе: ${ownerInfo}` : ""}

Текущее описание:
${currentDescription}

Сохрани суть, но расширь описание до требуемого объёма (1800-2500 знаков), структурируй согласно требованиям и обеспечь юридическую корректность формулировок.`;
    } else {
      userPrompt = `Создай профессиональное описание для объекта интеллектуальной собственности:

Тип объекта: ${categoryName}
Название: ${title || "Не указано"}
Рег. номер: ${registrationNumber || "Не указан"}
${documentInfo ? `Сведения из документов: ${documentInfo}` : "Документы: не предоставлены. Укажи это в описании."}
${ownerInfo ? `Сведения о правообладателе: ${ownerInfo}` : "Сведения о правообладателе: не предоставлены."}

Создай структурированное описание согласно требованиям. Если данных недостаточно для какого-либо раздела, явно укажи, какая информация отсутствует и может быть предоставлена дополнительно.`;
    }

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
        max_tokens: 2000,
        temperature: 0.5,
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
    let generatedDescription = data.choices?.[0]?.message?.content;

    if (!generatedDescription) {
      throw new Error("No content in AI response");
    }

    // Clean up any markdown that might have slipped through
    generatedDescription = generatedDescription
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/^#+\s*/gm, "")
      .replace(/^[-•]\s*/gm, "")
      .replace(/^\d+\.\s+/gm, "")
      .trim();

    return new Response(
      JSON.stringify({ description: generatedDescription }),
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
