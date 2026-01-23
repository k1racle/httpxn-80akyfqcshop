import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: "Каталог ИС", href: "/catalog" },
      { label: "Разместить объект", href: "/sell" },
      { label: "Найти объект", href: "/request" },
      { label: "О платформе", href: "/about" },
    ],
    legal: [
      { label: "Публичная оферта", href: "/legal/offer" },
      { label: "Политика конфиденциальности", href: "/legal/privacy" },
      { label: "Правила размещения", href: "/legal/rules" },
    ],
    support: [
      { label: "Помощь", href: "/help" },
      { label: "Контакты", href: "/contacts" },
      { label: "FAQ", href: "/faq" },
    ],
  };

  return (
    <footer className="border-t border-border bg-surface-subtle">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                патент<span className="text-primary">.shop</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Национальная платформа интеллектуальной собственности. 
              Безопасные сделки с юридической гарантией.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Платформа</h4>
            <ul className="space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Документы</h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Поддержка</h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} патент.shop. Все права защищены.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Платформа-гарант сделок с ИС</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
