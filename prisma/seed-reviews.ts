import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const REVIEWS = [
  { name: "Emily Johnson", country: "United Kingdom", category: "Couple", rating: 5, message: "Our trip was beyond amazing. Climbing Sigiriya before sunrise with nobody else on the staircase is something I will talk about for years. Nothing felt rushed and nothing felt staged." },
  { name: "David Miller", country: "Australia", category: "Family", rating: 5, message: "From the tea hills to the beaches, every moment was considered. Our guide made the whole thing — he knew which factory to visit, which train door to stand at, when to simply stop the van." },
  { name: "Sophie Martin", country: "France", category: "Solo", rating: 5, message: "The whale morning was extraordinary, but what I remember is the small things: the lunch stop nobody else knew about, the driver waiting in the rain with an umbrella. We are already planning the east coast." },
  { name: "Lucas Müller", country: "Germany", category: "Group", rating: 4, message: "Sigiriya was breathtaking and the guide was very knowledgeable. Great value and a smooth, well-organised trip from start to finish." },
];

async function main() {
  const count = await prisma.review.count();
  if (count > 0) { console.log("Reviews already exist, skipping."); return; }
  for (const r of REVIEWS) {
    await prisma.review.create({ data: { ...r, status: "APPROVED", photos: [] } });
  }
  console.log("✔ Seeded", REVIEWS.length, "approved reviews");
}
main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
