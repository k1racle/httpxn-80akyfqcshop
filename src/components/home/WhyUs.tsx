import { Shield, Scale, FileCheck, Globe, Users, Lock } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Юридическая проверка обязательна",
    description: "Каждый объект проходит экспертизу юристов перед публикацией",
  },
  {
    icon: Lock,
    title: "Гарантия сделки",
    description: "Платформа удерживает средства до завершения передачи прав",
  },
  {
    icon: FileCheck,
    title: "Прозрачная передача прав",
    description: "Полное юридическое сопровождение и оформление документов",
  },
  {
    icon: Globe,
    title: "Крупнейшая платформа ИС",
    description: "Ведущий маркетплейс интеллектуальной собственности в России и СНГ",
  },
  {
    icon: Users,
    title: "База правообладателей",
    description: "Реальные объекты от проверенных владельцев",
  },
  {
    icon: Scale,
    title: "Индивидуальные условия",
    description: "Комиссия фиксируется персональным договором с продавцом",
  },
];

const WhyUs = () => {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Почему мы</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Безопасность, прозрачность и юридические гарантии на каждом этапе сделки
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent mb-4">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
