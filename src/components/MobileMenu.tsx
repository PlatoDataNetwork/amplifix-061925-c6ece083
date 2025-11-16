
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const MobileMenu = () => {
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleMenu}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={closeMenu} />
          <div className="fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl z-[101]">
            <div className="flex justify-end">
              <Button variant="ghost" size="icon" onClick={closeMenu}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex flex-col bg-white dark:bg-gray-900">
              <LanguageAwareLink to="/about" className="px-4 py-3 text-foreground hover:text-highlight-blue transition-colors border-b border-gray-100 dark:border-gray-800" onClick={closeMenu}>
                {t('nav.about')}
              </LanguageAwareLink>
              <LanguageAwareLink to="/solutions" className="px-4 py-3 text-foreground hover:text-highlight-blue transition-colors border-b border-gray-100 dark:border-gray-800" onClick={closeMenu}>
                {t('nav.solutions')}
              </LanguageAwareLink>
              <LanguageAwareLink to="/showcase" className="px-4 py-3 text-foreground hover:text-highlight-blue transition-colors border-b border-gray-100 dark:border-gray-800" onClick={closeMenu}>
                {t('nav.showcase')}
              </LanguageAwareLink>
              <LanguageAwareLink to="/intel" className="px-4 py-3 text-foreground hover:text-highlight-blue transition-colors border-b border-gray-100 dark:border-gray-800" onClick={closeMenu}>
                {t('nav.intel')}
              </LanguageAwareLink>
              <LanguageAwareLink to="/faq" className="px-4 py-3 text-foreground hover:text-highlight-blue transition-colors border-b border-gray-100 dark:border-gray-800" onClick={closeMenu}>
                {t('nav.faq')}
              </LanguageAwareLink>
              <LanguageAwareLink to="/contact" className="px-4 py-3 text-foreground hover:text-highlight-blue transition-colors border-b border-gray-100 dark:border-gray-800" onClick={closeMenu}>
                {t('nav.contact')}
              </LanguageAwareLink>
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <ThemeToggle />
              </div>
              <div className="px-4 py-3">
                <LanguageSwitcher isMobile={true} />
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
