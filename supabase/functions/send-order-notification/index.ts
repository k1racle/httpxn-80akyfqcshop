import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  to: string;
  customerName: string;
  orderName: string;
  orderCategory: string;
  orderPrice: number;
  status: string;
  paymentUrl?: string;
  paymentExpiresAt?: string;
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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      to,
      customerName,
      orderName,
      orderCategory,
      orderPrice,
      status,
      paymentUrl,
      paymentExpiresAt,
    }: OrderNotificationRequest = await req.json();

    const statusInfo = getStatusInfo(status);
    const formattedPrice = formatPrice(orderPrice);

    let paymentSection = "";
    if (status === "payment_ready" && paymentUrl) {
      const expiresTime = paymentExpiresAt
        ? new Date(paymentExpiresAt).toLocaleString("ru-RU", {
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
          <a href="${paymentUrl}" 
             style="display: inline-block; background: #10B981; color: white; padding: 14px 28px; 
                    text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Оплатить ${formattedPrice}
          </a>
        </div>
      `;
    }

    const emailHtml = `
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
            Здравствуйте, <strong>${customerName}</strong>!
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
                <td style="padding: 8px 0; text-align: right; font-weight: 500;">${orderName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7280;">Категория:</td>
                <td style="padding: 8px 0; text-align: right;">${orderCategory}</td>
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

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "патент.shop <onboarding@resend.dev>",
        to: [to],
        subject: `${statusInfo.label} — ${orderName}`,
        html: emailHtml,
      }),
    });

    const emailResponse = await res.json();

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
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
