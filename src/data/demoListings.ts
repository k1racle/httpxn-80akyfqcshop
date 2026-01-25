// Demo listings data - 500 items across 12 categories
// These are exploratory items, not real IP assets

export interface DemoListing {
  id: string;
  category: string;
  name: string;
  description: string;
  registration_number: string;
  price: number | null;
  price_negotiable: boolean;
  status: "demo";
  views_count: number;
  favorites_count: number;
  cart_count: number;
  is_demo: boolean;
  demo_label: string;
  legal_status: string;
  can_buy: boolean;
  created_at: string;
  user_id: string;
}

const categories = [
  { slug: "techpacks", name: "технологический пакет" },
  { slug: "ai-models", name: "модель ИИ" },
  { slug: "software", name: "программный продукт" },
  { slug: "datasets", name: "датасет" },
  { slug: "patents", name: "патент" },
  { slug: "databases", name: "база данных" },
  { slug: "knowhow", name: "ноу-хау" },
  { slug: "specifications", name: "техспецификация" },
  { slug: "trademarks", name: "товарный знак" },
  { slug: "copyrights", name: "авторское право" },
  { slug: "digital-twins", name: "цифровой двойник" },
  { slug: "prototypes", name: "прототип R&D" },
];

const padNumber = (num: number): string => {
  return num.toString().padStart(3, "0");
};

const generateDemoListings = (): DemoListing[] => {
  const listings: DemoListing[] = [];
  const itemsPerCategory = Math.floor(500 / 12);
  const remainder = 500 % 12;
  
  let globalId = 1;
  
  categories.forEach((category, categoryIndex) => {
    const itemCount = itemsPerCategory + (categoryIndex < remainder ? 1 : 0);
    
    for (let i = 0; i < itemCount; i++) {
      const itemNumber = padNumber(globalId);
      
      listings.push({
        id: `demo-${globalId}`,
        category: category.slug,
        name: `Ознакомительный ${category.name} №${itemNumber}`,
        description: "Нереальный объект для демонстрации работы каталога. Ознакомительная карточка, недоступна для сделки.",
        registration_number: `DEMO-${itemNumber}`,
        price: null,
        price_negotiable: false,
        status: "demo",
        views_count: Math.floor(Math.random() * 50),
        favorites_count: 0,
        cart_count: 0,
        is_demo: true,
        demo_label: "Ознакомительный · недоступна для сделки",
        legal_status: "Демо-карточка: сделки по объекту не совершаются",
        can_buy: false,
        created_at: new Date(Date.now() - globalId * 60000).toISOString(),
        user_id: "demo-user",
      });
      
      globalId++;
    }
  });
  
  return listings;
};

export const demoListings = generateDemoListings();

export const getDemoListingsByCategory = (categorySlug: string): DemoListing[] => {
  if (categorySlug === "all") return demoListings;
  return demoListings.filter(item => item.category === categorySlug);
};

export const getDemoListingById = (id: string): DemoListing | undefined => {
  return demoListings.find(item => item.id === id);
};
