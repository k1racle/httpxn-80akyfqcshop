import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const ADMIN_EMAIL = "a0177701a@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  type: "new_order" | "status_update";
  orderId?: string;
  to?: string;
  customerName?: string;
  orderName: string;
  orderCategory: string;
  orderPrice: number;
  status: string;
  paymentUrl?: string;
  paymentExpiresAt?: string;
  buyerType?: string;
  buyerInfo?: any;
  wantsInstallment?: boolean;
  sellerId?: string;
  sellerEmail?: string;
}

const getStatusInfo = (status: string) => {
  const statusMap: Record<string, { label: string; description: string; color: string }> = {
    pending: {
      label: "Заявка получена",
      description: "Ваша заявка принята и ожидает обработки менеджером.",
      color: "#F59E0B",
    },
    manager_review: {
      label: "На рассмотрении",
      description: "Менеджер проверяет доступность объекта и готовит сделку.",
      color: "#3B82F6",
    },
    payment_ready: {
      label: "Готов к оплате",
      description: "Объект подтверждён и готов к покупке. Оплатите в течение 30 минут.",
      color: "#10B981",
    },
    payment_expired: {
      label: "Срок оплаты истёк",
      description: "К сожалению, срок оплаты истёк. Свяжитесь с нами для повторного оформления.",
      color: "#EF4444",
    },
    paid: {
      label: "Оплачен",
      description: "Оплата получена! Мы начинаем оформление передачи прав.",
      color: "#059669",
    },
    completed: {
      label: "Сделка завершена",
      description: "Поздравляем! Права на объект успешно переданы.",
      color: "#6B7280",
    },
    cancelled: {
      label: "Отменён",
      description: "Заказ был отменён. Если у вас есть вопросы, свяжитесь с нами.",
      color: "#9CA3AF",
    },
  };

  return statusMap[status] || { label: status, description: "", color: "#6B7280" };
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
};

const sendEmail = async (to: string, subject: string, html: string) => {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "патент.shop <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });
  return res.json();
};

