import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Eye,
  Upload,
  ImageIcon,
  FileText,
  Award,
  Building,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  ExternalLink,
  Loader2,
  Pencil,
  PauseCircle,
} from "lucide-react";
import SubmissionEditDialog from "./SubmissionEditDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SubmissionCardProps {
  submission: {
    id: string;
    name: string;
    category: string;
    created_at: string;
    status: string;
    price: number | null;
    documents: string[] | null;
    admin_notes: string | null;
    user_id: string;
    description?: string | null;
    hold_expires_at?: string | null;
  };
  onUpdate: () => void;
}

type DocumentType = "image" | "certificate" | "registry" | "authority";

interface DocumentConfig {
  id: DocumentType;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  pattern: RegExp;
  helpLink: string;
  helpText: string;
}

const documentConfigs: DocumentConfig[] = [
  {
    id: "image",
    label: "Изображение объекта ИС",
    shortLabel: "Изображение",
    icon: <ImageIcon className="h-4 w-4" />,
    pattern: /\/image\//i,
    helpLink: "https://rospatent.gov.ru/",
    helpText: "Фото или скан товарного знака",
  },
  {
    id: "certificate",
    label: "Свидетельство о регистрации",
    shortLabel: "Свидетельство",
    icon: <Award className="h-4 w-4" />,
    pattern: /\/certificate\//i,
    helpLink: "https://rospatent.gov.ru/ru/activities/dues/table",
    helpText: "Получите в Роспатенте",
  },
  {
    id: "registry",
    label: "Выписка из реестра",
    shortLabel: "Выписка",
    icon: <FileText className="h-4 w-4" />,
    pattern: /\/registry\//i,
    helpLink: "https://www1.fips.ru/registers-web/",
    helpText: "Бесплатно на сайте ФИПС",
  },
  {
    id: "authority",
    label: "Подтверждение полномочий",
    shortLabel: "Полномочия",
    icon: <Building className="h-4 w-4" />,
    pattern: /\/authority\//i,
    helpLink: "https://rospatent.gov.ru/ru/stateservices",
    helpText: "Доверенность или выписка ЕГРЮЛ",
  },
];

const formatPrice = (price: number | null) => {
  if (!price) return "Договорная";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
};

const formatDateShort = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getSubmissionStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "Ожидает подтверждения";
    case "reviewing":
      return "На проверке";
    case "approved":
      return "Одобрена";
    case "rejected":
      return "Отклонена";
    case "published":
      return "Опубликована";
    case "sold":
      return "Продана";
    case "on_hold":
      return "На удержании";
    case "cancelled":
      return "Отменена";
    default:
      return status;
  }
};

const getSubmissionStatusVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "approved":
    case "published":
      return "default";
    case "reviewing":
    case "sold":
    case "on_hold":
      return "secondary";
    case "rejected":
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

