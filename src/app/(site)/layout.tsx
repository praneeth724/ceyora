import "./site.css";
import { getSiteSettings } from "@/lib/site";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { SiteThemeProvider } from "@/components/site/theme";
import { SiteEffects } from "@/components/site/site-effects";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  return (
    <SiteThemeProvider>
      <Navbar settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
      <SiteEffects />
    </SiteThemeProvider>
  );
}
