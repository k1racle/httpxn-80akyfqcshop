import { FileSearch, Shield, FileSignature, CreditCard, CheckCircle } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Выбор объекта",
    description: "Найдите нужный объект ИС в каталоге или оставьте заявку на поиск",
    icon: FileSearch,
  },
  {
    number: "02",
    title: "Юридическая проверка",
    description: "Наши эксперты проверяют чистоту прав и документацию объекта",
    icon: Shield,
  },
  {
    number: "03",
    title: "Подготовка договора",
    description: "Формируем договор передачи исключительных прав",
    icon: FileSignature,
  },
  {
    number: "04",
    title: "Безопасная оплата",
    description: "Средства удерживаются на счёте платформы до завершения сделки",
    icon: CreditCard,
  },
  {
    number: "05",
    title: "Передача прав",
    description: "Регистрация перехода прав и перевод средств продавцу",
    icon: CheckCircle,
  },
];

const HowItWorks = () => {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Как работает платформа</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Пошаговый процесс безопасной сделки с гарантией юридической чистоты
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-border" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                {/* Step Number */}
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-lg mb-6 shadow-hero">
                  <step.icon className="h-7 w-7" />
                </div>
                
                {/* Step Badge */}
                <span className="absolute top-0 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  {index + 1}
                </span>
                
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
