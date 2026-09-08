import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Super admin -------------------------------------------------------
  const email = process.env.SEED_SUPERADMIN_EMAIL || "admin@ceyora.com";
  const password = process.env.SEED_SUPERADMIN_PASSWORD || "Admin@123";
  const name = process.env.SEED_SUPERADMIN_NAME || "Ceyora Super Admin";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({
      data: {
        email,
        name,
        password: await bcrypt.hash(password, 10),
        role: "SUPER_ADMIN",
        access: [],
      },
    });
    console.log(`✔ Created super admin: ${email} / ${password}`);
  } else {
    console.log(`• Super admin already exists: ${email}`);
  }

  // --- Site settings singleton ------------------------------------------
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: "CEYORA TRAVELS",
      tagline: "Discover Sri Lanka",
      email: "hello@ceyora.com",
      phone: "+94 11 234 5678",
      address: "Colombo, Sri Lanka",
    },
  });
  console.log("✔ Site settings ready");

  // --- Sample catalogue (only if empty) ---------------------------------
  const categoryCount = await prisma.category.count();
  if (categoryCount === 0) {
    const beach = await prisma.category.create({
      data: {
        title: "Beach Escapes",
        slug: "beach-escapes",
        description: "Sun, surf and the golden coasts of the south.",
        isPopular: true,
        sortOrder: 1,
      },
    });
    const culture = await prisma.category.create({
      data: {
        title: "Cultural Journeys",
        slug: "cultural-journeys",
        description: "Ancient cities, temples and living traditions.",
        isPopular: true,
        sortOrder: 2,
      },
    });
    await prisma.category.create({
      data: {
        title: "Wildlife & Nature",
        slug: "wildlife-nature",
        description: "Leopards, elephants and misty highlands.",
        sortOrder: 3,
      },
    });

    const sigiriya = await prisma.destination.create({
      data: {
        name: "Sigiriya",
        slug: "sigiriya",
        tag: "Cultural Triangle",
        description: "The iconic rock fortress rising from the central plains.",
        shortDesc: "Ancient rock fortress and frescoes.",
        rating: "4.9",
        pinTop: "44%",
        pinLeft: "55%",
        isFeatured: true,
      },
    });
    const galle = await prisma.destination.create({
      data: {
        name: "Galle",
        slug: "galle",
        tag: "Southern Coast",
        description: "A Dutch colonial fort town on the southern shore.",
        shortDesc: "Historic fort by the sea.",
        rating: "4.8",
        pinTop: "82%",
        pinLeft: "38%",
        isFeatured: true,
      },
    });

    await prisma.package.create({
      data: {
        title: "Southern Coast Escape",
        slug: "southern-coast-escape",
        summary: "Five relaxed days along Sri Lanka's golden south.",
        badge: "Bestseller",
        days: 5,
        nights: 4,
        price: 640,
        isFeatured: true,
        overview:
          "Beaches, the Galle fort and a whale-watching morning — an easy introduction to the island's south.",
        included: ["Hotels", "Breakfast", "Private driver", "Airport transfers"],
        excluded: ["Lunch & dinner", "Entrance tickets"],
        journey: [
          { day: 1, title: "Arrival & Colombo", description: "Meet your driver and settle in." },
          { day: 2, title: "Galle Fort", description: "Explore the colonial ramparts." },
        ],
        faq: [{ q: "Is this good for families?", a: "Yes, it's a relaxed pace." }],
        categoryId: beach.id,
        destinations: { connect: [{ id: galle.id }] },
      },
    });
    await prisma.package.create({
      data: {
        title: "Cultural Triangle Discovery",
        slug: "cultural-triangle-discovery",
        summary: "Ancient cities and the Sigiriya rock fortress.",
        days: 4,
        nights: 3,
        price: 520,
        isFeatured: true,
        overview: "Climb Sigiriya, wander Polonnaruwa and meet the island's heritage.",
        included: ["Hotels", "Breakfast", "Guide"],
        excluded: ["Tips"],
        categoryId: culture.id,
        destinations: { connect: [{ id: sigiriya.id }] },
      },
    });
    console.log("✔ Seeded sample categories, destinations and packages");
  }

  const blogCount = await prisma.blog.count();
  if (blogCount === 0) {
    await prisma.blog.create({
      data: {
        title: "10 Things to Know Before Visiting Sri Lanka",
        slug: "10-things-to-know-before-visiting-sri-lanka",
        category: "Travel Tips",
        excerpt: "From visas to the best season — plan your island trip.",
        content:
          "Sri Lanka is a small island with huge variety. Here is what to know before you go...",
        author: "Ceyora Team",
      },
    });
    console.log("✔ Seeded sample blog post");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
