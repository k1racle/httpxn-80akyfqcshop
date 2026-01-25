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

const row1Categories = [
  {
    id: "techpacks",
    title: "Технологические пакеты",
    description: "Готовые комплексные решения: патенты, спецификации, документация и структурированные данные",
    icon: Package,
    count: 40,
    href: "/catalog?category=techpacks",
  },
  {
    id: "ai-models",
    title: "Модели ИИ и алгоритмы",
    description: "Обученные ML-модели, нейросетевые алгоритмы и вычислительные методы для автоматизации задач",
    icon: Brain,
    count: 35,
    href: "/catalog?category=ai-models",
  },
  {
    id: "software",
    title: "ПО, код, IT-продукты",
    description: "Программы для ЭВМ, модули, сервисы и готовые цифровые решения для внедрения в бизнес-процессы",
    icon: Code,
    count: 60,
    href: "/catalog?category=software",
  },
  {
    id: "datasets",
    title: "Датасеты и выборки",
    description: "Коммерческие наборы данных для обучения ИИ, аналитики и разработки алгоритмов",
    icon: BarChart3,
    count: 30,
    href: "/catalog?category=datasets",
  },
];

const row2Categories = [
  {
    id: "patents",
    title: "Патенты",
    description: "Изобретения, полезные модели и промышленные образцы с зарегистрированными правами",
    icon: Lightbulb,
    count: 45,
    href: "/catalog?category=patents",
  },
  {
    id: "databases",
    title: "Базы данных",
    description: "Юридически защищённые структурированные массивы информации, доступные для передачи прав",
    icon: Database,
    count: 35,
    href: "/catalog?category=databases",
  },
  {
    id: "knowhow",
    title: "Ноу-хау",
    description: "Секреты производства, рецептуры, технологии и конфиденциальные методы работы",
    icon: Lock,
    count: 30,
    href: "/catalog?category=knowhow",
  },
  {
    id: "specifications",
    title: "Техспецификации",
    description: "Чертежи, схемы, ТУ, регламенты и техническая документация для производственных процессов",
    icon: Cpu,
    count: 35,
    href: "/catalog?category=specifications",
  },
];

const row3Categories = [
  {
    id: "trademarks",
    title: "Товарные знаки",
    description: "Зарегистрированные бренды, знаки обслуживания, фирменные наименования и домены",
    icon: Bookmark,
    count: 60,
    href: "/catalog?category=trademarks",
  },
  {
    id: "copyrights",
    title: "Авторские права",
    description: "Тексты, дизайн, фото, видео и обучающие материалы с зарегистрированными правами автора",
    icon: FileText,
    count: 45,
    href: "/catalog?category=copyrights",
  },
  {
    id: "digital-twins",
    title: "Digital Twins",
    description: "Цифровые двойники процессов, оборудования и объектов для моделирования и оптимизации",
    icon: Box,
    count: 25,
    href: "/catalog?category=digital-twins",
  },
  {
    id: "prototypes",
    title: "Прототипы и R&D",
    description: "Исследовательские разработки, экспериментальные материалы и решения на ранней стадии",
    icon: Beaker,
    count: 30,
    href: "/catalog?category=prototypes",
  },
];

interface CategoryCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
  href: string;
}

const CategoryCard = ({ id, title, description, icon: Icon, count, href }: CategoryCardProps) => (
  <Link
    to={href}
    className="group card-elevated p-6 flex flex-col min-h-[220px]"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent group-hover:bg-primary transition-colors">
        <Icon className="h-6 w-6 text-accent-foreground group-hover:text-primary-foreground transition-colors" />
      </div>
      <span className="text-sm font-medium text-muted-foreground">
        {count}
      </span>
    </div>
    
    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
      {title}
    </h3>
    <p className="text-sm text-muted-foreground mb-4 flex-1 leading-[1.3]">
      {description}
    </p>
    
    <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
      Смотреть каталог
      <ArrowRight className="h-4 w-4" />
    </div>
  </Link>
);

const Categories = () => {
  return (
    <section className="section-padding bg-surface-subtle">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Категории интеллектуальной собственности</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Платформа работает только с объектами ИС, прошедшими юридическую верификацию. Неподтверждённые активы не допускаются в каталог.
          </p>
        </div>

        {/* Ряд 1: Технологические и цифровые активы */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4 px-1">
            Технологические и цифровые активы
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {row1Categories.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
          </div>
        </div>

        {/* Ряд 2: Юридическая и технологическая документация */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4 px-1">
            Юридическая и технологическая документация
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {row2Categories.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
          </div>
        </div>

        {/* Ряд 3: Брендинг, медиа и R&D */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 px-1">
            Брендинг, медиа и R&D
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {row3Categories.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
