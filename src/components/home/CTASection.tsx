import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Upload, Search } from "lucide-react";

const CTASection = () => {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sell CTA */}
          <div className="relative overflow-hidden rounded-2xl bg-primary p-8 sm:p-10">
            <div className="relative z-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-foreground/20 mb-6">
                <Upload className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
                Продайте вашу интеллектуальную собственность
              </h3>
              <p className="text-primary-foreground/80 mb-8 leading-relaxed">
                Разместите объект ИС на платформе. Мы проведём юридическую проверку, 
                найдём покупателя и обеспечим безопасную сделку.
              </p>
              <Button 
                variant="secondary" 
                size="lg" 
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                asChild
              >
                <Link to="/sell">
                  Разместить объект
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          {/* Buy CTA */}
          <div className="relative overflow-hidden rounded-2xl bg-foreground p-8 sm:p-10">
            <div className="relative z-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-background/20 mb-6">
                <Search className="h-7 w-7 text-background" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-background mb-4">
                Найдите нужный объект интеллектуальной собственности
              </h3>
              <p className="text-background/70 mb-8 leading-relaxed">
                Опишите, какой объект ИС вам нужен. Мы подберём варианты из каталога 
                или найдём правообладателя готового к продаже.
              </p>
              <Button 
                variant="outline" 
                size="lg"
                className="border-background text-background hover:bg-background hover:text-foreground"
                asChild
              >
                <Link to="/request">
                  Оставить заявку
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-background/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-background/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
