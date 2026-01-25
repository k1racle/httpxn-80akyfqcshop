import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// MASTER FRAMEWORK v2.1: Legal-Technological Mode / No Hallucinations / Strict Order
// Key rule: Variant B = status + reason + action. Not description. Not analysis.

interface GenerationRequest {
  category: string;
  title: string;
  registrationNumber: string;
  currentDescription: string;
  isDemo: boolean;
  documentInfo: string | null;
  ownerInfo: string | null;
  hasRegistrationCertificate: boolean;
  hasRegistryExtract: boolean;
  hasPowerOfAttorney: boolean;
  hasFullDocumentation: boolean;
  hasIPImage: boolean;
  mktuClasses: string | null;
  functionalDescription: string | null;
}

// Check data sufficiency: at least 3 of 5 conditions must be met
function checkDataSufficiency(data: GenerationRequest): { sufficient: boolean; score: number } {
  let score = 0;

  // Condition 1: Object name is specified
  if (data.title && data.title.trim().length > 0) {
    score++;
  }

  // Condition 2: Registration number OR document attached
  if (
    (data.registrationNumber && data.registrationNumber.trim().length > 0) ||
    data.hasRegistrationCertificate ||
    data.hasRegistryExtract
  ) {
    score++;
  }

  // Condition 3: At least one legal document uploaded
  if (data.hasRegistrationCertificate || data.hasRegistryExtract || data.hasPowerOfAttorney || data.hasIPImage) {
    score++;
  }

  // Condition 4: Object type is defined
  if (data.category && data.category.trim().length > 0) {
    score++;
  }

  // Condition 5: Composition or MKTU classes or functional description defined
  if (
    (data.mktuClasses && data.mktuClasses.trim().length > 0) ||
    (data.functionalDescription && data.functionalDescription.trim().length > 0) ||
    (data.currentDescription && data.currentDescription.trim().length > 50)
  ) {
    score++;
  }

  return {
    sufficient: score >= 3,
    score
  };
}

// VARIANT B: Insufficient data - FIXED SHORT TEMPLATE (max 500 chars)
// NO explanations, NO listing missing docs, NO 5-section structure
const INSUFFICIENT_DATA_RESPONSE = `Полное описание объекта интеллектуальной собственности не сформировано.

Причина: недостаточность исходных данных и отсутствие подтверждающих документов.

Для генерации описания требуется предоставить регистрационные сведения и правоустанавливающие материалы.

До получения данных объект имеет ознакомительный статус.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: Partial<GenerationRequest> = await req.json();
    
    const data: GenerationRequest = {
      category: requestData.category || "",
      title: requestData.title || "",
      registrationNumber: requestData.registrationNumber || "",
      currentDescription: requestData.currentDescription || "",
      isDemo: requestData.isDemo || false,
      documentInfo: requestData.documentInfo || null,
      ownerInfo: requestData.ownerInfo || null,
      hasRegistrationCertificate: requestData.hasRegistrationCertificate || false,
      hasRegistryExtract: requestData.hasRegistryExtract || false,
      hasPowerOfAttorney: requestData.hasPowerOfAttorney || false,
      hasFullDocumentation: requestData.hasFullDocumentation || false,
      hasIPImage: requestData.hasIPImage || false,
      mktuClasses: requestData.mktuClasses || null,
      functionalDescription: requestData.functionalDescription || null,
    };
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // STEP 1: Check data sufficiency (MANDATORY BRANCHING)
    const sufficiencyCheck = checkDataSufficiency(data);

    // VARIANT B: Insufficient data → BLOCKED_SHORT mode
    // Return fixed template IMMEDIATELY, no AI call, no analysis
    if (!sufficiencyCheck.sufficient && !data.isDemo) {
      console.log(`[BLOCKED_SHORT] Data sufficiency: ${sufficiencyCheck.score}/5`);
      return new Response(
        JSON.stringify({ 
          description: INSUFFICIENT_DATA_RESPONSE,
          generation_mode: "blocked_short",
          max_chars: 500,
          insufficientData: true,
          score: sufficiencyCheck.score,
          status_reason: "insufficient_data"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // VARIANT A: Sufficient data → FULL GENERATION
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
      industrial: "промышленный образец",
      software: "программное обеспечение, IT-продукт",
      knowhow: "ноу-хау / секрет производства",
      specifications: "технические спецификации",
      commercial: "коммерческое обозначение",
      educational: "обучающие материалы",
      methods: "методики и технологии",
      prototypes: "прототипы и R&D разработки",
    };

    const categoryName = categoryLabels[data.category] || data.category || "не определён";

    // Build available data summary for AI
    const availableData: string[] = [];
    if (data.title) availableData.push(`Наименование: ${data.title}`);
    if (data.registrationNumber) availableData.push(`Рег. номер: ${data.registrationNumber}`);
    if (data.hasRegistrationCertificate) availableData.push("Свидетельство о регистрации: загружено");
    if (data.hasRegistryExtract) availableData.push("Выписка из реестра: загружена");
    if (data.hasPowerOfAttorney) availableData.push("Документ о полномочиях: загружен");
    if (data.hasFullDocumentation) availableData.push("Полная документация: загружена");
    if (data.hasIPImage) availableData.push("Изображение объекта: загружено");
    if (data.mktuClasses) availableData.push(`Классы МКТУ: ${data.mktuClasses}`);
    if (data.documentInfo) availableData.push(`Из документов: ${data.documentInfo}`);
    if (data.ownerInfo) availableData.push(`Правообладатель: ${data.ownerInfo}`);

    // MASTER FRAMEWORK v2.1 SYSTEM PROMPT
    const systemPrompt = `РОЛЬ: Системный юридико-технологический редактор каталога ИС.
