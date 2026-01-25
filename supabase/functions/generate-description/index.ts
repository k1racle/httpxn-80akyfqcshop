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
      ownerInfo = null,
      hasRegistrationCertificate = false,
      hasRegistryExtract = false,
      hasPowerOfAttorney = false,
      hasFullDocumentation = false
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

    // Build document availability summary
    const availableDocs: string[] = [];
    const missingDocs: string[] = [];
    
    if (hasRegistrationCertificate) {
      availableDocs.push("свидетельство о регистрации");
    } else {
      missingDocs.push("свидетельство о регистрации");
    }
    
    if (hasRegistryExtract) {
      availableDocs.push("выписка из государственного реестра");
    } else {
      missingDocs.push("выписка из государственного реестра");
    }
    
    if (hasPowerOfAttorney) {
      availableDocs.push("документ о полномочиях");
    } else {
      missingDocs.push("документ о полномочиях");
    }
    
    if (hasFullDocumentation) {
      availableDocs.push("полная техническая документация");
    } else {
      missingDocs.push("полная техническая документация");
    }

    const systemPrompt = `Ты — юридико-технологический редактор каталога интеллектуальной собственности.
Твоя задача — формировать точное, проверяемое, нейтральное описание объекта ИС на основании ТОЛЬКО предоставленных данных.

БАЗОВЫЙ ПРИНЦИП: НЕТ ИСТОЧНИКА — НЕТ УТВЕРЖДЕНИЯ

КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО:
- Додумывать свойства, функции, преимущества
- Придумывать область применения
- Симулировать наличие регистрации, прав, статусов
- Использовать маркетинговые или оценочные формулировки
- Использовать markdown, звёздочки, заголовки капсом
- Использовать списки с символами (-, *, •)
- Использовать эмоциональные оценки и рекламные клише

ИСТОЧНИКИ ЛЕГИТИМНОСТИ (только эти):
1. Свидетельство о регистрации
2. Выписка из государственного реестра
3. Документ, подтверждающий полномочия
4. Полная документация на объект
5. Поля формы, заполненные пользователем

Если источник не указан — утверждение НЕ ДОПУСКАЕТСЯ.
Если данных нет — прямо написать: "сведения отсутствуют" или "данные не предоставлены".

СТИЛЬ ЯЗЫКА:
- Юридически корректный
- Технически точный
- Понятный обывателю
- Нейтральный, без оценок

СТРУКТУРА ОПИСАНИЯ (сплошным текстом, без заголовков):

1. Общее описание объекта — тип объекта ИС, его назначение в общем виде (без детализации, если она не подтверждена документами), что именно предоставлено и не предоставлено для анализа.

2. Юридическое основание и статус прав — наличие или отсутствие регистрации, реквизиты (только если предоставлены), текущий статус (подтверждён / не подтверждён / ознакомительный).

3. Состав и содержание объекта — только фактически представленные элементы. При отсутствии данных — указать невозможность определения состава.

4. Область применения — ТОЛЬКО если прямо следует из документов. В противном случае — указать, что область применения не определена на основании представленных данных.

5. Ограничения и условия — территориальные ограничения, срок действия (если известен), ограничения использования, риски при отсутствии регистрации.

ОБЪЁМ: 1800-2500 знаков если данных достаточно. Если данных недостаточно — меньший объём с явным указанием причин.

САМОПРОВЕРКА ПЕРЕД ВЫВОДОМ:
- Есть ли утверждения без источника? → Удалить
- Есть ли домыслы? → Заменить на "сведения отсутствуют"
- Есть ли оценочные слова? → Удалить
- Чётко ли обозначен статус объекта? → Обязательно

ЛУЧШЕ НЕПОЛНОЕ, ЧЕМ НЕДОСТОВЕРНОЕ.`;

    let userPrompt = "";

    if (isDemo) {
      userPrompt = `Создай описание для ОЗНАКОМИТЕЛЬНОЙ карточки объекта интеллектуальной собственности.

ВХОДНЫЕ ДАННЫЕ:
Тип объекта: ${categoryName}
Название: ${title || "Не указано"}
Рег. номер: ${registrationNumber || "Не указан"}
Статус карточки: ОЗНАКОМИТЕЛЬНЫЙ

Предоставленные документы: отсутствуют (демонстрационная карточка)

СПЕЦИАЛЬНЫЕ ТРЕБОВАНИЯ ДЛЯ ОЗНАКОМИТЕЛЬНОЙ КАРТОЧКИ:
1. Явно указать в начале: "Карточка носит ознакомительный характер, предназначена для демонстрации структуры каталога и не является предложением о заключении сделки."
2. Не допускать формулировок о продаже, стоимости, коммерческой ценности.
3. Описание должно быть типовым для данной категории ИС без конкретных утверждений о свойствах объекта.

В конце ОБЯЗАТЕЛЬНО добавить: "Представленная информация носит справочный характер и не отражает фактическую регистрацию прав. Для получения достоверных сведений необходимо обращение к правообладателю и проверка в государственных реестрах."`;
    } else {
      const docsAvailableText = availableDocs.length > 0 
        ? `Предоставлены: ${availableDocs.join(", ")}.` 
        : "Документы не предоставлены.";
      const docsMissingText = missingDocs.length > 0 
        ? `Не предоставлены: ${missingDocs.join(", ")}.` 
        : "";

      userPrompt = `Создай описание для объекта интеллектуальной собственности.

ВХОДНЫЕ ДАННЫЕ:
Тип объекта: ${categoryName}
Название: ${title || "Не указано"}
Рег. номер: ${registrationNumber || "Не указан"}
Статус карточки: КОММЕРЧЕСКИЙ

ДОКУМЕНТЫ:
${docsAvailableText}
${docsMissingText}

${documentInfo ? `Сведения из документов: ${documentInfo}` : "Содержание документов: не извлечено."}
${ownerInfo ? `Сведения о правообладателе: ${ownerInfo}` : "Сведения о правообладателе: не предоставлены."}

${currentDescription ? `ТЕКУЩЕЕ ОПИСАНИЕ ДЛЯ УЛУЧШЕНИЯ:\n${currentDescription}\n\nПереработай описание согласно требованиям, устранив любые домыслы и непроверяемые утверждения.` : "Текущее описание: отсутствует. Создай новое описание на основании имеющихся данных."}

ВАЖНО:
1. Любое утверждение должно опираться на указанные источники.
2. Если данных недостаточно для раздела — явно указать, что данные отсутствуют.
3. Не додумывать свойства, функции, область применения.
4. Объём: 1800-2500 знаков при достаточности данных, меньше — при их недостатке.`;
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
        temperature: 0.3, // Lower temperature for more factual output
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

    // Clean up any formatting that might have slipped through
    generatedDescription = generatedDescription
      // Remove markdown bold/italic
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/__/g, "")
      .replace(/_/g, " ")
      // Remove headers
      .replace(/^#+\s*/gm, "")
      // Remove list markers
      .replace(/^[-•]\s*/gm, "")
      .replace(/^\d+\.\s+/gm, "")
      // Remove ALL CAPS headers (more than 3 consecutive caps words)
      .replace(/^[А-ЯЁA-Z\s]{10,}$/gm, (match: string) => {
        // Convert to sentence case
        return match.charAt(0) + match.slice(1).toLowerCase();
      })
      // Clean up extra whitespace
      .replace(/\n{3,}/g, "\n\n")
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