const SubmissionCard = ({ submission, onUpdate }: SubmissionCardProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [uploading, setUploading] = useState<DocumentType | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const isOnHold = submission.status === "on_hold";
  const isCancelled = submission.status === "cancelled";

  // Parse documents to determine which types are uploaded
  const getDocumentsByType = () => {
    const docs: Record<DocumentType, string | null> = {
      image: null,
      certificate: null,
      registry: null,
      authority: null,
    };

    if (!submission.documents) return docs;

    submission.documents.forEach((path) => {
      for (const config of documentConfigs) {
        if (config.pattern.test(path)) {
          docs[config.id] = path;
          break;
        }
      }
      // If no pattern matched, assume it's an image (legacy)
      if (!Object.values(docs).includes(path)) {
        if (!docs.image) {
          docs.image = path;
        }
      }
    });

    return docs;
  };

  const documentsByType = getDocumentsByType();
  const hasImage = !!documentsByType.image;
  const missingDocs = documentConfigs.filter(
    (c) => !c.pattern.test("image") && !documentsByType[c.id]
  );

  const loadPreview = async (path: string) => {
    setPreviewLoading(true);
    try {
      const { data } = await supabase.storage
        .from("ip-documents")
        .createSignedUrl(path, 300);

      if (data?.signedUrl) {
        setPreviewUrl(data.signedUrl);
      }
    } catch (error) {
      console.error("Error loading preview:", error);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleUpload = async (type: DocumentType, file: File) => {
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "Ошибка",
        description: "Файл слишком большой (макс. 10 МБ)",
        variant: "destructive",
      });
      return;
    }

    setUploading(type);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 6)}.${fileExt}`;
      const filePath = `${submission.user_id}/${type}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("ip-documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Update submission with new document
      const currentDocs = submission.documents || [];
      const newDocs = [...currentDocs, filePath];

      const { error: updateError } = await supabase
        .from("ip_submissions")
        .update({ documents: newDocs })
        .eq("id", submission.id);

      if (updateError) throw updateError;

      toast({
        title: "Документ загружен",
        description: documentConfigs.find((c) => c.id === type)?.label,
      });

      onUpdate();
    } catch (error: any) {
      toast({
        title: "Ошибка загрузки",
        description: error.message || "Не удалось загрузить файл",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="p-4 rounded-lg border border-border">
      <div className="flex items-start gap-4">
        {/* Preview thumbnail */}
        <div className="shrink-0">
          {hasImage ? (
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className="w-16 h-16 rounded-lg bg-muted border border-border overflow-hidden hover:ring-2 hover:ring-primary transition-all cursor-pointer"
                  onClick={() => loadPreview(documentsByType.image!)}
                >
                  {previewLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={submission.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{submission.name}</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={submission.name}
                      className="w-full rounded-lg"
                    />
                  ) : (
                    <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <div className="w-16 h-16 rounded-lg bg-muted border border-dashed border-border flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-medium truncate">{submission.name}</h4>
              <p className="text-sm text-muted-foreground">
                {submission.category} • {formatDateShort(submission.created_at)}
              </p>
            </div>
            <Badge variant={getSubmissionStatusVariant(submission.status)}>
              {getSubmissionStatusLabel(submission.status)}
            </Badge>
          </div>

          {submission.admin_notes && (
            <p className="text-sm text-amber-600 mt-2 flex items-start gap-1">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              {submission.admin_notes}
            </p>
          )}

          {/* Documents status */}
          <div className="mt-3">
            <TooltipProvider>
              <div className="flex flex-wrap items-center gap-2">
                {documentConfigs.map((config) => {
                  const hasDoc = !!documentsByType[config.id];
                  const isUploading = uploading === config.id;

                  return (
                    <Tooltip key={config.id}>
                      <TooltipTrigger asChild>
                        {hasDoc ? (
                          <Badge
                            variant="secondary"
                            className="gap-1 cursor-default"
                          >
                            {config.icon}
                            <span className="hidden sm:inline">
                              {config.shortLabel}
                            </span>
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </Badge>
                        ) : (
                          <label className="cursor-pointer">
                            <Badge
                              variant="outline"
                              className="gap-1 hover:bg-accent cursor-pointer transition-colors"
                            >
                              {isUploading ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                config.icon
                              )}
                              <span className="hidden sm:inline">
                                {config.shortLabel}
                              </span>
                              <Upload className="h-3 w-3" />
                            </Badge>
                            <input
                              ref={(el) =>
                                (fileInputRefs.current[config.id] = el)
                              }
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,.webp"
                              className="sr-only"
                              disabled={isUploading}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUpload(config.id, file);
                                e.target.value = "";
                              }}
                            />
                          </label>
                        )}
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <div className="text-xs">
                          <p className="font-medium">{config.label}</p>
                          {!hasDoc && (
                            <p className="text-muted-foreground mt-1">
                              Нажмите для загрузки
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Документов: {submission.documents?.length || 0} / 4
              </p>
              {isOnHold && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <PauseCircle className="h-3 w-3" />
                  24ч
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-primary">
                {formatPrice(submission.price)}
              </p>
              {!isCancelled && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Редактировать
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <SubmissionEditDialog
        submission={submission}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default SubmissionCard;
