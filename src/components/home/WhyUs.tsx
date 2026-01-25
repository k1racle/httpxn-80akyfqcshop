import { useState } from "react";
import { Shield, Scale, FileCheck, Globe, Users, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BenefitModal {
  title: string;
  whatIs: string;
  howItWorks: string[];
  whyImportant: string;
  conclusion: string;
}

interface Benefit {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  modal: BenefitModal;
}

const benefits: Benefit[] = [
  {
    icon: Shield,
    title: "Юридическая проверка обязательна",
    description: "Каждый объект проходит экспертизу юристов перед публикацией",
    modal: {
      title: "Юридическая проверка обязательна",
      whatIs: "Каждый объект интеллектуальной собственности проходит предварительную юридическую экспертизу перед публикацией на платформе.",
      howItWorks: [
        "Проверяется правообладатель и объём прав",
        "Подтверждается отсутствие споров и обременений",
        "Оценивается корректность документов",
        "Устанавливается возможность законной передачи"
      ],
      whyImportant: "Большинство ИС-сделок срываются из-за неоформленных или недействительных прав. В каталог попадает только то, что можно легально продать.",
      conclusion: "Вы видите не витрину идей, а юридически допустимые активы."
    }
  },
  {
    icon: Lock,
    title: "Гарантия сделки",
    description: "Платформа удерживает средства до завершения передачи прав",
    modal: {
      title: "Гарантия сделки",
      whatIs: "Платформа обеспечивает безопасный расчёт между сторонами.",
      howItWorks: [
        "Средства покупателя резервируются на платформе",
        "Перечисление продавцу только после передачи прав",
        "Контроль выполнения условий сделки",
        "Защита от недобросовестных участников"
      ],
      whyImportant: "ИС — нематериальный актив. Без гарантий расчёта покупатель всегда рискует потерять деньги без получения прав.",
      conclusion: "Здесь платят за результат, а не за обещания."
    }
  },
  {
    icon: FileCheck,
    title: "Прозрачная передача прав",
    description: "Полное юридическое сопровождение и оформление документов",
    modal: {
      title: "Прозрачная передача прав",
      whatIs: "Передача прав оформляется юридически корректно и прозрачно.",
      howItWorks: [
        "Договоры отчуждения или лицензирования",
        "Фиксация объёма прав, сроков и территорий",
        "Регистрация в Роспатенте при необходимости",
        "Полный пакет документов для покупателя"
      ],
      whyImportant: "Покупка ИС без ясного объёма прав = отсутствие актива. Неправильно оформленная сделка не даёт вам никаких прав.",
      conclusion: "Вы получаете право, а не файл или описание."
    }
  },
  {
    icon: Globe,
    title: "Крупнейшая платформа ИС",
    description: "Ведущий маркетплейс интеллектуальной собственности в России и СНГ",
    modal: {
      title: "Крупнейшая платформа ИС",
      whatIs: "Платформа агрегирует объекты интеллектуальной собственности в одном месте.",
      howItWorks: [
        "Технологии, патенты, ПО, бренды в одном каталоге",
        "Единый стандарт проверки и оформления",
        "Структурированная классификация объектов",
        "Инструменты поиска и сравнения"
      ],
      whyImportant: "Рынок ИС фрагментирован и непрозрачен. Здесь он собран в систему с едиными правилами.",
      conclusion: "Это не разовая сделка, а точка входа в рынок ИС."
    }
  },
  {
    icon: Users,
    title: "База правообладателей",
    description: "Реальные объекты от проверенных владельцев",
    modal: {
      title: "База правообладателей",
      whatIs: "Все объекты размещаются реальными правообладателями или их представителями.",
      howItWorks: [
        "Подтверждается связь продавца с объектом",
        "Проверяется право распоряжаться ИС",
        "Исключаются перекупщики без прав",
        "Верифицируется каждый участник"
      ],
      whyImportant: "Без установленного правообладателя ИС не существует юридически. Сделка с неуполномоченным лицом ничтожна.",
      conclusion: "Вы имеете дело с источником прав, а не посредником без ответственности."
    }
  },
  {
    icon: Scale,
    title: "Индивидуальные условия",
    description: "Комиссия фиксируется персональным договором с продавцом",
    modal: {
      title: "Индивидуальные условия",
      whatIs: "Комиссия и формат сделки определяются индивидуально.",
      howItWorks: [
        "Условия фиксируются договором с продавцом",
        "Зависят от типа актива и сделки",
        "Возможны сложные и крупные сделки",
        "Отсутствие скрытых комиссий"
      ],
      whyImportant: "ИС не продаётся по шаблону. Каждая сделка уникальна и требует индивидуального подхода.",
      conclusion: "Платформа адаптируется под сделку, а не наоборот."
    }
  },
];

const WhyUs = () => {
  const [openModal, setOpenModal] = useState<number | null>(null);

  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Почему мы</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Мы — инфраструктура для сделок с интеллектуальной собственностью.
            Не витрина идей и не каталог файлов, а юридически выстроенная система,
            где каждый объект проверен, каждая сделка защищена.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <button
              key={index}
              onClick={() => setOpenModal(index)}
              className="p-6 rounded-xl border border-border bg-card hover:shadow-md hover:border-primary/30 transition-all text-left cursor-pointer"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent mb-4">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </button>
          ))}
        </div>

        {/* Footer anchor */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Все условия платформы зафиксированы юридически.
            Публичные заявления соответствуют реальной практике сделок.
          </p>
        </div>

        {/* Modals */}
        {benefits.map((benefit, index) => (
          <Dialog key={index} open={openModal === index} onOpenChange={(open) => setOpenModal(open ? index : null)}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {benefit.modal.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 pt-4">
                {/* What is it */}
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.modal.whatIs}
                </p>

                {/* How it works */}
                <div>
                  <h4 className="font-semibold mb-3">Как это работает</h4>
                  <ul className="space-y-2">
                    {benefit.modal.howItWorks.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Why important */}
                <div>
                  <h4 className="font-semibold mb-2">Почему это важно</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.modal.whyImportant}
                  </p>
                </div>

                {/* Conclusion */}
                <div className="pt-4 border-t border-border">
                  <p className="font-semibold text-foreground">
                    {benefit.modal.conclusion}
                  </p>
                </div>

                {/* CTA */}
                <Button asChild className="w-full">
                  <Link to="/catalog">
                    Перейти к объектам ИС
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </section>
  );
};

export default WhyUs;
