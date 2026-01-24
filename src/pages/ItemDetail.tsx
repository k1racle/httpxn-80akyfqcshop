import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  ArrowLeft, 
  Shield, 
  FileText, 
  Calendar,
  Building,
  Eye,
  Share2,
  Heart,
  ShoppingCart
} from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Mock data - in real app would fetch from API
const itemData: Record<string, {
  id: string;
  title: string;
  category: string;
  registrationNumber: string;
  price: string;
  priceNumber: number;
  status: string;
  views: number;
  description: string;
  fullDescription: string;
  validUntil: string;
  owner: string;
  documents: string[];
}> = {
  "1": {
    id: "1",
    title: "Товарный знак «ЭкоТех»",
    category: "Товарные знаки",
    registrationNumber: "№ 845672",
    price: "450 000 ₽",
    priceNumber: 450000,
    status: "verified",
    views: 234,
    description: "Зарегистрированный товарный знак для экологически чистых технологий",
    fullDescription: "Зарегистрированный товарный знак «ЭкоТех» в Роспатенте. Охватывает классы МКТУ: 7, 9, 11, 35, 42. Товарный знак активно использовался в течение 5 лет для продвижения экологически чистых технологий и оборудования. Идеально подходит для компаний, работающих в сфере «зелёных» технологий, возобновляемой энергетики или экологического консалтинга.",
    validUntil: "15 марта 2034",
    owner: "ООО «ЭкоИнновации»",
    documents: ["Свидетельство о регистрации", "Выписка из реестра ФИПС", "Справка об отсутствии обременений"],
  },
  "2": {
    id: "2",
    title: "Патент на способ очистки воды",
    category: "Патенты",
    registrationNumber: "RU 2756891",
    price: "1 200 000 ₽",
    priceNumber: 1200000,
    status: "verified",
    views: 189,
    description: "Инновационный метод очистки промышленных стоков",
    fullDescription: "Патент на изобретение «Способ очистки промышленных сточных вод с применением модифицированных углеродных наноматериалов». Технология позволяет снизить затраты на очистку на 40% при повышении эффективности до 99.7%. Патент действует на территории РФ. Возможна подача заявки по процедуре PCT для международной защиты.",
    validUntil: "22 июля 2040",
    owner: "АО «НаноТехВода»",
    documents: ["Патентная грамота", "Формула изобретения", "Описание технологии", "Отчёт о патентной чистоте"],
  },
};

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = id ? itemData[id] : null;
  const { user } = useAuth();
  const { toast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCart, toggleCart } = useCart();
  const { createOrder } = useOrders();

  const isFav = id ? isFavorite(id) : false;
  const inCart = id ? isInCart(id) : false;

  // Check if it's a mock ID (simple numeric string like "1", "2", etc.)
  const isMockId = id ? /^\d+$/.test(id) : false;

  const handleBuyNow = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    if (!item || !id) return;

    // For mock IDs, show a demo message instead of creating an order
    if (isMockId) {
      toast({
        title: "Демо-режим",
        description: "Заявка на покупку доступна только для реальных объектов. Разместите свой объект через раздел 'Продать'.",
      });
      return;
    }

    const order = await createOrder(
      id,
      {
        name: item.title,
        category: item.category,
        price: item.priceNumber,
        registration_number: item.registrationNumber,
      },
      item.priceNumber
    );

    if (order) {
      navigate("/dashboard?tab=orders");
    }
  };

  if (!item) {
    return (
      <Layout>
        <div className="container-wide section-padding text-center">
          <h1 className="text-2xl font-bold mb-4">Объект не найден</h1>
          <Button asChild>
            <Link to="/catalog">Вернуться в каталог</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-wide">
          {/* Breadcrumb */}
          <Link 
            to="/catalog" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад в каталог
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="card-elevated p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="badge-category">
                      {item.category}
                    </Badge>
                    {item.status === "verified" && (
                      <Badge className="badge-verified">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Проверен
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className={cn(isFav && "text-red-500")}
                      onClick={() => id && toggleFavorite(id)}
                    >
                      <Heart className={cn("h-4 w-4", isFav && "fill-current")} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{item.title}</h1>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {item.views} просмотров
                  </span>
                  <span>Рег. номер: {item.registrationNumber}</span>
                </div>
              </div>

              {/* Description */}
              <div className="card-elevated p-6">
                <h2 className="text-lg font-semibold mb-4">Описание</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {item.fullDescription}
                </p>
              </div>

              {/* Details */}
              <div className="card-elevated p-6">
                <h2 className="text-lg font-semibold mb-4">Детали объекта</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-surface-subtle">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Действует до</p>
                      <p className="text-sm text-muted-foreground">{item.validUntil}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-surface-subtle">
                    <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Правообладатель</p>
                      <p className="text-sm text-muted-foreground">{item.owner}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="card-elevated p-6">
                <h2 className="text-lg font-semibold mb-4">Документация</h2>
                <ul className="space-y-2">
                  {item.documents.map((doc, index) => (
                    <li key={index} className="flex items-center gap-3 p-3 rounded-lg bg-surface-subtle">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm">{doc}</span>
                      <Badge variant="outline" className="ml-auto text-xs">Доступен</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <div className="card-elevated p-6 sticky top-24">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Цена</p>
                  <p className="text-3xl font-bold text-primary">{item.price}</p>
                </div>

                <div className="space-y-3">
                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="w-full"
                    onClick={handleBuyNow}
                  >
                    Оставить заявку на покупку
                  </Button>
                  <Button 
                    variant={inCart ? "default" : "outline"} 
                    size="lg" 
                    className="w-full gap-2"
                    onClick={() => id && toggleCart(id)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {inCart ? "В корзине" : "Добавить в корзину"}
                  </Button>
                </div>

                {/* Trust Badge */}
                <div className="mt-6 p-4 rounded-lg bg-accent border border-border">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold mb-1">Гарантия безопасной сделки</p>
                      <p className="text-xs text-muted-foreground">
                        Юридическая проверка, эскроу-платёж, оформление договора передачи прав
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ItemDetail;
