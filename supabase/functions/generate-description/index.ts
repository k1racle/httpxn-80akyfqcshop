import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// MASTER FRAMEWORK: Legal-Technological Mode / No Hallucinations / Strict Order
// This framework is permanently applied to all description generations

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
function checkDataSufficiency(data: GenerationRequest): { sufficient: boolean; score: number; conditions: string[] } {
  const conditions: string[] = [];
  let score = 0;

  // Condition 1: Object name is specified
  if (data.title && data.title.trim().length > 0) {
    score++;
    conditions.push("наименование объекта");
  }

  // Condition 2: Registration number OR document attached
  if (
    (data.registrationNumber && data.registrationNumber.trim().length > 0) ||
    data.hasRegistrationCertificate ||
    data.hasRegistryExtract
  ) {
    score++;
    conditions.push("регистрационные сведения или документ");
  }

  // Condition 3: At least one legal document uploaded
  if (data.hasRegistrationCertificate || data.hasRegistryExtract || data.hasPowerOfAttorney || data.hasIPImage) {
    score++;
    conditions.push("правоустанавливающий документ");
  }

  // Condition 4: Object type is defined
  if (data.category && data.category.trim().length > 0) {
    score++;
    conditions.push("тип объекта ИС");
  }

  // Condition 5: Composition or MKTU classes or functional description defined
  if (
    (data.mktuClasses && data.mktuClasses.trim().length > 0) ||
    (data.functionalDescription && data.functionalDescription.trim().length > 0) ||
    (data.currentDescription && data.currentDescription.trim().length > 50)
  ) {
    score++;
    conditions.push("состав или функциональное описание");
  }

  return {
    sufficient: score >= 3,
    score,
    conditions
  };
}

// Insufficient data response - FIXED TEXT, NO VARIATIONS
const INSUFFICIENT_DATA_RESPONSE = `Генерация полного описания объекта интеллектуальной собственности невозможна в связи с недостаточностью исходных данных.

Для формирования корректного юридико-технологического описания требуется дополнительная информация и/или подтверждающие документы.

Пожалуйста, добавьте наименование объекта, регистрационные сведения и правоустанавливающие материалы.`;

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

    // VARIANT B: Insufficient data → REFUSE GENERATION
    if (!sufficiencyCheck.sufficient && !data.isDemo) {
      console.log(`Data sufficiency check failed: ${sufficiencyCheck.score}/5 conditions met`);
      return new Response(
        JSON.stringify({ 
          description: INSUFFICIENT_DATA_RESPONSE,
          insufficientData: true,
          score: sufficiencyCheck.score,
          metConditions: sufficiencyCheck.conditions
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

    // Build available data summary
    const availableData: string[] = [];
    if (data.title) availableData.push(`Наименование: ${data.title}`);
    if (data.registrationNumber) availableData.push(`Рег. номер: ${data.registrationNumber}`);
    if (data.hasRegistrationCertificate) availableData.push("Загружено: свидетельство о регистрации");
    if (data.hasRegistryExtract) availableData.push("Загружено: выписка из реестра");
    if (data.hasPowerOfAttorney) availableData.push("Загружено: документ о полномочиях");
    if (data.hasFullDocumentation) availableData.push("Загружено: полная документация");
    if (data.hasIPImage) availableData.push("Загружено: изображение объекта ИС");
    if (data.mktuClasses) availableData.push(`Классы МКТУ: ${data.mktuClasses}`);
    if (data.documentInfo) availableData.push(`Сведения из документов: ${data.documentInfo}`);
    if (data.ownerInfo) availableData.push(`Правообладатель: ${data.ownerInfo}`);

    const dataFromDocuments = data.documentInfo || data.currentDescription;
    const isDocumentBasedGeneration = dataFromDocuments && !data.title && !data.registrationNumber;

    // MASTER FRAMEWORK SYSTEM PROMPT
    const systemPrompt = `РОЛЬ: Ты — системный юридико-технологический редактор каталога ИС.
Ты НЕ автор, НЕ маркетолог, НЕ аналитик.
Ты формируешь текст ТОЛЬКО при наличии достаточных оснований.

КЛЮЧЕВОЙ ПРИНЦИП: НЕТ ДАННЫХ → НЕТ ГЕНЕРАЦИИ

РАЗРЕШЕНО ИСПОЛЬЗОВАТЬ ТОЛЬКО:
1. Заполненные поля формы
2. Загруженные документы
3. Текст описания, введённый пользователем

КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО:
- Расширять смысл
- Делать выводы "по аналогии"
- Дополнять отсутствующие фрагменты
- Додумывать свойства, функции, преимущества
- Использовать маркетинговые формулировки
- Использовать markdown, списки, caps-заголовки
- Писать больше, чем позволяют данные

СТРУКТУРА ОПИСАНИЯ (фиксированная, сплошным текстом без заголовков):

1. Общее описание объекта — тип, назначение строго по данным
2. Юридическое основание и статус прав — только подтверждённые сведения
3. Состав и содержание объекта — только из документов
4. Область применения — ТОЛЬКО если прямо указано в данных
5. Ограничения и условия — территория, сроки, риски

ОБЪЁМ: 1800-2500 знаков (если данных достаточно).

${isDocumentBasedGeneration ? 'ОБЯЗАТЕЛЬНО указать в начале: "Описание сформировано на основании загруженных материалов. Часть сведений может отсутствовать."' : ''}

КОНТРОЛЬ ПЕРЕД ВЫВОДОМ:
Задай себе вопрос: "Каждое ли утверждение можно показать юристу с указанием источника?"
Если нет → удалить утверждение.

ФОРМУЛА: Нет источника → нет утверждения.`;

    let userPrompt = "";

    if (data.isDemo) {
      userPrompt = `Создай описание для ОЗНАКОМИТЕЛЬНОЙ карточки.

ТИП ОБЪЕКТА: ${categoryName}
СТАТУС: ОЗНАКОМИТЕЛЬНЫЙ (демо-карточка для демонстрации структуры каталога)

ТРЕБОВАНИЯ:
1. Явно указать: "Карточка носит ознакомительный характер, предназначена для демонстрации структуры каталога и не является предложением о заключении сделки."
2. Типовое описание для категории без конкретных утверждений о свойствах.
3. В конце: "Представленная информация носит справочный характер и не отражает фактическую регистрацию прав."`;
    } else {
      userPrompt = `Создай описание объекта ИС на основании ТОЛЬКО следующих данных:

ТИП ОБЪЕКТА: ${categoryName}

ДОСТУПНЫЕ ДАННЫЕ:
${availableData.length > 0 ? availableData.join("\n") : "Минимальный набор данных"}

${data.currentDescription ? `ТЕКСТ ОТ ПОЛЬЗОВАТЕЛЯ:\n${data.currentDescription}` : ""}
${data.functionalDescription ? `ФУНКЦИОНАЛЬНОЕ ОПИСАНИЕ:\n${data.functionalDescription}` : ""}

КРИТИЧЕСКИ ВАЖНО:
- Используй ТОЛЬКО предоставленные данные
- Если данных для раздела нет — укажи "сведения отсутствуют"
- НЕ додумывай, НЕ расширяй, НЕ обобщай
- Каждое утверждение должно иметь источник в данных выше`;
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
        temperature: 0.2, // Very low for maximum factuality
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

    // Clean up any formatting that might have slipped through
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
        insufficientData: false,
        score: sufficiencyCheck.score,
        metConditions: sufficiencyCheck.conditions
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
