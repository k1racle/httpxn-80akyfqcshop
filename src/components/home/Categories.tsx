import { Link } from "react-router-dom";
import { 
  FileText, 
  Code, 
  Palette, 
  Building2, 
  Bookmark, 
  Lightbulb,
  ArrowRight 
} from "lucide-react";

const categories = [
  {
    id: "trademarks",
    title: "Товарные знаки",
    description: "Зарегистрированные товарные знаки и бренды",
    icon: Bookmark,
    count: 156,
    href: "/catalog?category=trademarks",
  },
  {
    id: "patents",
    title: "Патенты",
    description: "Изобретения и полезные модели",
    icon: Lightbulb,
    count: 89,
    href: "/catalog?category=patents",
  },
  {
    id: "software",
    title: "Программы и код",
    description: "ПО, базы данных, алгоритмы",
    icon: Code,
    count: 234,
    href: "/catalog?category=software",
  },
  {
    id: "copyrights",
    title: "Авторские права",
    description: "Литература, музыка, дизайн",
    icon: FileText,
    count: 67,
    href: "/catalog?category=copyrights",
  },
  {
    id: "industrial",
    title: "Промышленные образцы",
    description: "Дизайн изделий и упаковки",
    icon: Palette,
    count: 43,
    href: "/catalog?category=industrial",
  },
  {
    id: "commercial",
    title: "Коммерческие обозначения",
    description: "Фирменные наименования и домены",
    icon: Building2,
    count: 78,
    href: "/catalog?category=commercial",
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.href}
              className="group card-elevated p-6 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent group-hover:bg-primary transition-colors">
                  <category.icon className="h-6 w-6 text-accent-foreground group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {category.count} объектов
                </span>
              </div>
              
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {category.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">
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
