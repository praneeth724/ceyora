import { prisma } from "@/lib/prisma";
import { guardPage } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/settings/settings-form";

export default async function SettingsPage() {
  await guardPage("settings");
  const setting = await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  return (
    <div>
      <PageHeader title="Site Settings" description="Your site name, logo and contact details." />
      <SettingsForm
        initial={{
          siteName: setting.siteName,
          tagline: setting.tagline,
          logoFull: setting.logoFull,
          logoMark: setting.logoMark,
          logoWord: setting.logoWord,
          favicon: setting.favicon,
          heroImage: setting.heroImage,
          email: setting.email,
          phone: setting.phone,
          address: setting.address,
          whatsapp: setting.whatsapp,
          facebook: setting.facebook,
          instagram: setting.instagram,
          twitter: setting.twitter,
          youtube: setting.youtube,
        }}
      />
    </div>
  );
}
