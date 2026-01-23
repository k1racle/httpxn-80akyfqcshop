import { useState } from "react";
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
import { Shield, Upload, CheckCircle, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast({
      title: "Заявка отправлена",
      description: "Мы свяжемся с вами для уточнения деталей в течение 24 часов.",
    });
    
    setIsSubmitting(false);
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
                  <Select required>
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
                    required
                  />
                </div>

                {/* Registration Number */}
                <div className="space-y-2">
                  <Label htmlFor="regNumber">Регистрационный номер *</Label>
                  <Input
                    id="regNumber"
                    placeholder="Номер свидетельства или патента"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Описание *</Label>
                  <Textarea
                    id="description"
                    placeholder="Опишите объект, его назначение и преимущества..."
                    rows={5}
                    required
                  />
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
                  <Label>Документы</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Перетащите файлы или нажмите для загрузки
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, JPG, PNG до 10 МБ
                    </p>
                  </div>
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
