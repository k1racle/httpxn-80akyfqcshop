import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================================================
// MASTER FRAMEWORK v3.0 - FINAL
// Режим: юридико-технологический / без галлюцинаций / радикально упрощённый
// Цель: обыватель понимает за 5 секунд, юрист не возражает, ИИ не расползается
// ============================================================================

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

// v3.0 LOGIC: название + номер + документ = A, иначе B
// Без промежуточных состояний. Это Порядок.
function checkDataSufficiency(data: GenerationRequest): { sufficient: boolean; hasName: boolean; hasNumber: boolean; hasDocument: boolean } {
  const hasName = Boolean(data.title && data.title.trim().length > 0);
  const hasNumber = Boolean(data.registrationNumber && data.registrationNumber.trim().length > 0);
  const hasDocument = Boolean(
    data.hasRegistrationCertificate || 
    data.hasRegistryExtract || 
    data.hasPowerOfAttorney || 
    data.hasFullDocumentation ||
    data.hasIPImage
  );

  // v3.0: Все три условия должны быть выполнены
  const sufficient = hasName && hasNumber && hasDocument;

  return { sufficient, hasName, hasNumber, hasDocument };
}

// ============================================================================
// ВАРИАНТ Б — ДАННЫХ НЕДОСТАТОЧНО (МАКСИМАЛЬНО КОРОТКО)
// Единственно допустимый текст. Никаких объяснений. Это стоп-экран.
// ============================================================================
const INSUFFICIENT_DATA_RESPONSE = `Полное описание объекта не сформировано.

Причина: недостаточно данных и подтверждающих документов.

Для продолжения необходимо добавить информацию об объекте и загрузить документы.

Объект имеет ознакомительный статус.`;

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

    // v3.0: Простая логика - название + номер + документ = A, иначе B
    const sufficiencyCheck = checkDataSufficiency(data);

    // ВАРИАНТ Б: Данных недостаточно → фиксированный текст, без AI
    if (!sufficiencyCheck.sufficient && !data.isDemo) {
      console.log(`[VARIANT_B] Missing: name=${!sufficiencyCheck.hasName}, number=${!sufficiencyCheck.hasNumber}, doc=${!sufficiencyCheck.hasDocument}`);
      return new Response(
        JSON.stringify({ 
          description: INSUFFICIENT_DATA_RESPONSE,
          generation_mode: "blocked_short",
          insufficientData: true,
          status_reason: "insufficient_data"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ВАРИАНТ А: Данные достаточны → генерация по шаблону v3.0
    const categoryLabels: Record<string, string> = {
      technological_packages: "технологический пакет",
      ai_models: "модель ИИ",
      software_and_code: "программное обеспечение",
      datasets: "датасет",
      patents: "патент",
      databases: "база данных",
      know_how: "ноу-хау",
      technical_specifications: "техническая спецификация",
      trademarks: "товарный знак",
      copyrights: "объект авторского права",
      digital_twins: "цифровой двойник",
      rnd_prototypes: "прототип",
      industrial: "промышленный образец",
      software: "программное обеспечение",
      knowhow: "ноу-хау",
      specifications: "технические спецификации",
      commercial: "коммерческое обозначение",
      educational: "обучающие материалы",
      methods: "методика",
      prototypes: "прототип",
    };

    const categoryName = categoryLabels[data.category] || "объект интеллектуальной собственности";

    // ============================================================================
    // v3.0 SYSTEM PROMPT - 3-5 предложений, обычный язык, без "юризмов"
    // ============================================================================
    const systemPrompt = `РОЛЬ: Генератор кратких описаний для каталога ИС.

БАЗОВОЕ ПРАВИЛО:
- 3-5 предложений максимум
- Обычный человеческий язык
- Один факт = одно предложение

ЖЁСТКИЕ ЗАПРЕТЫ (слова-паразиты):
❌ "характеризуется"
❌ "определяется" 
❌ "в рамках"
❌ "в соответствии"
❌ "объем правовой охраны"
❌ "настоящий объект"
❌ "данный объект"
❌ юридические рассуждения
❌ перечисление отсутствующих документов
❌ МКТУ если не указаны
❌ markdown, списки, заголовки

ШАБЛОН (строго следуй):
1. Объектом является [тип] «[Название]».
2. [Тип] зарегистрирован под номером [РегНомер] и используется для индивидуализации товаров/услуг правообладателя.
3. Правообладатель размещает объект с намерением отчуждения исключительного права.
4. Использование третьими лицами возможно только после законной передачи прав.

Всё. 4 предложения. Понятно. Чисто.`;

    let userPrompt = "";

    if (data.isDemo) {
      userPrompt = `Создай краткое описание для ОЗНАКОМИТЕЛЬНОЙ карточки.

ТИП: ${categoryName}

Начни с: "Карточка носит ознакомительный характер."
Заверши: "Не является предложением о сделке."

Максимум 4 предложения.`;
    } else {
      userPrompt = `Создай описание объекта ИС по шаблону.

ТИП: ${categoryName}
НАЗВАНИЕ: ${data.title}
РЕГ. НОМЕР: ${data.registrationNumber}

Используй ТОЛЬКО эти данные. Строго 4 предложения по шаблону.`;
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
        max_tokens: 500,
        temperature: 0.1, // Минимальная креативность для строгого следования шаблону
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

    // Очистка форматирования
    generatedDescription = generatedDescription
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/__/g, "")
      .replace(/^#+\s*/gm, "")
      .replace(/^[-•]\s*/gm, "")
      .replace(/^\d+\.\s+/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return new Response(
      JSON.stringify({ 
        description: generatedDescription,
        generation_mode: "full",
        insufficientData: false,
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
