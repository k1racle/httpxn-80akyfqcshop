import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface PageMeta {
  title: string;
  description: string;
  keywords?: string;
}

const pageMeta: Record<string, PageMeta> = {
  "/": {
    title: "Патент.Shop — Маркетплейс интеллектуальной собственности",
    description: "Покупайте и продавайте патенты, товарные знаки, ПО и другие объекты ИС с проверенной документацией. Безопасные сделки.",
    keywords: "патенты, интеллектуальная собственность, товарные знаки, лицензии, ноу-хау",
  },
  "/catalog": {
    title: "Каталог ИС — Патенты, товарные знаки, ПО | Патент.Shop",
    description: "Каталог проверенных объектов интеллектуальной собственности: патенты, товарные знаки, программное обеспечение, базы данных.",
    keywords: "каталог патентов, купить патент, товарные знаки, ПО",
  },
  "/sell": {
    title: "Продать патент или ИС — Разместить объявление | Патент.Shop",
    description: "Разместите свой патент, товарный знак или другой объект ИС на продажу. Бесплатная модерация и помощь в оформлении.",
    keywords: "продать патент, разместить ИС, продажа интеллектуальной собственности",
  },
  "/request": {
    title: "Заявка на покупку ИС — Найдём нужный патент | Патент.Shop",
    description: "Оставьте заявку на поиск нужного патента или технологии. Мы подберём подходящие варианты из нашего каталога.",
    keywords: "заявка на патент, поиск ИС, купить технологию",
  },
  "/about": {
    title: "О платформе Патент.Shop — Как мы работаем",
    description: "Узнайте о маркетплейсе интеллектуальной собственности Патент.Shop: миссия, команда, гарантии безопасности сделок.",
    keywords: "о нас, патент шоп, маркетплейс ИС",
  },
  "/auth": {
    title: "Вход и регистрация | Патент.Shop",
    description: "Войдите в личный кабинет или зарегистрируйтесь для доступа к покупке и продаже объектов интеллектуальной собственности.",
  },
  "/dashboard": {
    title: "Личный кабинет | Патент.Shop",
    description: "Управляйте своими объектами ИС, заявками и заказами в личном кабинете.",
  },
  "/admin": {
    title: "Панель администратора | Патент.Shop",
    description: "Административная панель управления платформой.",
  },
};

const legalMeta: Record<string, PageMeta> = {
  privacy: {
    title: "Политика конфиденциальности | Патент.Shop",
    description: "Политика обработки персональных данных на платформе Патент.Shop.",
  },
  terms: {
    title: "Пользовательское соглашение | Патент.Shop",
    description: "Условия использования маркетплейса интеллектуальной собственности Патент.Shop.",
  },
  cookies: {
    title: "Политика cookies | Патент.Shop",
    description: "Информация об использовании файлов cookie на сайте Патент.Shop.",
  },
};

const defaultMeta: PageMeta = {
  title: "Патент.Shop — Маркетплейс интеллектуальной собственности",
  description: "Покупайте и продавайте патенты, товарные знаки и другие объекты ИС.",
};

export const useDocumentMeta = (customMeta?: Partial<PageMeta>) => {
  const location = useLocation();

  useEffect(() => {
    let meta: PageMeta;

    // Проверяем кастомные мета-данные (для динамических страниц)
    if (customMeta?.title) {
      meta = { ...defaultMeta, ...customMeta };
    }
    // Проверяем страницы /legal/:type
    else if (location.pathname.startsWith("/legal/")) {
      const type = location.pathname.split("/")[2];
      meta = legalMeta[type] || defaultMeta;
    }
    // Проверяем страницы каталога /catalog/:id
    else if (location.pathname.match(/^\/catalog\/[a-zA-Z0-9-]+$/)) {
      // Для детальных страниц используем дефолт, 
      // кастомные данные передаются через customMeta
      meta = customMeta?.title ? { ...defaultMeta, ...customMeta } : {
        title: "Объект ИС | Патент.Shop",
        description: "Подробная информация об объекте интеллектуальной собственности.",
      };
    }
    // Стандартные страницы
    else {
      meta = pageMeta[location.pathname] || defaultMeta;
    }

    // Устанавливаем title
    document.title = meta.title;

    // Обновляем meta description
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute("content", meta.description);
    }

    // Обновляем meta keywords если есть
    if (meta.keywords) {
      let keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (!keywordsMeta) {
        keywordsMeta = document.createElement("meta");
        keywordsMeta.setAttribute("name", "keywords");
        document.head.appendChild(keywordsMeta);
      }
      keywordsMeta.setAttribute("content", meta.keywords);
    }

    // Обновляем Open Graph теги
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", meta.title);
    }

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute("content", meta.description);
    }

  }, [location.pathname, customMeta?.title, customMeta?.description]);
};

export default useDocumentMeta;
