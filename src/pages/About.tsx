import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Scale, 
  Users, 
  Target, 
  CheckCircle,
  ArrowRight,
  Building2,
  Globe
} from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Безопасность",
    description: "Сделка не может быть проведена без эскроу-расчёта. Средства переводятся продавцу только после подтверждения передачи прав.",
  },
  {
    icon: Scale,
    title: "Юридическая чистота",
    description: "Сделка не может быть проведена без юридической экспертизы: подлинность документов, отсутствие обременений, правомочность продавца.",
  },
  {
    icon: Users,
    title: "Экспертная поддержка",
    description: "Сделка сопровождается командой юристов и патентных поверенных от первого контакта до регистрации перехода прав.",
  },
  {
    icon: Target,
    title: "Прозрачность",
    description: "Условия сделки фиксируются договором. Никаких скрытых комиссий, двойных трактовок или неоговорённых условий.",
  },
];

const stats = [
  { value: "500+", label: "Объектов ИС в каталоге" },
  { value: "150+", label: "Успешных сделок" },
  { value: "98%", label: "Положительных отзывов" },
  { value: "24/7", label: "Поддержка клиентов" },
];

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ultramarine-light via-background to-background" />
        
        <div className="relative container-wide section-padding">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              О платформе <span className="text-gradient">патент.shop</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-4">
              patent.shop — инфраструктура для сделок с интеллектуальной собственностью.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Платформа работает по нормам гражданского законодательства РФ и выстроена 
              как единая система: проверка прав, защита расчётов и юридически корректная 
              передача ИС-активов.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/catalog">
                  Перейти в каталог
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/sell">
                  Разместить объект
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-surface-subtle">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Наша миссия</h2>
              <p className="text-lg text-foreground font-medium leading-relaxed mb-4">
                Создать и удерживать порядок на рынке интеллектуальной собственности.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Сохранение и развитие интеллектуального потенциала страны. Мы создаём 
                прозрачную среду для передачи прав на изобретения, товарные знаки, 
                программное обеспечение и другие объекты интеллектуальной собственности.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Наша цель — чтобы каждая разработка нашла своё применение, а каждый 
                правообладатель получил справедливую оценку своего труда.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="card-elevated p-6 flex flex-col items-center text-center">
                <Building2 className="h-10 w-10 text-primary mb-4" />
                <p className="font-semibold">Россия и СНГ</p>
                <p className="text-sm text-muted-foreground">Работаем на всём пространстве</p>
              </div>
              <div className="card-elevated p-6 flex flex-col items-center text-center">
                <Globe className="h-10 w-10 text-primary mb-4" />
                <p className="font-semibold">Все виды ИС</p>
                <p className="text-sm text-muted-foreground">Патенты, знаки, ПО, авторские права</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Наши принципы</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Эти принципы обязательны для всех сделок на платформе и не могут быть обойдены
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((item) => (
              <div key={item.title} className="card-elevated p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                    <item.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl sm:text-5xl font-bold mb-2">{stat.value}</p>
                <p className="text-primary-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-primary-foreground/50">
            Данные актуальны на дату публикации и отражают фактические завершённые сделки и размещённые объекты.
          </p>
        </div>
      </section>

      {/* Legal Verification */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Юридическая проверка</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Каждый объект в каталоге проходит обязательную проверку нашей командой 
              патентных поверенных и юристов. Мы гарантируем:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
              {[
                "Подлинность регистрационных документов",
                "Отсутствие обременений и споров",
                "Правомочность продавца на отчуждение",
                "Актуальность охранных документов",
                "Соответствие заявленным характеристикам",
                "Проверка по базам ФИПС и Роспатента",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 p-4 rounded-lg bg-accent">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Условия сотрудничества, включая комиссию платформы, обсуждаются 
                индивидуально и фиксируются в договоре с продавцом.
              </p>
              <p className="text-sm font-medium text-foreground">
                Платформа несёт ответственность за соблюдение регламента проверки 
                в рамках заключённых договоров.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-surface-subtle">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Готовы начать?</h2>
            <p className="text-muted-foreground mb-8">
              Начните работу с интеллектуальной собственностью в юридически выстроенной системе
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/catalog">Смотреть каталог</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/sell">Разместить объект</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
