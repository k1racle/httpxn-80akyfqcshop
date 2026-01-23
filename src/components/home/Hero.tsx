import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Scale, FileCheck } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ultramarine-light via-background to-background" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative container-wide section-padding">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-border mb-8 animate-fade-up">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-accent-foreground">
              Юридическая гарантия каждой сделки
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-up delay-100">
            Национальная платформа
            <br />
            <span className="text-gradient">интеллектуальной собственности</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up delay-200">
            Безопасная покупка и продажа патентов, товарных знаков, 
            программного обеспечения и авторских прав в России и СНГ
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up delay-300">
            <Button variant="hero" size="xl" asChild>
              <Link to="/catalog">
                Перейти в каталог
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/sell">
                Разместить объект
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-up delay-400">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <FileCheck className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Проверка прав</p>
                <p className="text-xs text-muted-foreground">Юридическая экспертиза</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Shield className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Гарант сделки</p>
                <p className="text-xs text-muted-foreground">Защита платежей</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Scale className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Юр. поддержка</p>
                <p className="text-xs text-muted-foreground">Оформление договоров</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