const createBuyerEmailHtml = (data: OrderNotificationRequest) => {
  const statusInfo = getStatusInfo(data.status);
  const formattedPrice = formatPrice(data.orderPrice);

  let paymentSection = "";
  if (data.status === "payment_ready" && data.paymentUrl) {
    const expiresTime = data.paymentExpiresAt
      ? new Date(data.paymentExpiresAt).toLocaleString("ru-RU", {
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "30 минут";

    paymentSection = `
      <div style="background: #ECFDF5; border: 1px solid #10B981; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
        <p style="margin: 0 0 15px 0; font-size: 16px; color: #065F46;">
          <strong>Срок оплаты до: ${expiresTime}</strong>
        </p>
        <a href="${data.paymentUrl}" 
           style="display: inline-block; background: #10B981; color: white; padding: 14px 28px; 
                  text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
          Оплатить ${formattedPrice}
        </a>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                 line-height: 1.6; color: #1F2937; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #111827; margin: 0; font-size: 24px;">
          патент<span style="color: #2563EB;">.shop</span>
        </h1>
      </div>

      <div style="background: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 30px;">
        <p style="margin: 0 0 20px 0; font-size: 16px;">
          Здравствуйте, <strong>${data.customerName}</strong>!
        </p>

        <div style="background: ${statusInfo.color}15; border-left: 4px solid ${statusInfo.color}; 
                    padding: 15px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-weight: bold; color: ${statusInfo.color}; font-size: 18px;">
            ${statusInfo.label}
          </p>
          <p style="margin: 10px 0 0 0; color: #4B5563;">
            ${statusInfo.description}
          </p>
        </div>

        <div style="background: #F9FAFB; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 14px; text-transform: uppercase;">
            Детали заказа
          </h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6B7280;">Объект:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 500;">${data.orderName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6B7280;">Категория:</td>
              <td style="padding: 8px 0; text-align: right;">${data.orderCategory}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6B7280;">Сумма:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #2563EB; font-size: 18px;">
                ${formattedPrice}
              </td>
            </tr>
          </table>
        </div>

        ${paymentSection}

        <p style="margin: 20px 0 0 0; color: #6B7280; font-size: 14px;">
          Если у вас есть вопросы, свяжитесь с нами по адресу 
          <a href="mailto:support@patent.shop" style="color: #2563EB;">support@patent.shop</a>
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px; color: #9CA3AF; font-size: 12px;">
        <p>© ${new Date().getFullYear()} патент.shop — Маркетплейс интеллектуальной собственности</p>
      </div>
    </body>
    </html>
  `;
};

const createSellerEmailHtml = (data: OrderNotificationRequest) => {
  const formattedPrice = formatPrice(data.orderPrice);
  const buyerTypeLabel = data.buyerType === "company" ? "Юридическое лицо" : "Физическое лицо";
  const installmentLabel = data.wantsInstallment ? "✓ Запрошена рассрочка" : "";

  let buyerDetails = "";
  if (data.buyerInfo) {
    if (data.buyerType === "company") {
      buyerDetails = `
        <tr><td style="padding: 8px 0; color: #6B7280;">Компания:</td><td style="padding: 8px 0; text-align: right;">${data.buyerInfo.company_name || "-"}</td></tr>
        <tr><td style="padding: 8px 0; color: #6B7280;">ИНН:</td><td style="padding: 8px 0; text-align: right;">${data.buyerInfo.inn || "-"}</td></tr>
        <tr><td style="padding: 8px 0; color: #6B7280;">Контакт:</td><td style="padding: 8px 0; text-align: right;">${data.buyerInfo.contact_person || "-"}</td></tr>
      `;
    } else {
      buyerDetails = `
        <tr><td style="padding: 8px 0; color: #6B7280;">ФИО:</td><td style="padding: 8px 0; text-align: right;">${data.buyerInfo.full_name || "-"}</td></tr>
      `;
    }
    buyerDetails += `
      <tr><td style="padding: 8px 0; color: #6B7280;">Телефон:</td><td style="padding: 8px 0; text-align: right;">${data.buyerInfo.phone || "-"}</td></tr>
      <tr><td style="padding: 8px 0; color: #6B7280;">Email:</td><td style="padding: 8px 0; text-align: right;">${data.buyerInfo.email || "-"}</td></tr>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                 line-height: 1.6; color: #1F2937; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #111827; margin: 0; font-size: 24px;">
          патент<span style="color: #2563EB;">.shop</span>
        </h1>
      </div>

      <div style="background: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 30px;">
        <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-weight: bold; color: #92400E; font-size: 18px;">
            🎉 Новая заявка на покупку!
          </p>
          <p style="margin: 10px 0 0 0; color: #92400E;">
            Кто-то хочет приобрести ваш объект интеллектуальной собственности.
          </p>
        </div>

        <div style="background: #F9FAFB; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 14px; text-transform: uppercase;">
            Объект ИС
          </h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6B7280;">Название:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 500;">${data.orderName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6B7280;">Категория:</td>
              <td style="padding: 8px 0; text-align: right;">${data.orderCategory}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6B7280;">Сумма сделки:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #059669; font-size: 18px;">
                ${formattedPrice}
              </td>
            </tr>
          </table>
        </div>

        <div style="background: #F9FAFB; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 14px; text-transform: uppercase;">
            Покупатель (${buyerTypeLabel})
          </h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${buyerDetails}
          </table>
          ${installmentLabel ? `<p style="margin: 15px 0 0 0; color: #2563EB; font-weight: 500;">${installmentLabel}</p>` : ""}
        </div>

        <p style="margin: 20px 0 0 0; color: #6B7280; font-size: 14px;">
          Менеджер платформы свяжется с вами для подтверждения сделки.
          Если у вас есть вопросы, напишите на 
          <a href="mailto:support@patent.shop" style="color: #2563EB;">support@patent.shop</a>
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px; color: #9CA3AF; font-size: 12px;">
        <p>© ${new Date().getFullYear()} патент.shop — Маркетплейс интеллектуальной собственности</p>
      </div>
    </body>
    </html>
  `;
};

const createAdminEmailHtml = (data: OrderNotificationRequest, buyerEmail: string) => {
  const formattedPrice = formatPrice(data.orderPrice);
  const buyerTypeLabel = data.buyerType === "company" ? "Юридическое лицо" : "Физическое лицо";
  const installmentLabel = data.wantsInstallment ? "✓ ДА" : "Нет";

  let buyerDetails = "";
  if (data.buyerInfo) {
    if (data.buyerType === "company") {
      buyerDetails = `
        <tr><td style="padding: 8px 0; color: #6B7280;">Компания:</td><td style="padding: 8px 0; text-align: right;">${data.buyerInfo.company_name || "-"}</td></tr>
        <tr><td style="padding: 8px 0; color: #6B7280;">ИНН:</td><td style="padding: 8px 0; text-align: right;">${data.buyerInfo.inn || "-"}</td></tr>
        <tr><td style="padding: 8px 0; color: #6B7280;">Контакт:</td><td style="padding: 8px 0; text-align: right;">${data.buyerInfo.contact_person || "-"}</td></tr>
      `;
    } else {
      buyerDetails = `
        <tr><td style="padding: 8px 0; color: #6B7280;">ФИО:</td><td style="padding: 8px 0; text-align: right;">${data.buyerInfo.full_name || "-"}</td></tr>
      `;
    }
    buyerDetails += `
      <tr><td style="padding: 8px 0; color: #6B7280;">Телефон:</td><td style="padding: 8px 0; text-align: right;">${data.buyerInfo.phone || "-"}</td></tr>
      <tr><td style="padding: 8px 0; color: #6B7280;">Email:</td><td style="padding: 8px 0; text-align: right;">${data.buyerInfo.email || "-"}</td></tr>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                 line-height: 1.6; color: #1F2937; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #111827; margin: 0; font-size: 24px;">
          патент<span style="color: #2563EB;">.shop</span> — ADMIN
        </h1>
      </div>

      <div style="background: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 30px;">
        <div style="background: #DBEAFE; border-left: 4px solid #2563EB; padding: 15px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-weight: bold; color: #1E40AF; font-size: 18px;">
            📋 Новая заявка на покупку
          </p>
          <p style="margin: 10px 0 0 0; color: #1E40AF;">
            Требуется обработка и связь с продавцом и покупателем.
          </p>
        </div>

        <div style="background: #F9FAFB; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 14px; text-transform: uppercase;">
            Объект ИС
          </h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6B7280;">Название:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 500;">${data.orderName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6B7280;">Категория:</td>
              <td style="padding: 8px 0; text-align: right;">${data.orderCategory}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6B7280;">Сумма:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #059669; font-size: 18px;">
                ${formattedPrice}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6B7280;">Рассрочка:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 500; ${data.wantsInstallment ? 'color: #2563EB;' : ''}">${installmentLabel}</td>
            </tr>
          </table>
        </div>

        <div style="background: #FEF3C7; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 15px 0; color: #92400E; font-size: 14px; text-transform: uppercase;">
            Продавец
          </h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #92400E;">Email:</td>
              <td style="padding: 8px 0; text-align: right;">${data.sellerEmail || "Не определен"}</td>
            </tr>
          </table>
        </div>

        <div style="background: #ECFDF5; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 15px 0; color: #065F46; font-size: 14px; text-transform: uppercase;">
            Покупатель (${buyerTypeLabel})
          </h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${buyerDetails}
          </table>
        </div>

        <p style="margin: 20px 0 0 0; color: #6B7280; font-size: 14px;">
          <a href="https://httpxn-80akyfqcshop.lovable.app/admin" style="color: #2563EB; font-weight: bold;">
            Перейти в панель администратора →
          </a>
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px; color: #9CA3AF; font-size: 12px;">
        <p>© ${new Date().getFullYear()} патент.shop — Административное уведомление</p>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: OrderNotificationRequest = await req.json();
    const results: any[] = [];

    // For new orders, send notifications to seller and admin
    if (data.type === "new_order") {
      // Get seller info if we have listing_id
      let sellerEmail = data.sellerEmail;
      
      if (!sellerEmail && data.sellerId && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        const { data: userData } = await supabase.auth.admin.getUserById(data.sellerId);
        sellerEmail = userData?.user?.email;
      }

      // Send to seller if we have their email
      if (sellerEmail) {
        const sellerHtml = createSellerEmailHtml({ ...data, sellerEmail });
        const sellerResult = await sendEmail(
          sellerEmail,
          `Новая заявка на покупку: ${data.orderName}`,
          sellerHtml
        );
        results.push({ type: "seller", result: sellerResult });
        console.log("Seller email sent:", sellerResult);
      }

      // Send to admin
      const buyerEmail = data.buyerInfo?.email || data.to || "";
      const adminHtml = createAdminEmailHtml({ ...data, sellerEmail }, buyerEmail);
      const adminResult = await sendEmail(
        ADMIN_EMAIL,
        `[ADMIN] Новая заявка: ${data.orderName} — ${formatPrice(data.orderPrice)}`,
        adminHtml
      );
      results.push({ type: "admin", result: adminResult });
      console.log("Admin email sent:", adminResult);

    } else {
      // Status update - send to buyer
      if (data.to && data.customerName) {
        const buyerHtml = createBuyerEmailHtml(data);
        const statusInfo = getStatusInfo(data.status);
        const buyerResult = await sendEmail(
          data.to,
          `${statusInfo.label} — ${data.orderName}`,
          buyerHtml
        );
        results.push({ type: "buyer", result: buyerResult });
        console.log("Buyer email sent:", buyerResult);
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending order notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
