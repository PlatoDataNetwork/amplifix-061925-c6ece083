import { Link, LinkProps } from "react-router-dom";
import { buildLanguageUrl, getCurrentLanguage } from "@/utils/language";
import { forwardRef } from "react";

interface LanguageAwareLinkProps extends Omit<LinkProps, 'to'> {
  to: string;
}

/**
 * Link component that automatically adds language prefix to URLs
 * Usage: <LanguageAwareLink to="/about">About</LanguageAwareLink>
 * Result: /fr/about (if current language is French)
 */
export const LanguageAwareLink = forwardRef<HTMLAnchorElement, LanguageAwareLinkProps>(
  ({ to, ...props }, ref) => {
    const currentLang = getCurrentLanguage();
    const languageAwarePath = buildLanguageUrl(currentLang, to);
    
    return <Link ref={ref} to={languageAwarePath} {...props} />;
  }
);

LanguageAwareLink.displayName = "LanguageAwareLink";
