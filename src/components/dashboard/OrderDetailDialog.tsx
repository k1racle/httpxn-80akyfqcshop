import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, 
  Package, 
  User, 
  Building2, 
  Phone, 
  Mail, 
  CreditCard,
  Calendar,
  FileText,
  XCircle,
  ExternalLink,
  AlertTriangle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Order, OrderStatus, getStatusLabel, getStatusColor } from "@/hooks/useOrders";

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderUpdated: () => void;
}

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
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const OrderDetailDialog = ({ order, open, onOpenChange, onOrderUpdated }: OrderDetailDialogProps) => {
  const { toast } = useToast();
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!order) return null;

  const snapshot = order.listing_snapshot as any;
  const buyerInfo = snapshot?.buyer_info;
  const buyerType = snapshot?.buyer_type;
  const wantsInstallment = snapshot?.wants_installment;
  const comment = snapshot?.comment;

  const canCancel = order.status === "pending" || order.status === "manager_review";

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", order.id);

      if (error) throw error;

      toast({
        title: "Заказ отменён",
        description: "Ваш заказ был успешно отменён",
      });

      onOpenChange(false);
      onOrderUpdated();
    } catch (error: any) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось отменить заказ",
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
      setShowCancelConfirm(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Детали заказа
          </DialogTitle>
          <DialogDescription>
            Информация о вашей заявке на покупку
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Статус заказа:</span>
            <Badge className={getStatusColor(order.status)}>
              {getStatusLabel(order.status)}
            </Badge>
          </div>

          {/* Object info */}
          <div className="p-4 rounded-lg bg-muted/50 space-y-3">
            <h3 className="font-semibold text-lg">{snapshot.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{snapshot.category}</span>
            </div>
            {snapshot.registration_number && (
              <p className="text-sm text-muted-foreground">
                Рег. номер: {snapshot.registration_number}
              </p>
            )}
            {snapshot.description && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {snapshot.description}
              </p>
            )}
            <div className="text-2xl font-bold text-primary">
              {formatPrice(order.price)}
            </div>
          </div>

          <Separator />

          {/* Buyer info */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              {buyerType === "company" ? (
                <>
                  <Building2 className="h-4 w-4" />
                  Юридическое лицо
                </>
              ) : (
                <>
                  <User className="h-4 w-4" />
                  Физическое лицо
                </>
              )}
            </h4>
            
            {buyerInfo && (
              <div className="text-sm space-y-2 pl-6">
                {buyerType === "company" ? (
                  <>
                    <p><span className="text-muted-foreground">Компания:</span> {buyerInfo.company_name}</p>
                    <p><span className="text-muted-foreground">ИНН:</span> {buyerInfo.inn}</p>
                    <p><span className="text-muted-foreground">Контакт:</span> {buyerInfo.contact_person}</p>
                  </>
                ) : (
                  <p><span className="text-muted-foreground">ФИО:</span> {buyerInfo.full_name}</p>
                )}
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span>{buyerInfo.phone || "Не указан"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span>{buyerInfo.email}</span>
                </div>
              </div>
            )}
          </div>

          {/* Installment */}
          {wantsInstallment && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 text-primary">
              <CreditCard className="h-4 w-4" />
              <span className="text-sm font-medium">Запрошена рассрочка</span>
            </div>
          )}

          {/* Comment */}
          {comment && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Комментарий:</h4>
              <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/50">
                {comment}
              </p>
            </div>
          )}

          <Separator />

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Создан: {formatDate(order.created_at)}</span>
          </div>

          {/* Payment button if ready */}
          {order.status === "payment_ready" && order.payment_url && (
            <Button variant="hero" size="lg" className="w-full" asChild>
              <a href={order.payment_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Оплатить {formatPrice(order.price)}
              </a>
            </Button>
          )}

          {/* Admin notes */}
          {order.admin_notes && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Примечание менеджера:</h4>
              <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/50">
                {order.admin_notes}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {canCancel && !showCancelConfirm && (
            <Button 
              variant="outline" 
              className="text-destructive hover:text-destructive"
              onClick={() => setShowCancelConfirm(true)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Отменить заказ
            </Button>
          )}
          
          {showCancelConfirm && (
            <div className="flex flex-col w-full gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Вы уверены, что хотите отменить заказ?</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1"
                >
                  Нет, оставить
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="flex-1"
                >
                  {cancelling ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Да, отменить"
                  )}
                </Button>
              </div>
            </div>
          )}

          {!showCancelConfirm && (
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Закрыть
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
