import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Upload, CheckCircle, FileText, AlertCircle, X, File } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AiDescriptionHelper from "@/components/sell/AiDescriptionHelper";

const categories = [
  { id: "trademarks", label: "Товарный знак" },
  { id: "patents", label: "Патент (изобретение, полезная модель)" },
  { id: "industrial", label: "Промышленный образец" },
  { id: "software", label: "ПО, код, IT-продукт" },
  { id: "copyrights", label: "Авторское право (текст, дизайн, фото)" },
  { id: "databases", label: "База данных" },
  { id: "knowhow", label: "Ноу-хау / Коммерческая тайна" },
  { id: "specifications", label: "Технические спецификации" },
  { id: "commercial", label: "Коммерческое обозначение" },
  { id: "educational", label: "Обучающие материалы" },
  { id: "methods", label: "Методики и технологии" },
  { id: "prototypes", label: "Прототипы и R&D разработки" },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

const Sell = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [description, setDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Неподдерживаемый формат: ${file.name}`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `Файл слишком большой: ${file.name} (макс. 10 МБ)`;
    }
    return null;
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles || newFiles.length === 0) return;
    
    const validFiles: File[] = [];
    const errors: string[] = [];
    
    Array.from(newFiles).forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else if (!files.some(f => f.name === file.name)) {
        validFiles.push(file);
      }
    });
    
    if (errors.length > 0) {
      toast({
        title: "Ошибка загрузки",
        description: errors.join(", "),
        variant: "destructive",
      });
    }
    
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
    
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const uploadFiles = async (): Promise<string[]> => {
    if (!user || files.length === 0) return [];
    
    const uploadedPaths: string[] = [];
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('ip-documents')
        .upload(fileName, file);
      
      if (error) {
        throw new Error(`Ошибка загрузки файла: ${file.name}`);
      }
      
      uploadedPaths.push(fileName);
    }
    
    return uploadedPaths;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в аккаунт для размещения объектов",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload files
      const uploadedPaths = await uploadFiles();
      
      // Here you would save the form data to database
      // For now, just show success message
      console.log("Uploaded files:", uploadedPaths);
      
      toast({
        title: "Заявка отправлена",
        description: "Мы свяжемся с вами для уточнения деталей в течение 24 часов.",
      });
      
      // Reset form
      setFiles([]);
      setCategory("");
      setTitle("");
      setRegNumber("");
      setDescription("");
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось отправить заявку",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' Б';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
    return (bytes / (1024 * 1024)).toFixed(1) + ' МБ';
  };

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-narrow">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Разместить объект интеллектуальной собственности
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Заполните форму для размещения вашего объекта на платформе. 
              После проверки документации мы опубликуем его в каталоге.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="card-elevated p-6 sm:p-8 space-y-6">
                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Тип объекта ИС *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Название объекта *</Label>
                  <Input
                    id="title"
                    placeholder="Например: Товарный знак «ЭкоТех»"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Registration Number */}
                <div className="space-y-2">
                  <Label htmlFor="regNumber">Регистрационный номер *</Label>
                  <Input
                    id="regNumber"
                    placeholder="Номер свидетельства или патента"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description">Описание *</Label>
                    <AiDescriptionHelper
                      category={category}
                      title={title}
                      registrationNumber={regNumber}
                      currentDescription={description}
                      onDescriptionGenerated={setDescription}
                    />
                  </div>
                  <Textarea
                    id="description"
                    placeholder="Опишите объект, его назначение и преимущества..."
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Нажмите «Сгенерировать с AI» для создания профессионального описания
                  </p>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Желаемая цена (₽) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="500000"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Укажите сумму в рублях. Комиссия платформы обсуждается индивидуально.
                  </p>
                </div>

                {/* Documents Upload */}
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Документы</Label>
                  <label
                    htmlFor="file-upload"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`block border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                      isDragging 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      id="file-upload"
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={(e) => handleFiles(e.target.files)}
                      className="sr-only"
                    />
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Перетащите файлы или нажмите для загрузки
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, JPG, PNG до 10 МБ
                    </p>
                  </label>
                  
                  {/* File list */}
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file) => (
                        <div 
                          key={file.name} 
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <File className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium truncate max-w-[200px]">
                                {file.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(file.name)}
                            className="p-1 hover:bg-background rounded-md transition-colors"
                          >
                            <X className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ваше имя *</Label>
                    <Input id="name" placeholder="Иван Петров" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Организация</Label>
                    <Input id="company" placeholder="ООО «Компания»" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="email@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input id="phone" type="tel" placeholder="+7 (900) 123-45-67" required />
                  </div>
                </div>

                {/* Auth notice */}
                {!user && (
                  <div className="p-4 rounded-lg bg-accent border border-border">
                    <p className="text-sm text-accent-foreground">
                      Для загрузки файлов и отправки заявки необходимо{" "}
                      <a href="/auth" className="text-primary underline hover:no-underline">
                        войти в аккаунт
                      </a>
                    </p>
                  </div>
                )}

                {/* Submit */}
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Отправка..." : "Отправить заявку"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Нажимая кнопку, вы соглашаетесь с{" "}
                  <a href="/legal/offer" className="underline hover:text-foreground">
                    публичной офертой
                  </a>{" "}
                  и{" "}
                  <a href="/legal/privacy" className="underline hover:text-foreground">
                    политикой конфиденциальности
                  </a>
                </p>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Process Info */}
              <div className="card-elevated p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Как это работает
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium">Заполните форму</p>
                      <p className="text-xs text-muted-foreground">Укажите данные об объекте и загрузите документы</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium">Юридическая проверка</p>
                      <p className="text-xs text-muted-foreground">Наши эксперты проверят чистоту прав</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium">Публикация</p>
                      <p className="text-xs text-muted-foreground">Объект появится в каталоге после подтверждения</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Requirements */}
              <div className="card-elevated p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Необходимые документы
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Свидетельство о регистрации
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Выписка из реестра
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Подтверждение полномочий
                  </li>
                </ul>
              </div>

              {/* Note */}
              <div className="p-4 rounded-lg bg-accent border border-border">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-accent-foreground mt-0.5" />
                  <p className="text-sm text-accent-foreground">
                    Комиссия платформы обсуждается индивидуально и фиксируется в договоре с продавцом
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Sell;
