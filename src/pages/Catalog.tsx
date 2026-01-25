import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal, Loader2 } from "lucide-react";
import ListingCard from "@/components/catalog/ListingCard";
import { useListings, Listing } from "@/hooks/useListings";

const categories = [
  { id: "all", label: "Все категории" },
  { id: "techpacks", label: "Технологические пакеты" },
  { id: "ai-models", label: "Модели ИИ и алгоритмы" },
  { id: "software", label: "ПО, код, IT-продукты" },
  { id: "datasets", label: "Датасеты и выборки" },
  { id: "patents", label: "Патенты" },
  { id: "databases", label: "Базы данных" },
  { id: "knowhow", label: "Ноу-хау" },
  { id: "specifications", label: "Техспецификации" },
  { id: "trademarks", label: "Товарные знаки" },
  { id: "copyrights", label: "Авторские права" },
  { id: "digital-twins", label: "Digital Twins" },
  { id: "prototypes", label: "Прототипы и R&D" },
];

const categoryLabels: Record<string, string> = {
  techpacks: "Технологические пакеты",
  "ai-models": "Модели ИИ и алгоритмы",
  software: "ПО, код, IT-продукты",
  datasets: "Датасеты и выборки",
  patents: "Патенты",
  databases: "Базы данных",
  knowhow: "Ноу-хау",
  specifications: "Техспецификации",
  trademarks: "Товарные знаки",
  copyrights: "Авторские права",
  "digital-twins": "Digital Twins",
  prototypes: "Прототипы и R&D",
};

const formatPrice = (price: number | null): string => {
  if (price === null) return "Договорная";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
};

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const categoryFilter = searchParams.get("category") || "all";
  
  const { listings, loading } = useListings();

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      return matchesCategory && matchesSearch;
    });
  }, [listings, categoryFilter, searchQuery]);

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
              {loading ? "Загрузка..." : `${filteredListings.length} объектов с подтверждённой документацией`}
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
              <SelectTrigger className="w-full sm:w-[240px]">
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

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Listings Grid */}
          {!loading && filteredListings.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((item) => (
                <ListingCard
                  key={item.id}
                  id={item.id}
                  title={item.name}
                  category={item.category}
                  categoryLabel={categoryLabels[item.category] || item.category}
                  registrationNumber={item.registration_number || "—"}
                  price={item.price || 0}
                  priceFormatted={formatPrice(item.price)}
                  status={item.status === "published" ? "verified" : "pending"}
                  views={item.views_count || 0}
                  description={item.description || ""}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredListings.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">
                {listings.length === 0 
                  ? "Пока нет опубликованных объектов. Станьте первым продавцом!"
                  : "По вашему запросу ничего не найдено"
                }
              </p>
              {listings.length === 0 ? (
                <Button asChild>
                  <a href="/sell">Разместить объект</a>
                </Button>
              ) : (
                <Button variant="outline" onClick={() => {
                  setSearchQuery("");
                  setSearchParams(new URLSearchParams());
                }}>
                  Сбросить фильтры
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Catalog;
