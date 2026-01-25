import { Link } from "react-router-dom";
import { 
  FileText, 
  Code, 
  Lightbulb,
  Database,
  Lock,
  Cpu,
  Beaker,
  ArrowRight,
  Package,
  Brain,
  BarChart3,
  Box,
  Bookmark
} from "lucide-react";

const categories = [
  // Ряд 1 — максимальная ликвидность
  {
    id: "techpacks",
    title: "Технологические пакеты",
    description: "Патенты + спецификации + документация + БД",
    icon: Package,
    count: 0,
    href: "/catalog?category=techpacks",
  },
  {
    id: "ai-models",
    title: "Модели ИИ и алгоритмы",
    description: "ML-модели, нейросети, алгоритмы оптимизации",
    icon: Brain,
    count: 0,
    href: "/catalog?category=ai-models",
  },
  {
    id: "software",
    title: "ПО, код, IT-продукты",
    description: "Программы для ЭВМ, модули, скрипты",
    icon: Code,
    count: 234,
    href: "/catalog?category=software",
  },
  {
    id: "datasets",
    title: "Датасеты и выборки",
    description: "Обучающие выборки, коммерческие наборы данных",
    icon: BarChart3,
    count: 0,
    href: "/catalog?category=datasets",
  },
  // Ряд 2 — высокий юридический вес
  {
    id: "patents",
    title: "Патенты",
    description: "Изобретения, полезные модели, промобразцы",
    icon: Lightbulb,
    count: 89,
    href: "/catalog?category=patents",
  },
  {
    id: "databases",
    title: "Базы данных",
    description: "Структурированные массивы информации",
    icon: Database,
    count: 45,
    href: "/catalog?category=databases",
  },
  {
    id: "knowhow",
    title: "Ноу-хау",
    description: "Рецептуры, производственные секреты",
    icon: Lock,
    count: 32,
    href: "/catalog?category=knowhow",
  },
  {
    id: "specifications",
    title: "Техспецификации",
    description: "Чертежи, схемы, ТУ, регламенты",
    icon: Cpu,
    count: 69,
    href: "/catalog?category=specifications",
  },
  // Ряд 3 — брендинг, медиа, R&D
  {
    id: "trademarks",
    title: "Товарные знаки",
    description: "Бренды, знаки обслуживания, домены",
    icon: Bookmark,
    count: 234,
    href: "/catalog?category=trademarks",
  },
  {
    id: "copyrights",
    title: "Авторские права",
    description: "Тексты, дизайн, фото, медиа, курсы",
    icon: FileText,
    count: 121,
    href: "/catalog?category=copyrights",
  },
  {
    id: "digital-twins",
    title: "Digital Twins",
    description: "Цифровые двойники процессов и оборудования",
    icon: Box,
    count: 0,
    href: "/catalog?category=digital-twins",
  },
  {
    id: "prototypes",
    title: "Прототипы и R&D",
    description: "Исследования, разработки ранних стадий",
    icon: Beaker,
    count: 23,
    href: "/catalog?category=prototypes",
  },
];

const Categories = () => {
  return (
    <section className="section-padding bg-surface-subtle">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Категории интеллектуальной собственности</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Все объекты проходят юридическую проверку перед публикацией
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.href}
              className="group card-elevated p-6 flex flex-col h-[200px]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent group-hover:bg-primary transition-colors">
                  <category.icon className="h-6 w-6 text-accent-foreground group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {category.count}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {category.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
                {category.description}
              </p>
              
              <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Смотреть каталог
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