НЕ автор, НЕ маркетолог, НЕ аналитик.

КЛЮЧЕВОЙ ПРИНЦИП: НЕТ ДАННЫХ → НЕТ УТВЕРЖДЕНИЯ

РАЗРЕШЕНО ИСПОЛЬЗОВАТЬ ТОЛЬКО:
- Заполненные поля формы
- Загруженные документы
- Текст от пользователя

КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО:
- Расширять смысл, делать выводы "по аналогии"
- Дополнять отсутствующие фрагменты
- Додумывать свойства, функции, преимущества
- Использовать маркетинговые формулировки
- Использовать markdown, списки, caps-заголовки
- Писать больше, чем позволяют данные
- ПЕРЕЧИСЛЯТЬ отсутствующие документы (это "описание отсутствия")

СТРУКТУРА (сплошным текстом, без заголовков):
1. Общее описание объекта
2. Юридическое основание и статус прав
3. Состав и содержание объекта
4. Область применения
5. Ограничения и условия

ОБЪЁМ: 1800-2500 знаков.

КОНТРОЛЬ: Каждое утверждение = источник в данных.`;

    let userPrompt = "";

    if (data.isDemo) {
      userPrompt = `Создай описание для ОЗНАКОМИТЕЛЬНОЙ карточки.

ТИП: ${categoryName}
СТАТУС: ОЗНАКОМИТЕЛЬНЫЙ

ТРЕБОВАНИЯ:
1. Начать с: "Карточка носит ознакомительный характер и предназначена для демонстрации структуры каталога."
2. Типовое описание категории без конкретных утверждений.
3. Завершить: "Не является предложением о заключении сделки."`;
    } else {
      userPrompt = `Создай описание объекта ИС.

ТИП: ${categoryName}

ИМЕЮЩИЕСЯ ДАННЫЕ:
${availableData.join("\n")}

${data.currentDescription ? `ТЕКСТ ПОЛЬЗОВАТЕЛЯ:\n${data.currentDescription}` : ""}
${data.functionalDescription ? `ФУНКЦИОНАЛ:\n${data.functionalDescription}` : ""}

ПРАВИЛО: Используй ТОЛЬКО данные выше. Нет источника = нет утверждения.`;
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
        max_tokens: 2500,
        temperature: 0.2,
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

    const responseData = await response.json();
    let generatedDescription = responseData.choices?.[0]?.message?.content;

    if (!generatedDescription) {
      throw new Error("No content in AI response");
    }

    // Clean up formatting
    generatedDescription = generatedDescription
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/__/g, "")
      .replace(/^#+\s*/gm, "")
      .replace(/^[-•]\s*/gm, "")
      .replace(/^\d+\.\s+/gm, "")
      .replace(/^[А-ЯЁA-Z\s]{10,}$/gm, (match: string) => {
        return match.charAt(0) + match.slice(1).toLowerCase();
      })
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return new Response(
      JSON.stringify({ 
        description: generatedDescription,
        generation_mode: "full",
        insufficientData: false,
        score: sufficiencyCheck.score,
        status_reason: "generated"
      }),
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
