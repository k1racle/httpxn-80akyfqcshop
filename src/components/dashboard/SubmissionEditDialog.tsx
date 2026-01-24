import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Save, Trash2, PauseCircle, Clock, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface SubmissionEditDialogProps {
  submission: {
    id: string;
    name: string;
    description?: string | null;
    price: number | null;
    status: string;
    user_id: string;
    hold_expires_at?: string | null;
    category?: string;
    registration_number?: string | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const SubmissionEditDialog = ({
  submission,
  open,
  onOpenChange,
  onUpdate,
}: SubmissionEditDialogProps) => {
  const { toast } = useToast();
  const [name, setName] = useState(submission.name);
  const [description, setDescription] = useState(submission.description || "");
  const [price, setPrice] = useState(submission.price?.toString() || "");
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [holdingAction, setHoldingAction] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const canEdit = !["published", "sold", "cancelled"].includes(submission.status);
  const isOnHold = submission.status === "on_hold";

  const logHistory = async (action: string, changes: Record<string, any>) => {
    try {
      await supabase.from("submission_history").insert({
        submission_id: submission.id,
        user_id: submission.user_id,
        action,
        changes,
      });
    } catch (error) {
      console.error("Failed to log history:", error);
    }
  };

  const handleGenerateAi = async () => {
    if (!name) {
      toast({
        title: "Укажите название",
        description: "Введите название для генерации описания",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingAi(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-description", {
        body: {
          category: submission.category || "trademark",
          title: name,
          registrationNumber: submission.registration_number || "",
          currentDescription: description,
        },
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      if (data?.description) {
        setDescription(data.description);
        toast({
          title: "Описание сгенерировано",
          description: description ? "Описание улучшено с помощью AI" : "Используйте сгенерированный текст как основу",
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
      setIsGeneratingAi(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Ошибка",
        description: "Название не может быть пустым",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const newPrice = price ? parseFloat(price) : null;
      const changes: Record<string, any> = {};

      if (name !== submission.name) {
        changes.name = { old: submission.name, new: name };
      }
      if (description !== (submission.description || "")) {
        changes.description = { old: submission.description, new: description };
      }
      if (newPrice !== submission.price) {
        changes.price = { old: submission.price, new: newPrice };
      }

      if (Object.keys(changes).length === 0) {
        toast({ title: "Нет изменений" });
        onOpenChange(false);
        return;
      }

      const { error } = await supabase
        .from("ip_submissions")
        .update({
          name: name.trim(),
          description: description.trim() || null,
          price: newPrice,
        })
        .eq("id", submission.id);

      if (error) throw error;

      await logHistory("updated", changes);

      toast({
        title: "Сохранено",
        description: "Изменения успешно применены",
      });

      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Ошибка сохранения",
        description: error.message || "Не удалось сохранить изменения",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);

    try {
      const { error } = await supabase
        .from("ip_submissions")
        .update({ status: "cancelled" })
        .eq("id", submission.id);

      if (error) throw error;

      await logHistory("status_changed", {
        status: { old: submission.status, new: "cancelled" },
      });

      toast({
        title: "Заявка отменена",
        description: "Карточка снята с продажи",
      });

      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось отменить заявку",
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
    }
  };

  const handleHold = async () => {
    setHoldingAction(true);

    try {
      const holdExpiresAt = new Date();
      holdExpiresAt.setHours(holdExpiresAt.getHours() + 24);

      const { error } = await supabase
        .from("ip_submissions")
        .update({
          status: "on_hold",
          hold_expires_at: holdExpiresAt.toISOString(),
          hold_reason: "Клиент заинтересован — проверка документов",
        })
        .eq("id", submission.id);

      if (error) throw error;

      await logHistory("status_changed", {
        status: { old: submission.status, new: "on_hold" },
        hold_expires_at: holdExpiresAt.toISOString(),
      });

      toast({
        title: "На удержании",
        description: "Карточка поставлена на удержание на 24 часа",
      });

      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось поставить на удержание",
        variant: "destructive",
      });
    } finally {
      setHoldingAction(false);
    }
  };

  const handleReleaseHold = async () => {
    setHoldingAction(true);

    try {
      const { error } = await supabase
        .from("ip_submissions")
        .update({
          status: "pending",
          hold_expires_at: null,
          hold_reason: null,
        })
        .eq("id", submission.id);

      if (error) throw error;

      await logHistory("status_changed", {
        status: { old: "on_hold", new: "pending" },
      });

      toast({
        title: "Удержание снято",
        description: "Карточка снова доступна для покупки",
      });

      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось снять удержание",
        variant: "destructive",
      });
    } finally {
      setHoldingAction(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Редактирование карточки
            {isOnHold && (
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" />
                На удержании
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {canEdit
              ? "Измените данные карточки и сохраните изменения"
              : "Редактирование недоступно для опубликованных/проданных объектов"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Название объекта *</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!canEdit || saving}
              placeholder="Название товарного знака"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-description">Описание</Label>
              {canEdit && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateAi}
                  disabled={isGeneratingAi || saving}
                  className="gap-2 h-7 text-xs"
                >
                  {isGeneratingAi ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Генерация...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3" />
                      {description ? "Улучшить с AI" : "Сгенерировать с AI"}
                    </>
                  )}
                </Button>
              )}
            </div>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!canEdit || saving}
              placeholder="Подробное описание объекта ИС..."
              rows={8}
              className="w-full resize-y min-h-[150px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-price">Цена (₽)</Label>
            <Input
              id="edit-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={!canEdit || saving}
              placeholder="500000"
              className="w-full"
            />
          </div>

          {isOnHold && submission.hold_expires_at && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
              <p className="text-amber-800">
                <Clock className="h-4 w-4 inline mr-1" />
                Удержание истекает:{" "}
                {new Date(submission.hold_expires_at).toLocaleString("ru-RU")}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            {/* Cancel/Remove from sale */}
            {canEdit && submission.status !== "cancelled" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={cancelling}>
                    {cancelling ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-1" />
                    )}
                    Снять с продажи
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Снять карточку с продажи?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Это действие отменит вашу заявку. Карточка будет удалена из
                      каталога и не будет доступна покупателям.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancel}>
                      Да, снять с продажи
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {/* Hold button */}
            {canEdit && !isOnHold && submission.status !== "cancelled" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleHold}
                disabled={holdingAction}
              >
                {holdingAction ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PauseCircle className="h-4 w-4 mr-1" />
                )}
                На удержание (24ч)
              </Button>
            )}

            {/* Release hold button */}
            {isOnHold && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReleaseHold}
                disabled={holdingAction}
              >
                {holdingAction ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Clock className="h-4 w-4 mr-1" />
                )}
                Снять удержание
              </Button>
            )}
          </div>

          <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Закрыть
            </Button>
            {canEdit && (
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <Save className="h-4 w-4 mr-1" />
                )}
                Сохранить
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionEditDialog;
