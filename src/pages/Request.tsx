import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Clock, Shield, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { id: "trademarks", label: "Товарный знак" },
  { id: "patents", label: "Патент" },
  { id: "software", label: "Программа / Код" },
  { id: "copyrights", label: "Авторское право" },
  { id: "industrial", label: "Промышленный образец" },
  { id: "commercial", label: "Коммерческое обозначение" },
  { id: "any", label: "Любой тип" },
];

const industries = [
  { id: "tech", label: "IT и технологии" },
  { id: "food", label: "Пищевая промышленность" },
  { id: "medicine", label: "Медицина и фармацевтика" },
  { id: "fashion", label: "Мода и красота" },
  { id: "auto", label: "Автомобильная отрасль" },
  { id: "construction", label: "Строительство" },
  { id: "finance", label: "Финансы и страхование" },
  { id: "other", label: "Другое" },
];

const Request = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urgent, setUrgent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast({
      title: "Заявка отправлена",
      description: "Мы начнём поиск и свяжемся с вами в течение 48 часов.",
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
              Найти объект интеллектуальной собственности
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Опишите, какой объект ИС вам нужен. Мы подберём варианты из каталога 
              или найдём правообладателя, готового к продаже.
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

                {/* Industry */}
                <div className="space-y-2">
                  <Label htmlFor="industry">Отрасль применения</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите отрасль" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind.id} value={ind.id}>
                          {ind.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Описание потребности *</Label>
                  <Textarea
                    id="description"
                    placeholder="Опишите подробно, какой объект ИС вам нужен, для каких целей, какие требования..."
                    rows={5}
                    required
                  />
                </div>

                {/* Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budgetMin">Бюджет от (₽)</Label>
                    <Input
                      id="budgetMin"
                      type="number"
                      placeholder="100000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budgetMax">Бюджет до (₽)</Label>
                    <Input
                      id="budgetMax"
                      type="number"
                      placeholder="1000000"
                    />
                  </div>
                </div>

                {/* Urgent */}
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="urgent" 
                    checked={urgent}
                    onCheckedChange={(checked) => setUrgent(checked as boolean)}
                  />
                  <label
                    htmlFor="urgent"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Срочный поиск (приоритетная обработка)
                  </label>
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
                  {isSubmitting ? "Отправка..." : "Отправить заявку на поиск"}
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
              {/* Benefits */}
              <div className="card-elevated p-6">
                <h3 className="font-semibold mb-4">Преимущества поиска через нас</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                      <Search className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Расширенный поиск</p>
                      <p className="text-xs text-muted-foreground">Ищем не только в каталоге, но и среди правообладателей</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                      <Shield className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Проверка чистоты</p>
                      <p className="text-xs text-muted-foreground">Юридическая экспертиза каждого варианта</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                      <Users className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Переговоры</p>
                      <p className="text-xs text-muted-foreground">Берём на себя коммуникацию с правообладателем</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                      <Clock className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Быстрый результат</p>
                      <p className="text-xs text-muted-foreground">Первые варианты в течение 48 часов</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="card-elevated p-4 text-center">
                  <p className="text-2xl font-bold text-primary">500+</p>
                  <p className="text-xs text-muted-foreground">Объектов в базе</p>
                </div>
                <div className="card-elevated p-4 text-center">
                  <p className="text-2xl font-bold text-primary">48ч</p>
                  <p className="text-xs text-muted-foreground">Время ответа</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Request;
