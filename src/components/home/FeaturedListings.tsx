import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Eye } from "lucide-react";

const featuredItems = [
  {
    id: "1",
    title: "Товарный знак «ЭкоТех»",
    category: "Товарные знаки",
    registrationNumber: "№ 845672",
    price: "450 000 ₽",
    status: "verified",
    views: 234,
    description: "Зарегистрированный товарный знак для экологически чистых технологий",
  },
  {
    id: "2",
    title: "Патент на способ очистки воды",
    category: "Патенты",
    registrationNumber: "RU 2756891",
    price: "1 200 000 ₽",
    status: "verified",
    views: 189,
    description: "Инновационный метод очистки промышленных стоков",
  },
  {
    id: "3",
    title: "CRM-система для логистики",
    category: "Программы и код",
    registrationNumber: "2024612345",
    price: "890 000 ₽",
    status: "verified",
    views: 312,
    description: "Готовое решение для автоматизации логистических процессов",
  },
  {
    id: "4",
    title: "Дизайн упаковки косметики",
    category: "Промышленные образцы",
    registrationNumber: "№ 128934",
    price: "280 000 ₽",
    status: "pending",
    views: 156,
    description: "Оригинальный дизайн упаковки для линейки косметических средств",
  },
];

const FeaturedListings = () => {
  return (
    <section className="section-padding bg-surface-subtle">
      <div className="container-wide">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Избранные объекты</h2>
            <p className="text-muted-foreground">
              Актуальные предложения с подтверждённой документацией
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/catalog">
              Весь каталог
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredItems.map((item) => (
            <Link
              key={item.id}
              to={`/catalog/${item.id}`}
              className="group card-elevated p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="badge-category">
                    {item.category}
                  </Badge>
                  {item.status === "verified" ? (
                    <Badge className="badge-verified">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Проверен
                    </Badge>
                  ) : (
                    <Badge className="badge-pending">
                      На проверке
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  {item.views}
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Рег. номер</p>
                  <p className="text-sm font-medium">{item.registrationNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">Цена</p>
                  <p className="text-lg font-bold text-primary">{item.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
