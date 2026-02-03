import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RefreshCw,
  Package,
  Pencil,
  Eye,
  Heart,
  ShoppingCart,
  Search,
} from "lucide-react";
import { useAdminListings, IpListing } from "@/hooks/useAdminListings";
import ListingEditDialog from "./ListingEditDialog";

const formatPrice = (price: number | null) => {
  if (!price) return "Договорная";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const listingStatuses = [
  { value: "all", label: "Все статусы" },
  { value: "active", label: "Активен", color: "bg-green-100 text-green-800" },
  { value: "published", label: "Опубликован", color: "bg-emerald-100 text-emerald-800" },
  { value: "sold", label: "Продан", color: "bg-gray-100 text-gray-800" },
  { value: "archived", label: "В архиве", color: "bg-gray-100 text-gray-500" },
];

const categories = [
  { value: "all", label: "Все категории" },
  { value: "trademark", label: "Товарный знак" },
  { value: "patent", label: "Патент" },
  { value: "software", label: "Программа для ЭВМ" },
  { value: "design", label: "Промышленный образец" },
  { value: "other", label: "Другое" },
];

const getStatusBadge = (status: string) => {
  const statusInfo = listingStatuses.find((s) => s.value === status);
  return (
    <Badge className={statusInfo?.color || "bg-gray-100 text-gray-800"}>
      {statusInfo?.label || status}
    </Badge>
  );
};

const CatalogTab = () => {
  const { listings, loading, updateListing, deleteListing, refetch } =
    useAdminListings();
  const [selectedListing, setSelectedListing] = useState<IpListing | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.registration_number?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || listing.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || listing.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Каталог объектов ИС</h2>
        <Button variant="outline" size="sm" onClick={refetch}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Обновить
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию или номеру..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            {listingStatuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded" />
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {listings.length === 0
              ? "В каталоге пока нет объектов"
              : "Нет объектов по заданным фильтрам"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{listing.name}</h3>
                    {getStatusBadge(listing.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {categories.find((c) => c.value === listing.category)?.label ||
                      listing.category}
                    {listing.registration_number &&
                      ` • ${listing.registration_number}`}
                    {` • ${formatDate(listing.created_at)}`}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {listing.views_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {listing.favorites_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <ShoppingCart className="h-4 w-4" />
                      {listing.cart_count || 0}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      {formatPrice(listing.price)}
                    </p>
                    {listing.price_negotiable && (
                      <p className="text-xs text-muted-foreground">договорная</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedListing(listing)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ListingEditDialog
        listing={selectedListing}
        open={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        onSave={updateListing}
        onDelete={deleteListing}
      />
    </div>
  );
};

export default CatalogTab;
