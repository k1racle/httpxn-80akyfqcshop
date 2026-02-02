import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Shield, 
  FileText, 
  Calendar,
  Building,
  Eye,
  Share2,
  Heart,
  ShoppingCart,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { useListings, Listing } from "@/hooks/useListings";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/catalog/StatusBadge";
import { mapDbStatusToCode, LISTING_STATUSES, ListingStatusCode } from "@/types/listingStatus";

const categoryLabels: Record<string, string> = {
  trademarks: "Товарные знаки",
  patents: "Патенты",
  software: "Программы и код",
  copyrights: "Авторские права",
  industrial: "Промышленные образцы",
  commercial: "Коммерческие обозначения",
  databases: "Базы данных",
  knowhow: "Ноу-хау",
  specifications: "ТУ и техдокументация",
  educational: "Образовательные материалы",
  prototypes: "Прототипы и НИОКР",
};

const formatPrice = (price: number | null): string => {
  if (price === null) return "Договорная";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
};

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCart, toggleCart } = useCart();
  const { createOrder } = useOrders();
  const { getListingById, trackView } = useListings();

  const [item, setItem] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItem = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      const listing = await getListingById(id);
      setItem(listing);
      setLoading(false);

      // Track view
      if (listing) {
        trackView(id, user?.id);
      }
    };

    loadItem();
  }, [id, user?.id]);

  const isFav = id ? isFavorite(id) : false;
  const inCart = id ? isInCart(id) : false;

  const handleBuyNow = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    if (!item || !id) return;

    const order = await createOrder(
      id,
      {
        name: item.name,
        category: item.category,
        price: item.price || 0,
        registration_number: item.registration_number || undefined,
      },
      item.price || 0
    );

    if (order) {
      navigate("/dashboard?tab=orders");
    }
  };

  // Динамические мета-данные для SEO
  const pageMeta = item ? {
    title: `${item.name} — ${categoryLabels[item.category] || item.category} | Патент.Shop`,
    description: item.description?.slice(0, 155) || `Купить ${item.name}. ${categoryLabels[item.category] || ''} с проверенной документацией.`,
  } : undefined;

  if (loading) {
    return (
      <Layout>
        <div className="container-wide section-padding flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!item) {
    return (
      <Layout>
        <div className="container-wide section-padding text-center">
          <h1 className="text-2xl font-bold mb-4">Объект не найден</h1>
          <p className="text-muted-foreground mb-6">
            Возможно, объект был удалён или ещё не опубликован
          </p>
          <Button asChild>
            <Link to="/catalog">Вернуться в каталог</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const categoryLabel = categoryLabels[item.category] || item.category;
  
  // Определяем статус по жизненному циклу
  const statusCode: ListingStatusCode = mapDbStatusToCode(item.status, item.is_demo);
  const listingStatus = LISTING_STATUSES[statusCode];

  return (
    <Layout meta={pageMeta}>
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
                      {categoryLabel}
                    </Badge>
                    <StatusBadge statusCode={statusCode} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className={cn(isFav && "text-red-500")}
                      onClick={() => id && !item.is_demo && toggleFavorite(id)}
                      disabled={!listingStatus.canTransact}
                    >
                      <Heart className={cn("h-4 w-4", isFav && "fill-current")} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{item.name}</h1>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {item.views_count || 0} просмотров
                  </span>
                  {item.registration_number && (
                    <span>Рег. номер: {item.registration_number}</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="card-elevated p-6">
                <h2 className="text-lg font-semibold mb-4">Описание</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {item.description || "Описание не указано"}
                </p>
              </div>

              {/* Ознакомительные материалы - для изучения объекта */}
              <div className="card-elevated p-6">
                <h2 className="text-lg font-semibold mb-4">Ознакомительные материалы</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Изучите документы и технические характеристики объекта
                </p>
                
                <div className="space-y-3">
                  {/* Документы объекта */}
                  {item.documents && item.documents.length > 0 ? (
                    <div className="space-y-2">
                      {item.documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-surface-subtle hover:bg-accent transition-colors cursor-pointer">
                          <FileText className="h-5 w-5 text-primary" />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium truncate block">{doc.split('/').pop()}</span>
                            <span className="text-xs text-muted-foreground">Документ объекта</span>
                          </div>
                          <Badge variant="outline" className="text-xs shrink-0">Просмотр</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground italic">
                      Документы не загружены
                    </div>
                  )}

                  {/* Внешние источники для проверки */}
                  {item.registration_number && (
                    <div className="pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Проверка в официальных реестрах:</p>
                      <div className="flex flex-wrap gap-2">
                        <a 
                          href={`https://fips.ru/registers-doc-view/fips_servlet?DB=RUPAT&DocNumber=${item.registration_number?.replace(/[^\d]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          <Shield className="h-3.5 w-3.5" />
                          Реестр ФИПС
                        </a>
                        <a 
                          href="https://rospatent.gov.ru/ru/databases"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                        >
                          <Building className="h-3.5 w-3.5" />
                          Базы Роспатента
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="card-elevated p-6">
                <h2 className="text-lg font-semibold mb-4">Детали объекта</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-surface-subtle">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Дата публикации</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-surface-subtle">
                    <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Категория</p>
                      <p className="text-sm text-muted-foreground">{categoryLabel}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card - различается по статусам */}
              <div className="card-elevated p-6 sticky top-24">
                {/* S0 - Ознакомительный: показываем предупреждение */}
                {statusCode === 'S0' && (
                  <div className="mb-6 p-4 rounded-lg bg-slate-100 border border-slate-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-slate-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-1">
                          Ознакомительный объект
                        </p>
                        <p className="text-xs text-slate-600">
                          Не участвует в сделках. Предназначен для демонстрации структуры каталога.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* S1 - На проверке */}
                {statusCode === 'S1' && (
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Цена</p>
                    <p className="text-3xl font-bold text-primary">{formatPrice(item.price)}</p>
                    <p className="text-sm text-amber-600 mt-2">Ожидание проверки платформой</p>
                  </div>
                )}

                {/* S2 - Доступен для сделки */}
                {statusCode === 'S2' && (
                  <>
                    <div className="mb-6">
                      <p className="text-sm text-muted-foreground mb-1">Цена</p>
                      <p className="text-3xl font-bold text-primary">{formatPrice(item.price)}</p>
                      {item.price_negotiable && (
                        <p className="text-sm text-muted-foreground mt-1">Возможен торг</p>
                      )}
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

                    {/* Trust Badge - только для S2 */}
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
                  </>
                )}

                {/* S3 - Архив */}
                {statusCode === 'S3' && (
                  <div className="p-4 rounded-lg bg-gray-100 border border-gray-200">
                    <p className="text-sm text-gray-600">
                      Объект снят с публикации и находится в архиве.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ItemDetail;