import { guardPage } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { DestinationForm } from "@/components/admin/destinations/destination-form";

export default async function NewDestinationPage() {
  await guardPage("destinations");
  return (
    <div>
      <PageHeader title="New Destination" description="Add a place to explore." />
      <DestinationForm />
    </div>
  );
}
