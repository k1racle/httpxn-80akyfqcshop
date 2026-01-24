import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AiDescriptionHelperProps {
  category: string;
  title: string;
  registrationNumber: string;
  currentDescription: string;
  onDescriptionGenerated: (description: string) => void;
}

const AiDescriptionHelper = ({
  category,
  title,
  registrationNumber,
  currentDescription,
  onDescriptionGenerated,
}: AiDescriptionHelperProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!category && !title) {
      toast({
        title: "Укажите данные",
        description: "Выберите категорию и введите название для генерации описания",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-description", {
        body: {
          category,
          title,
          registrationNumber,
          currentDescription,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.description) {
        onDescriptionGenerated(data.description);
        toast({
          title: "Описание сгенерировано",
          description: currentDescription 
            ? "Описание улучшено с помощью AI" 
            : "Используйте сгенерированный текст как основу",
        });
      }
    } catch (error: any) {
      console.error("AI generation error:", error);
      toast({
        title: "Ошибка генерации",
        description: error.message || "Не удалось сгенерировать описание",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleGenerate}
      disabled={isGenerating}
      className="gap-2"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Генерация...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          {currentDescription ? "Улучшить с AI" : "Сгенерировать с AI"}
        </>
      )}
    </Button>
  );
};

export default AiDescriptionHelper;