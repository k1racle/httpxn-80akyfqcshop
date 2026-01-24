import { useState, useRef } from "react";
import { Upload, X, File, CheckCircle, Clock, AlertCircle, ExternalLink, ImageIcon, FileText, Award, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

export type DocumentType = 'image' | 'certificate' | 'registry' | 'authority';
export type VerificationStatus = 'pending' | 'verified' | 'reviewing' | 'missing';

export interface DocumentFile {
  file: File;
  type: DocumentType;
  name: string;
}

interface DocumentConfig {
  id: DocumentType;
  label: string;
  description: string;
  required: boolean;
  icon: React.ReactNode;
  helpLink: string;
  helpText: string;
  acceptTypes: string[];
  acceptLabel: string;
}

const documentConfigs: DocumentConfig[] = [
  {
    id: 'image',
    label: 'Изображение объекта ИС',
    description: 'Фотография или скан товарного знака / логотипа',
    required: true,
    icon: <ImageIcon className="h-5 w-5" />,
    helpLink: 'https://rospatent.gov.ru/ru/stateservices/gosudarstvennaya-registraciya-tovarnogo-znaka-znaka-obsluzhivaniya',
    helpText: 'Загрузите изображение вашего товарного знака или объекта ИС в хорошем качестве',
    acceptTypes: IMAGE_TYPES,
    acceptLabel: 'JPG, PNG, WEBP',
  },
  {
    id: 'certificate',
    label: 'Свидетельство о регистрации',
    description: 'Официальный документ о регистрации права',
    required: false,
    icon: <Award className="h-5 w-5" />,
    helpLink: 'https://rospatent.gov.ru/ru/activities/dues/table',
    helpText: 'Получите в Роспатенте или через патентного поверенного. Госпошлина указана на сайте ФИПС.',
    acceptTypes: DOC_TYPES,
    acceptLabel: 'PDF, JPG, PNG',
  },
  {
    id: 'registry',
    label: 'Выписка из реестра',
    description: 'Актуальная выписка из государственного реестра',
    required: false,
    icon: <FileText className="h-5 w-5" />,
    helpLink: 'https://www1.fips.ru/registers-web/',
    helpText: 'Бесплатно на сайте ФИПС → Открытые реестры → Товарные знаки. Введите номер регистрации.',
    acceptTypes: DOC_TYPES,
    acceptLabel: 'PDF, JPG, PNG',
  },
  {
    id: 'authority',
    label: 'Подтверждение полномочий',
    description: 'Доверенность или документ о праве распоряжения',
    required: false,
    icon: <Building className="h-5 w-5" />,
    helpLink: 'https://rospatent.gov.ru/ru/stateservices',
    helpText: 'Если вы представитель компании — нотариальная доверенность. Если владелец — выписка из ЕГРЮЛ.',
    acceptTypes: DOC_TYPES,
    acceptLabel: 'PDF, JPG, PNG',
  },
];

interface DocumentUploadSectionProps {
  files: DocumentFile[];
  onFilesChange: (files: DocumentFile[]) => void;
  category?: string;
}

const DocumentUploadSection = ({ files, onFilesChange, category }: DocumentUploadSectionProps) => {
  const { toast } = useToast();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [draggingType, setDraggingType] = useState<DocumentType | null>(null);

  const getVerificationStatus = (type: DocumentType): VerificationStatus => {
    const file = files.find(f => f.type === type);
    if (!file) return 'missing';
    // In a real app, this would come from the backend
    return 'pending';
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return (
          <Badge variant="default" className="bg-green-600 text-white gap-1">
            <CheckCircle className="h-3 w-3" />
            Проверено
          </Badge>
        );
      case 'reviewing':
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            На проверке
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Ожидает проверки
          </Badge>
        );
      default:
        return null;
    }
  };

  const validateFile = (file: File, acceptTypes: string[]): string | null => {
    if (!acceptTypes.includes(file.type)) {
      return `Неподдерживаемый формат файла`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `Файл слишком большой (макс. 10 МБ)`;
    }
    return null;
  };

  const handleFileSelect = (type: DocumentType, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    
    const config = documentConfigs.find(c => c.id === type);
    if (!config) return;

    const file = fileList[0];
    const error = validateFile(file, config.acceptTypes);
    
    if (error) {
      toast({
        title: "Ошибка загрузки",
        description: error,
        variant: "destructive",
      });
      return;
    }

    // Replace existing file of same type or add new one
    const newFiles = files.filter(f => f.type !== type);
    newFiles.push({
      file,
      type,
      name: file.name,
    });
    
    onFilesChange(newFiles);
    
    toast({
      title: "Файл загружен",
      description: config.label,
    });

    // Reset input
    if (fileInputRefs.current[type]) {
      fileInputRefs.current[type]!.value = '';
    }
  };

  const removeFile = (type: DocumentType) => {
    onFilesChange(files.filter(f => f.type !== type));
  };

  const handleDragOver = (e: React.DragEvent, type: DocumentType) => {
    e.preventDefault();
    setDraggingType(type);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggingType(null);
  };

  const handleDrop = (e: React.DragEvent, type: DocumentType) => {
    e.preventDefault();
    setDraggingType(null);
    handleFileSelect(type, e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' Б';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
    return (bytes / (1024 * 1024)).toFixed(1) + ' МБ';
  };

  const getFileForType = (type: DocumentType) => {
    return files.find(f => f.type === type);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Документы</Label>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            Только изображение объекта обязательно
          </div>
        </div>

        <div className="space-y-4">
          {documentConfigs.map((config, index) => {
            const uploadedFile = getFileForType(config.id);
            const status = getVerificationStatus(config.id);
            const isDragging = draggingType === config.id;

            return (
              <div 
                key={config.id}
                className={`relative rounded-xl border-2 transition-all ${
                  config.required 
                    ? 'border-primary/30 bg-primary/5' 
                    : 'border-border bg-background'
                } ${isDragging ? 'border-primary bg-primary/10' : ''}`}
              >
                {/* Step number badge */}
                <div className="absolute -top-3 left-4">
                  <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                    config.required 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </span>
                </div>

                <div className="p-4 pt-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        config.required ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {config.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">
                            {config.label}
                            {config.required && <span className="text-destructive ml-1">*</span>}
                          </h4>
                          {uploadedFile && getStatusBadge(status)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {config.description}
                        </p>
                      </div>
                    </div>

                    {/* Help button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={config.helpLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Где получить?
                        </a>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs">
                        <p className="text-xs">{config.helpText}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Upload area or file preview */}
                  {uploadedFile ? (
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <File className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(uploadedFile.file.size)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => fileInputRefs.current[config.id]?.click()}
                        >
                          Заменить
                        </Button>
                        <button
                          type="button"
                          onClick={() => removeFile(config.id)}
                          className="p-1 hover:bg-background rounded-md transition-colors"
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                      <input
                        ref={(el) => fileInputRefs.current[config.id] = el}
                        type="file"
                        accept={config.acceptTypes.map(t => {
                          if (t === 'application/pdf') return '.pdf';
                          if (t === 'image/jpeg') return '.jpg,.jpeg';
                          if (t === 'image/png') return '.png';
                          if (t === 'image/webp') return '.webp';
                          return '';
                        }).join(',')}
                        onChange={(e) => handleFileSelect(config.id, e.target.files)}
                        className="sr-only"
                      />
                    </div>
                  ) : (
                    <label
                      onDragOver={(e) => handleDragOver(e, config.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, config.id)}
                      className={`flex items-center justify-center gap-3 p-4 border border-dashed rounded-lg cursor-pointer transition-colors ${
                        isDragging
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-accent/50'
                      }`}
                    >
                      <input
                        ref={(el) => fileInputRefs.current[config.id] = el}
                        type="file"
                        accept={config.acceptTypes.map(t => {
                          if (t === 'application/pdf') return '.pdf';
                          if (t === 'image/jpeg') return '.jpg,.jpeg';
                          if (t === 'image/png') return '.png';
                          if (t === 'image/webp') return '.webp';
                          return '';
                        }).join(',')}
                        onChange={(e) => handleFileSelect(config.id, e.target.files)}
                        className="sr-only"
                      />
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          Перетащите или{' '}
                        </span>
                        <span className="text-primary font-medium">
                          выберите файл
                        </span>
                        <span className="text-muted-foreground ml-2 text-xs">
                          ({config.acceptLabel})
                        </span>
                      </div>
                      {!config.required && (
                        <Badge variant="outline" className="text-xs">
                          Можно загрузить позже
                        </Badge>
                      )}
                    </label>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm">
          <span className="text-muted-foreground">
            Загружено документов: {files.length} из {documentConfigs.length}
          </span>
          <div className="flex items-center gap-4">
            {files.length > 0 && files.length < documentConfigs.length && (
              <span className="text-xs text-muted-foreground">
                Остальные можно добавить позже
              </span>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default DocumentUploadSection;
