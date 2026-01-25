import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, User, Building2, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface CartItemWithListing {
  id: string;
  listing_id: string;
  listing?: {
    id: string;
    name: string;
    category: string;
    price: number | null;
    description?: string | null;
  };
}

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItemWithListing[];
  onSuccess: () => void;
}

const formatPrice = (price: number | null) => {
  if (!price) return "Договорная";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
};

const CheckoutDialog = ({ open, onOpenChange, cartItems, onSuccess }: CheckoutDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"type" | "details">("type");
  const [buyerType, setBuyerType] = useState<"individual" | "company">("individual");
  
  // Individual fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  
  // Company fields
  const [companyName, setCompanyName] = useState("");
  const [inn, setInn] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState(user?.email || "");
  
  const [comment, setComment] = useState("");

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.listing?.price || 0), 0);

  const resetForm = () => {
    setStep("type");
    setBuyerType("individual");
    setFullName("");
    setPhone("");
    setEmail(user?.email || "");
    setCompanyName("");
    setInn("");
    setContactPerson("");
    setCompanyPhone("");
    setCompanyEmail(user?.email || "");
    setComment("");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!user) return;

    // Validate fields
    if (buyerType === "individual") {
      if (!fullName.trim() || !phone.trim() || !email.trim()) {
        toast({
          title: "Заполните все обязательные поля",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!companyName.trim() || !inn.trim() || !contactPerson.trim() || !companyEmail.trim()) {
        toast({
          title: "Заполните все обязательные поля",
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);

    try {
      // Create orders for each cart item
      for (const item of cartItems) {
        if (!item.listing) continue;

        const orderData = {
          user_id: user.id,
          listing_id: item.listing.id,
          listing_snapshot: {
            id: item.listing.id,
            name: item.listing.name,
            category: item.listing.category,
            price: item.listing.price,
            description: item.listing.description,
            buyer_type: buyerType,
            buyer_info: buyerType === "individual" 
              ? { full_name: fullName, phone, email }
              : { company_name: companyName, inn, contact_person: contactPerson, phone: companyPhone, email: companyEmail },
            comment: comment,
          },
          price: item.listing.price || 0,
          contact_email: buyerType === "individual" ? email : companyEmail,
          status: "pending" as const,
        };

        const { error } = await supabase.from("orders").insert(orderData);
        if (error) throw error;

        // Remove from cart
        await supabase.from("cart_items").delete().eq("id", item.id);
      }

      toast({
        title: "Заявка успешно оформлена!",
        description: "Менеджер свяжется с вами в ближайшее время для подтверждения заказа.",
      });

      handleClose();
      onSuccess();
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Ошибка оформления заявки",
        description: error.message || "Попробуйте позже",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Оформление заявки на покупку</DialogTitle>
          <DialogDescription>
            {step === "type" 
              ? "Выберите, как вы будете оформлять покупку"
              : `Заполните контактные данные ${buyerType === "individual" ? "физического лица" : "юридического лица"}`
            }
          </DialogDescription>
        </DialogHeader>

        {step === "type" ? (
          <div className="space-y-6">
            <RadioGroup
              value={buyerType}
              onValueChange={(value) => setBuyerType(value as "individual" | "company")}
              className="space-y-4"
            >
              <label
                className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  buyerType === "individual" 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <RadioGroupItem value="individual" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-medium">
                    <User className="h-5 w-5" />
                    Физическое лицо
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Покупка как частное лицо. Оплата картой или переводом.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  buyerType === "company" 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <RadioGroupItem value="company" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-medium">
                    <Building2 className="h-5 w-5" />
                    Юридическое лицо
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Покупка от компании. Оплата по счёту с НДС.
                  </p>
                </div>
              </label>
            </RadioGroup>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Объектов в заказе:</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span>Итого:</span>
                <span className="text-xl text-primary">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <Button variant="hero" size="lg" className="w-full" onClick={() => setStep("details")}>
              Продолжить
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {buyerType === "individual" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">ФИО *</Label>
                  <Input
                    id="fullName"
                    placeholder="Иванов Иван Иванович"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Название компании *</Label>
                  <Input
                    id="companyName"
                    placeholder='ООО "Компания"'
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inn">ИНН *</Label>
                  <Input
                    id="inn"
                    placeholder="1234567890"
                    value={inn}
                    onChange={(e) => setInn(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Контактное лицо *</Label>
                  <Input
                    id="contactPerson"
                    placeholder="Иванов Иван Иванович"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Телефон</Label>
                    <Input
                      id="companyPhone"
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Email *</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      placeholder="company@example.com"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="comment">Комментарий к заказу</Label>
              <Textarea
                id="comment"
                placeholder="Дополнительная информация..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between font-semibold mb-4">
                <span>Итого:</span>
                <span className="text-xl text-primary">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("type")} className="flex-1">
                  Назад
                </Button>
                <Button 
                  variant="hero" 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Оформление...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Оформить заявку
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
