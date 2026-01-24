import { useState } from "react";
import { Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Package,
  Search,
  ClipboardList,
  ShoppingCart,
  RefreshCw,
  Eye,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import {
  useAdminSubmissions,
  useAdminRequests,
  useAdminOrders,
  IpSubmission,
  IpRequest,
  AdminOrder,
  SubmissionStatus,
  RequestStatus,
  OrderStatusType,
} from "@/hooks/useAdminData";

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
    hour: "2-digit",
    minute: "2-digit",
  });
};

const submissionStatuses = [
  { value: "pending", label: "Ожидает", color: "bg-yellow-100 text-yellow-800" },
  { value: "reviewing", label: "На проверке", color: "bg-blue-100 text-blue-800" },
  { value: "approved", label: "Одобрена", color: "bg-green-100 text-green-800" },
  { value: "rejected", label: "Отклонена", color: "bg-red-100 text-red-800" },
  { value: "published", label: "Опубликована", color: "bg-emerald-100 text-emerald-800" },
  { value: "sold", label: "Продана", color: "bg-gray-100 text-gray-800" },
];

const requestStatuses = [
  { value: "pending", label: "Ожидает", color: "bg-yellow-100 text-yellow-800" },
  { value: "in_progress", label: "В работе", color: "bg-blue-100 text-blue-800" },
  { value: "completed", label: "Выполнена", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Отменена", color: "bg-gray-100 text-gray-500" },
];

const orderStatuses = [
  { value: "pending", label: "Ожидает", color: "bg-yellow-100 text-yellow-800" },
  { value: "manager_review", label: "На рассмотрении", color: "bg-blue-100 text-blue-800" },
  { value: "payment_ready", label: "Готов к оплате", color: "bg-green-100 text-green-800" },
  { value: "payment_expired", label: "Срок истёк", color: "bg-red-100 text-red-800" },
  { value: "paid", label: "Оплачен", color: "bg-emerald-100 text-emerald-800" },
  { value: "completed", label: "Завершён", color: "bg-gray-100 text-gray-800" },
  { value: "cancelled", label: "Отменён", color: "bg-gray-100 text-gray-500" },
];

const getStatusBadge = (
  status: string,
  statusList: { value: string; label: string; color: string }[]
) => {
  const statusInfo = statusList.find((s) => s.value === status);
  return (
    <Badge className={statusInfo?.color || "bg-gray-100 text-gray-800"}>
      {statusInfo?.label || status}
    </Badge>
  );
};

const Admin = () => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const {
    submissions,
    loading: submissionsLoading,
    updateSubmissionStatus,
    refetch: refetchSubmissions,
  } = useAdminSubmissions();
  const {
    requests,
    loading: requestsLoading,
    updateRequestStatus,
    refetch: refetchRequests,
  } = useAdminRequests();
  const {
    orders,
    loading: ordersLoading,
    updateOrderStatus,
    refetch: refetchOrders,
  } = useAdminOrders();

  const [selectedSubmission, setSelectedSubmission] = useState<IpSubmission | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<IpRequest | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  if (adminLoading) {
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

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleSubmissionStatusChange = async (id: string, status: SubmissionStatus) => {
    await updateSubmissionStatus(id, status, adminNotes || undefined);
    setSelectedSubmission(null);
    setAdminNotes("");
  };

  const handleRequestStatusChange = async (id: string, status: RequestStatus) => {
    await updateRequestStatus(id, status, adminNotes || undefined);
    setSelectedRequest(null);
    setAdminNotes("");
  };

  const handleOrderStatusChange = async (id: string, status: OrderStatusType) => {
    await updateOrderStatus(
      id,
      status,
      status === "payment_ready" ? paymentUrl : undefined,
      adminNotes || undefined
    );
    setSelectedOrder(null);
    setPaymentUrl("");
    setAdminNotes("");
  };

  const pendingSubmissions = submissions.filter((s) => s.status === "pending").length;
  const pendingRequests = requests.filter((r) => r.status === "pending").length;
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "manager_review").length;

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-wide">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Панель администратора</h1>
            <p className="text-muted-foreground">
              Управление заявками и заказами платформы
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="card-elevated p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingSubmissions}</p>
                <p className="text-sm text-muted-foreground">Заявок на размещение</p>
              </div>
            </div>
            <div className="card-elevated p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingRequests}</p>
                <p className="text-sm text-muted-foreground">Заявок на поиск</p>
              </div>
            </div>
            <div className="card-elevated p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingOrders}</p>
                <p className="text-sm text-muted-foreground">Заказов в обработке</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="orders" className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Заказы</span>
                {pendingOrders > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {pendingOrders}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="submissions" className="gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Размещение</span>
                {pendingSubmissions > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {pendingSubmissions}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="requests" className="gap-2">
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Поиск</span>
                {pendingRequests > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {pendingRequests}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <div className="card-elevated p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Заказы на покупку</h2>
                  <Button variant="outline" size="sm" onClick={refetchOrders}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Обновить
                  </Button>
                </div>

                {ordersLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-muted rounded" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Заказов пока нет</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{order.listing_snapshot.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {order.listing_snapshot.category} • {formatDate(order.created_at)}
                            </p>
                          </div>
                          {getStatusBadge(order.status, orderStatuses)}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-primary">
                            {formatPrice(order.price)}
                          </div>
                          <div className="flex gap-2">
                            {order.status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateOrderStatus(order.id, "manager_review")
                                }
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Взять в работу
                              </Button>
                            )}
                            {order.status === "manager_review" && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setPaymentUrl("");
                                  setAdminNotes(order.admin_notes || "");
                                }}
                              >
                                <CreditCard className="h-4 w-4 mr-1" />
                                Подтвердить оплату
                              </Button>
                            )}
                            {order.status === "paid" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateOrderStatus(order.id, "completed")
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Завершить
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedOrder(order);
                                setAdminNotes(order.admin_notes || "");
                              }}
                            >
                              Детали
                            </Button>
                          </div>
                        </div>

                        {order.payment_expires_at && order.status === "payment_ready" && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-amber-600">
                            <Clock className="h-4 w-4" />
                            Срок оплаты до:{" "}
                            {new Date(order.payment_expires_at).toLocaleString("ru-RU")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Submissions Tab */}
            <TabsContent value="submissions">
              <div className="card-elevated p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Заявки на размещение ИС</h2>
                  <Button variant="outline" size="sm" onClick={refetchSubmissions}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Обновить
                  </Button>
                </div>

                {submissionsLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-muted rounded" />
                    ))}
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Заявок пока нет</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <div
                        key={submission.id}
                        className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{submission.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {submission.category} • {formatDate(submission.created_at)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {submission.contact_name} • {submission.contact_email}
                            </p>
                          </div>
                          {getStatusBadge(submission.status, submissionStatuses)}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-primary">
                            {formatPrice(submission.price)}
                          </div>
                          <div className="flex gap-2">
                            {submission.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    updateSubmissionStatus(submission.id, "reviewing")
                                  }
                                >
                                  На проверку
                                </Button>
                              </>
                            )}
                            {submission.status === "reviewing" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    updateSubmissionStatus(submission.id, "approved")
                                  }
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Одобрить
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    setSelectedSubmission(submission);
                                    setAdminNotes("");
                                  }}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Отклонить
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedSubmission(submission);
                                setAdminNotes(submission.admin_notes || "");
                              }}
                            >
                              Детали
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Requests Tab */}
            <TabsContent value="requests">
              <div className="card-elevated p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Заявки на поиск ИС</h2>
                  <Button variant="outline" size="sm" onClick={refetchRequests}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Обновить
                  </Button>
                </div>

                {requestsLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-muted rounded" />
                    ))}
                  </div>
                ) : requests.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Заявок пока нет</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <div
                        key={request.id}
                        className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{request.category}</h3>
                              {request.urgent && (
                                <Badge variant="destructive" className="gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Срочно
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                              {request.description}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {request.contact_name} • {request.contact_email} •{" "}
                              {formatDate(request.created_at)}
                            </p>
                          </div>
                          {getStatusBadge(request.status, requestStatuses)}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            Бюджет: {formatPrice(request.budget_min)} —{" "}
                            {formatPrice(request.budget_max)}
                          </div>
                          <div className="flex gap-2">
                            {request.status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateRequestStatus(request.id, "in_progress")
                                }
                              >
                                Взять в работу
                              </Button>
                            )}
                            {request.status === "in_progress" && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  updateRequestStatus(request.id, "completed")
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Выполнено
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedRequest(request);
                                setAdminNotes(request.admin_notes || "");
                              }}
                            >
                              Детали
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Детали заказа</DialogTitle>
            <DialogDescription>
              {selectedOrder?.listing_snapshot.name}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Категория</p>
                  <p className="font-medium">{selectedOrder.listing_snapshot.category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Сумма</p>
                  <p className="font-medium">{formatPrice(selectedOrder.price)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Статус</p>
                  {getStatusBadge(selectedOrder.status, orderStatuses)}
                </div>
                <div>
                  <p className="text-muted-foreground">Дата</p>
                  <p className="font-medium">{formatDate(selectedOrder.created_at)}</p>
                </div>
              </div>

              {selectedOrder.status === "manager_review" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ссылка на оплату (ЮKassa)</label>
                  <Input
                    placeholder="https://yookassa.ru/..."
                    value={paymentUrl}
                    onChange={(e) => setPaymentUrl(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Заметки администратора</label>
                <Textarea
                  placeholder="Внутренние заметки..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Изменить статус</label>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) =>
                    handleOrderStatusChange(selectedOrder.id, value as OrderStatusType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {orderStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submission Details Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Детали заявки</DialogTitle>
            <DialogDescription>{selectedSubmission?.name}</DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Категория</p>
                  <p className="font-medium">{selectedSubmission.category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Цена</p>
                  <p className="font-medium">{formatPrice(selectedSubmission.price)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Контакт</p>
                  <p className="font-medium">{selectedSubmission.contact_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedSubmission.contact_email}</p>
                </div>
              </div>

              {selectedSubmission.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Описание</p>
                  <p className="text-sm">{selectedSubmission.description}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Заметки администратора</label>
                <Textarea
                  placeholder="Причина отклонения или другие заметки..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Изменить статус</label>
                <Select
                  value={selectedSubmission.status}
                  onValueChange={(value) =>
                    handleSubmissionStatusChange(selectedSubmission.id, value as SubmissionStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {submissionStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Детали заявки на поиск</DialogTitle>
            <DialogDescription>{selectedRequest?.category}</DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Бюджет от</p>
                  <p className="font-medium">{formatPrice(selectedRequest.budget_min)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Бюджет до</p>
                  <p className="font-medium">{formatPrice(selectedRequest.budget_max)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Контакт</p>
                  <p className="font-medium">{selectedRequest.contact_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedRequest.contact_email}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Описание</p>
                <p className="text-sm">{selectedRequest.description}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Заметки администратора</label>
                <Textarea
                  placeholder="Заметки по работе с заявкой..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Изменить статус</label>
                <Select
                  value={selectedRequest.status}
                  onValueChange={(value) =>
                    handleRequestStatusChange(selectedRequest.id, value as RequestStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {requestStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Admin;
