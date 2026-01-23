import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, CheckCircle, Eye, SlidersHorizontal } from "lucide-react";

const categories = [
  { id: "all", label: "Все категории" },
  { id: "trademarks", label: "Товарные знаки" },
  { id: "patents", label: "Патенты" },
  { id: "software", label: "Программы и код" },
  { id: "copyrights", label: "Авторские права" },
  { id: "industrial", label: "Промышленные образцы" },
  { id: "commercial", label: "Коммерческие обозначения" },
];

const listings = [
  {
    id: "1",
    title: "Товарный знак «ЭкоТех»",
    category: "trademarks",
    categoryLabel: "Товарные знаки",
    registrationNumber: "№ 845672",
    price: 450000,
    priceFormatted: "450 000 ₽",
    status: "verified",
    views: 234,
    description: "Зарегистрированный товарный знак для экологически чистых технологий. Действует до 2034 года.",
  },
  {
    id: "2",
    title: "Патент на способ очистки воды",
    category: "patents",
    categoryLabel: "Патенты",
    registrationNumber: "RU 2756891",
    price: 1200000,
    priceFormatted: "1 200 000 ₽",
    status: "verified",
    views: 189,
    description: "Инновационный метод очистки промышленных стоков с применением наноматериалов.",
  },
  {
    id: "3",
    title: "CRM-система для логистики",
    category: "software",
    categoryLabel: "Программы и код",
    registrationNumber: "2024612345",
    price: 890000,
    priceFormatted: "890 000 ₽",
    status: "verified",
    views: 312,
    description: "Готовое решение для автоматизации логистических процессов с исходным кодом.",
  },
  {
    id: "4",
    title: "Дизайн упаковки косметики",
    category: "industrial",
    categoryLabel: "Промышленные образцы",
    registrationNumber: "№ 128934",
    price: 280000,
    priceFormatted: "280 000 ₽",
    status: "pending",
    views: 156,
    description: "Оригинальный дизайн упаковки для линейки косметических средств.",
  },
  {
    id: "5",
    title: "Товарный знак «SmartHome»",
    category: "trademarks",
    categoryLabel: "Товарные знаки",
    registrationNumber: "№ 912456",
    price: 680000,
    priceFormatted: "680 000 ₽",
    status: "verified",
    views: 421,
    description: "Международный товарный знак в категории умный дом и IoT устройства.",
  },
  {
    id: "6",
    title: "Патент на медицинское устройство",
    category: "patents",
    categoryLabel: "Патенты",
    registrationNumber: "RU 2789456",
    price: 3500000,
    priceFormatted: "3 500 000 ₽",
    status: "verified",
    views: 267,
    description: "Уникальное устройство для неинвазивной диагностики сердечно-сосудистых заболеваний.",
  },
];

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const categoryFilter = searchParams.get("category") || "all";

  const filteredListings = listings.filter((item) => {
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", value);
    }
    setSearchParams(searchParams);
  };

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-wide">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Каталог интеллектуальной собственности</h1>
            <p className="text-muted-foreground">
              {filteredListings.length} объектов с подтверждённой документацией
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 rounded-xl bg-surface-subtle border border-border">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию или описанию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Фильтры
            </Button>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item) => (
              <Link
                key={item.id}
                to={`/catalog/${item.id}`}
                className="group card-elevated p-6 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary" className="badge-category">
                    {item.categoryLabel}
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

                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                  {item.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Рег. номер</p>
                    <p className="text-sm font-medium">{item.registrationNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">Цена</p>
                    <p className="text-lg font-bold text-primary">{item.priceFormatted}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-4 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  {item.views} просмотров
                </div>
              </Link>
            ))}
          </div>

          {filteredListings.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">
                По вашему запросу ничего не найдено
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setSearchParams(new URLSearchParams());
              }}>
                Сбросить фильтры
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Catalog;
