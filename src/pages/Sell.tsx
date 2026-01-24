import { useState } from "react";
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
import { Shield, CheckCircle, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AiDescriptionHelper from "@/components/sell/AiDescriptionHelper";
import DocumentUploadSection, { DocumentFile } from "@/components/sell/DocumentUploadSection";

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

const Sell = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentFiles, setDocumentFiles] = useState<DocumentFile[]>([]);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const uploadFiles = async (): Promise<string[]> => {
    if (!user || documentFiles.length === 0) return [];
    
    const uploadedPaths: string[] = [];
    
    for (const docFile of documentFiles) {
      const fileExt = docFile.file.name.split('.').pop();
      const fileName = `${user.id}/${docFile.type}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('ip-documents')
        .upload(fileName, docFile.file);
      
      if (error) {
        throw new Error(`Ошибка загрузки файла: ${docFile.file.name}`);
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

    // Check for required image
    const hasImage = documentFiles.some(f => f.type === 'image');
    if (!hasImage) {
      toast({
        title: "Требуется изображение",
        description: "Загрузите изображение объекта интеллектуальной собственности",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload files to storage
      const uploadedPaths = await uploadFiles();
      
      // Save submission to database
      const { error: submissionError } = await supabase
        .from('ip_submissions')
        .insert({
          user_id: user.id,
          category,
          name: title,
          registration_number: regNumber || null,
          description,
          price: price ? parseFloat(price) : null,
          documents: uploadedPaths,
          contact_name: contactName,
          contact_email: contactEmail,
          contact_phone: contactPhone || null,
          status: 'pending',
        });
      
      if (submissionError) {
        throw new Error(submissionError.message);
      }
      
      toast({
        title: "Заявка отправлена",
        description: "Мы свяжемся с вами для уточнения деталей в течение 24 часов.",
      });

      // Reset form state (so returning to the page doesn't show old data)
      setDocumentFiles([]);
      setCategory("");
      setTitle("");
      setRegNumber("");
      setDescription("");
      setPrice("");
      setContactName("");
      setContactEmail("");
      setContactPhone("");

      // Redirect immediately to dashboard's "my-sales" tab
      navigate("/dashboard?tab=my-sales", { replace: true });
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
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Укажите сумму в рублях. Комиссия платформы обсуждается индивидуально.
                  </p>
                </div>

                {/* Documents Upload - Step by Step */}
                <DocumentUploadSection
                  files={documentFiles}
                  onFilesChange={setDocumentFiles}
                  category={category}
                />

                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Ваше имя *</Label>
                    <Input 
                      id="contactName" 
                      placeholder="Иван Петров" 
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Организация</Label>
                    <Input id="company" placeholder="ООО «Компания»" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="email@example.com" 
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+7 (900) 123-45-67" 
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                    />
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

              {/* Document Status Info */}
              <div className="card-elevated p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Статус документов
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Изображение ИС
                    </span>
                    <span className="text-xs text-destructive font-medium">Обязательно</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      Свидетельство
                    </span>
                    <span className="text-xs text-muted-foreground">Опционально</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      Выписка из реестра
                    </span>
                    <span className="text-xs text-muted-foreground">Опционально</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      Полномочия
                    </span>
                    <span className="text-xs text-muted-foreground">Опционально</span>
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                  После загрузки изображения вы можете отправить заявку. Остальные документы можно добавить позже.
                </p>
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
