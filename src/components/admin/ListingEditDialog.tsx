import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { IpListing } from "@/hooks/useAdminListings";

const categories = [
  { value: "trademark", label: "Товарный знак" },
  { value: "patent", label: "Патент" },
  { value: "software", label: "Программа для ЭВМ" },
  { value: "design", label: "Промышленный образец" },
  { value: "other", label: "Другое" },
];

const listingStatuses = [
  { value: "active", label: "Активен" },
  { value: "published", label: "Опубликован" },
  { value: "sold", label: "Продан" },
  { value: "archived", label: "В архиве" },
];

interface ListingEditDialogProps {
  listing: IpListing | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<IpListing>) => Promise<boolean>;
  onDelete?: (id: string) => Promise<boolean>;
}

const ListingEditDialog = ({
  listing,
  open,
  onClose,
  onSave,
  onDelete,
}: ListingEditDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    price_negotiable: false,
    registration_number: "",
    status: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (listing) {
      setFormData({
        name: listing.name || "",
        description: listing.description || "",
        category: listing.category || "",
        price: listing.price?.toString() || "",
        price_negotiable: listing.price_negotiable || false,
        registration_number: listing.registration_number || "",
        status: listing.status || "published",
      });
    }
  }, [listing]);

  const handleSave = async () => {
    if (!listing) return;
    setSaving(true);
    const success = await onSave(listing.id, {
      name: formData.name,
      description: formData.description || null,
      category: formData.category,
      price: formData.price ? parseFloat(formData.price) : null,
      price_negotiable: formData.price_negotiable,
      registration_number: formData.registration_number || null,
      status: formData.status,
    });
    setSaving(false);
    if (success) {
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!listing || !onDelete) return;
    if (confirm("Вы уверены, что хотите удалить этот объект из каталога?")) {
      const success = await onDelete(listing.id);
      if (success) {
        onClose();
      }
    }
  };

  if (!listing) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактирование объекта</DialogTitle>
          <DialogDescription>
            Измените данные объекта в каталоге
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Название</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Название объекта ИС"
            />
          </div>

          <div className="space-y-2">
            <Label>Категория</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
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

          <div className="space-y-2">
            <Label>Номер регистрации</Label>
            <Input
              value={formData.registration_number}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  registration_number: e.target.value,
                }))
              }
              placeholder="№ 123456"
            />
          </div>

          <div className="space-y-2">
            <Label>Описание</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Подробное описание объекта..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Цена (₽)</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Статус</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {listingStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="price_negotiable"
              checked={formData.price_negotiable}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, price_negotiable: checked }))
              }
            />
            <Label htmlFor="price_negotiable">Цена договорная</Label>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
            <p className="text-muted-foreground">
              Просмотры: <span className="font-medium text-foreground">{listing.views_count || 0}</span>
            </p>
            <p className="text-muted-foreground">
              В избранном: <span className="font-medium text-foreground">{listing.favorites_count || 0}</span>
            </p>
            <p className="text-muted-foreground">
              В корзинах: <span className="font-medium text-foreground">{listing.cart_count || 0}</span>
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {onDelete && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="sm:mr-auto"
            >
              Удалить
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ListingEditDialog;
