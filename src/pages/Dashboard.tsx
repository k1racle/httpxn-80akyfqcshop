import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  ShoppingCart, 
  Package, 
  ClipboardList,
  Eye,
  TrendingUp,
  Users,
  Trash2,
  ExternalLink,
  BarChart3
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { useMyListings, Listing } from "@/hooks/useListings";
import { useOrders, getStatusLabel, getStatusColor, Order } from "@/hooks/useOrders";
import { supabase } from "@/integrations/supabase/client";

const formatPrice = (price: number | null) => {
  if (!price) return "Договорная";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
};

interface FavoriteWithListing {
  id: string;
  listing_id: string;
  listing?: Listing;
}

interface CartItemWithListing {
  id: string;
  listing_id: string;
  listing?: Listing;
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const { cartItems, toggleCart } = useCart();
  const { listings: myListings, loading: listingsLoading } = useMyListings();
  const { orders, loading: ordersLoading } = useOrders();

  const [favoritesWithListings, setFavoritesWithListings] = useState<FavoriteWithListing[]>([]);
  const [cartWithListings, setCartWithListings] = useState<CartItemWithListing[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchListingsData = async () => {
      if (favorites.length === 0 && cartItems.length === 0) {
        setLoadingData(false);
        return;
      }

      const allListingIds = [
        ...favorites.map((f) => f.listing_id),
        ...cartItems.map((c) => c.listing_id),
      ];
      const uniqueIds = [...new Set(allListingIds)];

      if (uniqueIds.length === 0) {
        setLoadingData(false);
        return;
      }

      try {
        const { data: listingsData } = await supabase
          .from("ip_listings")
          .select("*")
          .in("id", uniqueIds);

        const listingsMap = new Map(
          (listingsData || []).map((l) => [l.id, l])
        );

        setFavoritesWithListings(
          favorites.map((f) => ({
            ...f,
            listing: listingsMap.get(f.listing_id),
          }))
        );

        setCartWithListings(
          cartItems.map((c) => ({
            ...c,
            listing: listingsMap.get(c.listing_id),
          }))
        );
      } catch (error) {
        console.error("Error fetching listings data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchListingsData();
  }, [favorites, cartItems]);

  if (authLoading) {
    return (
      <Layout>
        <div className="container-wide section-padding">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-wide">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Личный кабинет</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>

          <Tabs defaultValue="favorites" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="favorites" className="gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Избранное</span>
                {favorites.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {favorites.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="cart" className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Корзина</span>
                {cartItems.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {cartItems.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="my-listings" className="gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Мои объекты</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <ClipboardList className="h-4 w-4" />
                <span className="hidden sm:inline">Заказы</span>
              </TabsTrigger>
            </TabsList>

            {/* Favorites Tab */}
            <TabsContent value="favorites">
              <div className="card-elevated p-6">
                <h2 className="text-xl font-semibold mb-6">Избранные объекты</h2>
                {loadingData ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-24 bg-muted rounded" />
                    ))}
                  </div>
                ) : favoritesWithListings.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      У вас пока нет избранных объектов
                    </p>
                    <Button asChild>
                      <Link to="/catalog">Перейти в каталог</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {favoritesWithListings.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/catalog/${item.listing_id}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {item.listing?.name || "Объект недоступен"}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {item.listing?.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">
                            {formatPrice(item.listing?.price || null)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => toggleCart(item.listing_id)}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFavorite(item.listing_id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Cart Tab */}
            <TabsContent value="cart">
              <div className="card-elevated p-6">
                <h2 className="text-xl font-semibold mb-6">Корзина</h2>
                {loadingData ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-24 bg-muted rounded" />
                    ))}
                  </div>
                ) : cartWithListings.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Ваша корзина пуста
                    </p>
                    <Button asChild>
                      <Link to="/catalog">Перейти в каталог</Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cartWithListings.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/catalog/${item.listing_id}`}
                              className="font-medium hover:text-primary transition-colors"
                            >
                              {item.listing?.name || "Объект недоступен"}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              {item.listing?.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">
                              {formatPrice(item.listing?.price || null)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleCart(item.listing_id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-medium">Итого:</span>
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(
                            cartWithListings.reduce(
                              (sum, item) => sum + (item.listing?.price || 0),
                              0
                            )
                          )}
                        </span>
                      </div>
                      <Button variant="hero" size="lg" className="w-full">
                        Оформить заявку на покупку
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            {/* My Listings Tab */}
            <TabsContent value="my-listings">
              <div className="card-elevated p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Мои объекты ИС</h2>
                  <Button asChild>
                    <Link to="/sell">Разместить объект</Link>
                  </Button>
                </div>
                {listingsLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-32 bg-muted rounded" />
                    ))}
                  </div>
                ) : myListings.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      У вас пока нет размещённых объектов
                    </p>
                    <Button asChild>
                      <Link to="/sell">Разместить первый объект</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="p-4 rounded-lg border border-border"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-medium">{listing.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {listing.category}
                            </p>
                          </div>
                          <Badge
                            variant={
                              listing.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {listing.status === "active"
                              ? "Активен"
                              : listing.status === "sold"
                              ? "Продан"
                              : "В архиве"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">
                                {listing.views_count}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Просмотров
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">
                                {listing.favorites_count}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                В избранном
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">
                                {listing.cart_count}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                В корзинах
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium text-primary">
                                {formatPrice(listing.price)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Цена
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/catalog/${listing.id}`}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Открыть
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Аналитика
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <div className="card-elevated p-6">
                <h2 className="text-xl font-semibold mb-6">Мои заказы</h2>
                {ordersLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-24 bg-muted rounded" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      У вас пока нет заказов
                    </p>
                    <Button asChild>
                      <Link to="/catalog">Перейти в каталог</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 rounded-lg border border-border"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium">
                              {order.listing_snapshot.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {order.listing_snapshot.category}
                            </p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusLabel(order.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString(
                              "ru-RU"
                            )}
                          </p>
                          <p className="font-semibold text-primary">
                            {formatPrice(order.price)}
                          </p>
                        </div>
                        {order.status === "payment_ready" &&
                          order.payment_url && (
                            <Button
                              variant="hero"
                              size="sm"
                              className="w-full mt-4"
                              asChild
                            >
                              <a
                                href={order.payment_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Оплатить
                              </a>
                            </Button>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
