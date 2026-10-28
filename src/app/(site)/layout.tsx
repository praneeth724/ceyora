import "./site.css";
import { getSiteSettings } from "@/lib/site";
import { getDict } from "@/lib/locale-server";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { SiteThemeProvider } from "@/components/site/theme";
import { SiteEffects } from "@/components/site/site-effects";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, { locale, dict }] = await Promise.all([getSiteSettings(), getDict()]);
  return (
    <SiteThemeProvider>
      <Navbar settings={settings} locale={locale} dict={dict.nav} />
      <main>{children}</main>
      <Footer settings={settings} />
      <SiteEffects />
    </SiteThemeProvider>
  );
}
