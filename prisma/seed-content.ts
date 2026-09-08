/**
 * Seeds the catalogue with the Ceyora deploy content (destinations, categories,
 * packages with full itineraries, and blog posts) so the live site mirrors the
 * static design. Re-runnable: it clears the catalogue tables first.
 *
 * Run with: npx tsx prisma/seed-content.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const W = (n: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${n}?width=1400`;
const IMG: Record<string, string> = {
  sigiriya: W("Sigiriya_Rock.jpg"), kandy: W("Sri_Dalada_Maligawa.jpg"), kandyLake: W("Kandy_Lake.jpg"),
  tea: W("Sri_Lanka_tea_plantation.jpg"), nuwara: W("Nuwara_Eliya.jpg"), gregory: W("Gregory_Lake.jpg"),
  ella: W("Nine_Arches_Bridge.jpg"), littleAdams: W("Little_Adams_Peak.jpg"), mirissa: W("Mirissa_Beach.jpg"),
  galle: W("Galle_Fort_Lighthouse.jpg"), elephant: W("Sri_Lankan_elephant.jpg"), leopard: W("Sri_Lankan_leopard.jpg"),
  anuradhapura: W("Ruwanwelisaya_stupa.jpg"), arugam: W("Arugam_Bay.jpg"), arugamBeach: W("Arugam_bay_beach.jpg"),
  train: W("Sri_Lanka_Railways.jpg"), trinco: W("Trincomalee.jpg"), nilaveli: W("Nilaveli_Beach.jpg"),
  pigeon: W("Pigeon_Island.jpg"), jaffna: W("Nallur_Kandaswamy_temple.jpg"), sinharaja: W("Sinharaja.jpg"),
  adams: W("Adams_Peak.jpg"), dambulla: W("Dambulla_cave_temple.jpg"), polonnaruwa: W("Polonnaruwa.jpg"),
  unawatuna: W("Unawatuna_beach.jpg"), perahera: W("Esala_Perahera.jpg"), horton: W("Horton_Plains.jpg"),
  worldsEnd: W("Worlds_End_Sri_Lanka.jpg"), stilt: W("Stilt_fishing.jpg"), diyaluma: W("Diyaluma_Falls.jpg"),
  ravana: W("Ravana_Falls.jpg"), hikkaduwa: W("Hikkaduwa.jpg"), colombo: W("Colombo_skyline.jpg"),
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const num = (s: string) => Number(String(s).replace(/[^0-9.]/g, "")) || 0;
const pct = (v: number, max: number) => `${Math.round((v / max) * 1000) / 10}%`;

const DESTS = [
  { name: "Jaffna", x: 95.3, y: 46.7, tag: "Northern Province", rating: "4.5", img: IMG.jaffna, blurb: "Tamil heritage, palmyra palms and temple festivals.", long: "The cultural capital of the north, where kovil bells, cycling backroads and island-hopping to Delft make for a completely different Sri Lanka." },
  { name: "Trincomalee", x: 274.2, y: 208.6, tag: "East Coast", rating: "4.6", img: IMG.trinco, blurb: "Deep natural harbour, whales and coral gardens.", long: "Calm turquoise bays from May to September, snorkelling at Pigeon Island and blue whales cruising just offshore." },
  { name: "Anuradhapura", x: 152.5, y: 247.1, tag: "Cultural Triangle", rating: "4.7", img: IMG.anuradhapura, blurb: "Sacred ancient city, one of the world's oldest.", long: "A sprawling ruined capital of dagobas, monastic pools and the oldest recorded planted tree on earth, best explored slowly by bicycle." },
  { name: "Sigiriya", x: 205.3, y: 299, tag: "Cultural Triangle", rating: "4.8", img: IMG.sigiriya, blurb: "Ancient rock fortress rising above lush plains.", long: "A fifth-century royal citadel on a 200 m granite monolith, with mirror walls, frescoes and water gardens below. Climb at dawn." },
  { name: "Dambulla", x: 189.2, y: 312.3, tag: "Cultural Triangle", rating: "4.6", img: IMG.dambulla, blurb: "Cave temples painted across two millennia.", long: "Five cave shrines carved into a rock overhang, holding 150 Buddha images and ceiling murals that follow the curve of the stone." },
  { name: "Kandy", x: 186.2, y: 398.1, tag: "Hill Country", rating: "4.7", img: IMG.kandy, blurb: "Lakeside royal city and the Temple of the Tooth.", long: "The last kingdom of Sri Lanka, wrapped around a misty lake, with the Sacred Tooth Relic, drum ceremonies and the Esala Perahera in August." },
  { name: "Nuwara Eliya", x: 206.8, y: 445.4, tag: "Tea Country", rating: "4.7", img: IMG.nuwara, blurb: "Cool climate, rolling tea and colonial charm.", long: "Little England at 1,900 m: clipped hedges, tea factories, strawberry farms and the pre-dawn train to Horton Plains." },
  { name: "Ella", x: 247.8, y: 460.2, tag: "Hill Country", rating: "4.8", img: IMG.ella, blurb: "Nine Arch Bridge, misty peaks and waterfalls.", long: "A backpacker-loved gap town where the train curls over the Nine Arch Bridge and Little Adam's Peak is a sunrise walk from breakfast." },
  { name: "Colombo", x: 73.3, y: 451.3, tag: "West Coast", rating: "4.3", img: IMG.colombo, blurb: "The island's restless, layered capital.", long: "Dutch warehouses beside glass towers, Pettah market noise, sea breeze on Galle Face Green and the country's best food scene." },
  { name: "Galle", x: 126.1, y: 581.2, tag: "Southern Coast", rating: "4.8", img: IMG.galle, blurb: "A timeless colonial fort with charming streets.", long: "Ramparts built by the Dutch enclose a living town of villas, boutiques and a lighthouse that catches the last light of the day." },
  { name: "Mirissa", x: 161.3, y: 596, tag: "Southern Coast", rating: "4.9", img: IMG.mirissa, blurb: "Golden sand, blue water and whale watching.", long: "A crescent bay of palms and fishing boats, and the launching point for blue whale and spinner dolphin trips from November to April." },
  { name: "Yala", x: 302.1, y: 534, tag: "Wildlife", rating: "4.8", img: IMG.leopard, blurb: "Leopards, elephants and diverse wildlife.", long: "The highest density of leopards in the world, plus sloth bears, elephants and lagoon birdlife across scrub and rock outcrops." },
  { name: "Arugam Bay", x: 362.2, y: 464.6, tag: "East Coast", rating: "4.6", img: IMG.arugam, blurb: "Right-hand point break and easy beach living.", long: "One of Asia's great surf points, with a season from April to October and a strip of guesthouses that never quite wakes up before ten." },
  { name: "Sinharaja", x: 159.8, y: 526.7, tag: "Rainforest", rating: "4.5", img: IMG.sinharaja, blurb: "Last primary rainforest on the island.", long: "A UNESCO biosphere of endemic birds, leeches and green half-light, walked with a naturalist who can name every call." },
];

const CATS = [
  { key: "ceylon-essentials", title: "Ceylon Essentials", blurb: "The highlights of Sri Lanka on a carefully curated escape combining ancient heritage, breathtaking landscapes and authentic local experiences.", img: IMG.sigiriya, popular: true },
  { key: "romantic-tours", title: "Romantic Tours", blurb: "Private beach stays, sunset dinners, scenic drives and peaceful couple-friendly moments planned for two.", img: IMG.mirissa, popular: true },
  { key: "family-holiday", title: "Family Holiday", blurb: "Comfortable hotels, safe transfers, child-friendly attractions and flexible sightseeing for all ages.", img: IMG.elephant, popular: false },
  { key: "wildlife-safari", title: "Wildlife & Safari", blurb: "Leopards, elephants and rainforest birdlife with resident naturalists and small-group jeeps.", img: IMG.leopard, popular: true },
  { key: "tea-country-trails", title: "Tea Country Trails", blurb: "The blue train, plantation walks and cool highland mornings above the clouds.", img: IMG.tea, popular: false },
  { key: "beach-surf", title: "Beach & Surf", blurb: "Point breaks, coral gardens and slow east-coast evenings on the island's quietest coast.", img: IMG.arugam, popular: false },
];

interface Day { day: string; title: string; body: string; stay: string }
interface Pkg {
  id: number; title: string; theme: string; days: number; nights: number; price: string; was: string;
  route: string; group: string; img: string; stops: string[]; summary: string; overview: string;
  itinerary: Day[]; includes: string[]; excludes: string[]; catKey: string; featured?: boolean; badge?: string;
}

const PKGS: Pkg[] = [
  { id: 0, catKey: "ceylon-essentials", featured: true, badge: "Bestseller", title: "Cultural Triangle Discovery", theme: "Culture", days: 6, nights: 5, price: "$890", was: "$1,050", route: "Colombo → Sigiriya → Kandy", group: "Max 8 travellers", img: IMG.sigiriya, stops: ["Colombo", "Sigiriya", "Anuradhapura", "Dambulla", "Kandy"], summary: "Rock fortresses, cave temples and ancient capitals, paced so you climb before the heat.",
    overview: "Six days through the heart of the island's ancient kingdoms. You climb Sigiriya at first light, cycle the ruins of Anuradhapura, stand under two-thousand-year-old murals at Dambulla, and end in Kandy for the evening drum ceremony at the Temple of the Tooth. Private vehicle throughout, with a guide who has been leading this route for a decade.",
    itinerary: [{ day: "01", title: "Arrive Colombo, drive to Habarana", body: "Airport welcome, then a scenic four-hour drive inland. Late-afternoon village walk and dinner under the stars.", stay: "Habarana · eco lodge" }, { day: "02", title: "Sigiriya Rock at sunrise", body: "Gates at 6.30am to beat the crowds and the heat. Afternoon at leisure, optional Pidurangala sunset climb.", stay: "Habarana · eco lodge" }, { day: "03", title: "Anuradhapura by bicycle", body: "A full day among dagobas, monastic pools and the sacred Bodhi tree, riding the shaded lanes between them.", stay: "Habarana · eco lodge" }, { day: "04", title: "Polonnaruwa and Dambulla", body: "Morning at the medieval capital, then the five painted cave shrines of Dambulla on the way south.", stay: "Kandy · heritage hotel" }, { day: "05", title: "Kandy, lake and relic", body: "Peradeniya Botanical Gardens, a tea-and-spice stop, then evening puja at the Temple of the Tooth.", stay: "Kandy · heritage hotel" }, { day: "06", title: "Departure", body: "Slow morning by the lake and a transfer to Colombo or the airport.", stay: "Departure" }],
    includes: ["Private air-conditioned vehicle and driver-guide", "5 nights hand-picked accommodation", "Daily breakfast and 3 dinners", "All entrance fees and site guides", "Bottled water and cool towels daily", "Airport transfers both ways"],
    excludes: ["International flights", "Visa fees", "Lunches and personal expenses", "Travel insurance", "Tips for guide and driver"] },
  { id: 1, catKey: "tea-country-trails", featured: true, title: "Hill Country & Tea Trails", theme: "Nature", days: 5, nights: 4, price: "$740", was: "$860", route: "Kandy → Nuwara Eliya → Ella", group: "Max 8 travellers", img: IMG.tea, stops: ["Kandy", "Nuwara Eliya", "Horton Plains", "Ella"], summary: "The blue-train ride, tea factories at altitude and a sunrise at World's End.",
    overview: "Five days in the cool green highlands, built around the most beautiful train journey in Asia. You pluck tea with an estate worker, wake early for World's End before the mist closes in, and walk to the Nine Arch Bridge in time for the morning express.",
    itinerary: [{ day: "01", title: "Kandy to Nuwara Eliya", body: "Reserved seats on the hill-country train, watching plantations rise past the window. Evening walk around Gregory Lake.", stay: "Nuwara Eliya · colonial bungalow" }, { day: "02", title: "Tea estate and factory", body: "Plucking with the estate team, then the full withering-to-tasting process with a factory manager.", stay: "Nuwara Eliya · colonial bungalow" }, { day: "03", title: "Horton Plains and World's End", body: "A 4am start for the 9 km loop across the plateau, cloud forest and the 880 m drop at World's End.", stay: "Ella · valley view hotel" }, { day: "04", title: "Ella at your own pace", body: "Little Adam's Peak at dawn, Nine Arch Bridge mid-morning, an afternoon swim at Ravana Falls.", stay: "Ella · valley view hotel" }, { day: "05", title: "Down to the coast or Colombo", body: "Waterfall stops on the descent, arriving by mid-afternoon.", stay: "Departure" }],
    includes: ["Reserved first-class train tickets", "4 nights highland accommodation", "Daily breakfast and 2 dinners", "Tea estate and factory visit", "Horton Plains permits and packed breakfast", "Private vehicle for all transfers"],
    excludes: ["International flights", "Lunches and dinners not listed", "Personal expenses", "Travel insurance"] },
  { id: 2, catKey: "beach-surf", featured: true, badge: "Popular", title: "Southern Coast & Whales", theme: "Beaches", days: 7, nights: 6, price: "$960", was: "$1,120", route: "Colombo → Galle → Mirissa", group: "Max 10 travellers", img: IMG.mirissa, stops: ["Galle", "Unawatuna", "Mirissa", "Hikkaduwa"], summary: "Fort ramparts, stilt fishermen and a dawn boat out to the blue whales.",
    overview: "A week of slow coastal days: Dutch fort lanes in Galle, turtles at Hikkaduwa, a whale-watching morning off Mirissa and enough hammock time to forget the date. Best from November to April.",
    itinerary: [{ day: "01", title: "Arrive and drive south", body: "Coastal expressway to Galle, checking in inside the fort walls. Sunset on the ramparts.", stay: "Galle Fort · boutique villa" }, { day: "02", title: "Galle Fort on foot", body: "A morning walking tour through Dutch warehouses, the lighthouse and the Maritime Museum, afternoon free.", stay: "Galle Fort · boutique villa" }, { day: "03", title: "Unawatuna and Jungle Beach", body: "Snorkelling over the reef, a tuk-tuk hop to Jungle Beach and grilled fish on the sand.", stay: "Unawatuna · beach hotel" }, { day: "04", title: "Whale watching from Mirissa", body: "6am departure with a marine-biologist-led crew; blue whales, sperm whales and spinner dolphin pods.", stay: "Mirissa · beach hotel" }, { day: "05", title: "Coconut Tree Hill and surf", body: "Beginner surf lesson at Weligama, then the walk out to Coconut Tree Hill for sunset.", stay: "Mirissa · beach hotel" }, { day: "06", title: "Turtles and stilt fishermen", body: "Hikkaduwa turtle sanctuary, Koggala stilt fishermen at golden hour, an evening lagoon cruise.", stay: "Mirissa · beach hotel" }, { day: "07", title: "Departure", body: "Beach morning and airport transfer.", stay: "Departure" }],
    includes: ["6 nights beachfront accommodation", "Whale watching with marine guide", "Surf lesson and board", "Galle Fort walking tour", "Daily breakfast and 3 dinners", "Private vehicle and airport transfers"],
    excludes: ["International flights", "Alcoholic drinks", "Diving certification", "Travel insurance"] },
  { id: 3, catKey: "wildlife-safari", featured: true, title: "Wildlife Safari Expedition", theme: "Wildlife", days: 4, nights: 3, price: "$620", was: "$730", route: "Colombo → Udawalawe → Yala", group: "Max 6 travellers", img: IMG.leopard, stops: ["Udawalawe", "Yala", "Bundala"], summary: "Four game drives across two parks with a naturalist, not a queue of jeeps.",
    overview: "Short, focused and genuinely wild. Two parks, four drives, one naturalist who reads tracks and knows which waterholes hold leopards in the dry season. Small-group jeeps only, and we stay inside the buffer zone to be first at the gates.",
    itinerary: [{ day: "01", title: "Drive to Udawalawe", body: "Afternoon game drive among the elephant herds, then the Elephant Transit Home feeding at dusk.", stay: "Udawalawe · tented camp" }, { day: "02", title: "Udawalawe to Yala", body: "Dawn drive for eagles and buffalo, transfer to Yala, evening drive along the rock outcrops.", stay: "Yala · luxury tented camp" }, { day: "03", title: "Full day in Yala Block 1", body: "Two drives with a midday break at camp; leopard, sloth bear, crocodile and painted stork.", stay: "Yala · luxury tented camp" }, { day: "04", title: "Bundala birds and return", body: "A last stop at the Bundala wetlands for flamingos before the drive back to Colombo.", stay: "Departure" }],
    includes: ["4 game drives in private 4x4 jeeps", "Resident naturalist throughout", "3 nights tented camp accommodation", "All park fees and permits", "Full board while in camp", "Private transfers"],
    excludes: ["International flights", "Camera permits for professional gear", "Drinks", "Travel insurance"] },
  { id: 4, catKey: "ceylon-essentials", featured: true, badge: "Grand tour", title: "Grand Island Explorer", theme: "Culture", days: 12, nights: 11, price: "$1,890", was: "$2,200", route: "Full island loop", group: "Max 8 travellers", img: IMG.train, stops: ["Negombo", "Sigiriya", "Kandy", "Ella", "Yala", "Galle"], summary: "The complete island: ancient cities, tea hills, a safari and the southern coast.",
    overview: "Twelve days that leave nothing out. You start in the cultural triangle, climb into the tea hills, take the blue train to Ella, track leopards in Yala and finish with three unhurried nights on the south coast. Designed for first-time visitors who would rather do it properly once.",
    itinerary: [{ day: "01", title: "Arrive Negombo", body: "Airport pickup and a lagoon-side first night to shake off the flight.", stay: "Negombo · beach hotel" }, { day: "02", title: "North to the Cultural Triangle", body: "Anuradhapura's sacred city by bicycle in the late afternoon light.", stay: "Habarana · eco lodge" }, { day: "03", title: "Sigiriya and Pidurangala", body: "Dawn on the rock fortress, sunset from the neighbouring outcrop.", stay: "Habarana · eco lodge" }, { day: "04", title: "Polonnaruwa and Minneriya", body: "Medieval ruins in the morning, an elephant gathering safari at dusk.", stay: "Habarana · eco lodge" }, { day: "05", title: "Dambulla to Kandy", body: "Cave temples, a spice garden, then the evening puja in Kandy.", stay: "Kandy · heritage hotel" }, { day: "06", title: "Kandy and the blue train", body: "Botanical gardens, then the afternoon train climbing into the hills.", stay: "Nuwara Eliya · bungalow" }, { day: "07", title: "Tea country", body: "Estate walk, factory tour and tasting, afternoon at Gregory Lake.", stay: "Nuwara Eliya · bungalow" }, { day: "08", title: "Horton Plains to Ella", body: "World's End at sunrise, then down to the valley town.", stay: "Ella · valley view hotel" }, { day: "09", title: "Ella and south to Yala", body: "Nine Arch Bridge in the morning, evening game drive in Yala.", stay: "Yala · tented camp" }, { day: "10", title: "Yala to the coast", body: "Dawn safari, then west along the coast road to Mirissa.", stay: "Mirissa · beach hotel" }, { day: "11", title: "Whales and Galle", body: "Whale watching at dawn, Galle Fort in the afternoon.", stay: "Galle Fort · boutique villa" }, { day: "12", title: "Departure", body: "Rampart walk and transfer to the airport.", stay: "Departure" }],
    includes: ["11 nights accommodation across 6 locations", "Private vehicle and driver-guide throughout", "Reserved train seats Kandy to Nuwara Eliya", "3 game drives and whale watching", "Daily breakfast and 6 dinners", "All entrance fees and permits"],
    excludes: ["International flights", "Visa fees", "Most lunches", "Travel insurance", "Personal expenses"] },
  { id: 5, catKey: "beach-surf", title: "Surf & Sun Escape", theme: "Adventure", days: 5, nights: 4, price: "$680", was: "$790", route: "Colombo → Arugam Bay", group: "Max 8 travellers", img: IMG.arugamBeach, stops: ["Arugam Bay", "Whiskey Point", "Kumana"], summary: "Right-hand point breaks, lagoon safaris and slow east-coast evenings.",
    overview: "Four nights on the east coast in surf season. Daily sessions at Main Point with a local coach, a morning in the Kumana lagoons and nothing on the schedule after two in the afternoon.",
    itinerary: [{ day: "01", title: "Fly or drive east", body: "Transfer to Arugam Bay, board fitting and an evening paddle-out at Baby Point.", stay: "Arugam Bay · surf lodge" }, { day: "02", title: "Main Point sessions", body: "Two coached sessions either side of the midday heat, video review over lunch.", stay: "Arugam Bay · surf lodge" }, { day: "03", title: "Whiskey and Peanut Farm", body: "Tuk-tuk surf safari to the quieter breaks up and down the coast.", stay: "Arugam Bay · surf lodge" }, { day: "04", title: "Kumana lagoon safari", body: "Dawn boat among the mangroves and birdlife, an afternoon free for a last surf.", stay: "Arugam Bay · surf lodge" }, { day: "05", title: "Return west", body: "Morning session, then the drive back to Colombo.", stay: "Departure" }],
    includes: ["4 nights surf lodge accommodation", "Daily coached surf sessions", "Board and leash hire", "Kumana lagoon boat safari", "Daily breakfast", "Private transfers"],
    excludes: ["International flights", "Lunches and dinners", "Travel insurance", "Personal expenses"] },
  { id: 6, catKey: "family-holiday", title: "East Coast & Island Escape", theme: "Beaches", days: 5, nights: 4, price: "$780", was: "$780", route: "Trincomalee → Nilaveli → Pigeon Island", group: "Private itinerary", img: IMG.nilaveli, stops: ["Trincomalee", "Nilaveli", "Pigeon Island"], summary: "Quiet beaches, island scenery and time to unwind on the east coast.",
    overview: "Proposed itinerary with sample pricing. Final accommodation, activities, availability and price are confirmed with your tailored quote.",
    itinerary: [{ day: "01", title: "Welcome to Trincomalee", body: "Travel to the east coast and settle in for a quiet evening.", stay: "Trincomalee" }, { day: "02", title: "Harbour town and coastal views", body: "Explore Trincomalee at an easy pace with time for the waterfront.", stay: "Nilaveli" }, { day: "03", title: "Pigeon Island outing", body: "Plan a guided island excursion, subject to sea conditions and permits.", stay: "Nilaveli" }, { day: "04", title: "A day by the sea", body: "Enjoy an unhurried beach day with optional activities arranged locally.", stay: "Nilaveli" }, { day: "05", title: "Return journey", body: "Breakfast and a transfer back to Colombo.", stay: "Departure" }],
    includes: ["Proposed private transfers", "4 nights accommodation, subject to confirmation", "Daily breakfast, subject to the final quote"],
    excludes: ["International flights", "Travel insurance", "Activities and entrance fees unless included in your final quote", "Meals not listed"] },
  { id: 7, catKey: "tea-country-trails", title: "Highland Walking Escape", theme: "Adventure", days: 5, nights: 4, price: "$690", was: "$690", route: "Kandy → Nuwara Eliya → Horton Plains → Ella", group: "Private itinerary", img: IMG.horton, stops: ["Kandy", "Nuwara Eliya", "Horton Plains", "Ella"], summary: "Highland trails, tea-country views and easy evenings in Ella.",
    overview: "Proposed itinerary with sample pricing. Final accommodation, activities, availability and price are confirmed with your tailored quote.",
    itinerary: [{ day: "01", title: "Into the highlands", body: "Travel from Kandy into tea country, stopping for views along the way.", stay: "Nuwara Eliya" }, { day: "02", title: "Horton Plains trails", body: "An early guided walk with the route adapted to weather and fitness.", stay: "Nuwara Eliya" }, { day: "03", title: "Onward to Ella", body: "Continue through the hills, with a relaxed afternoon in Ella.", stay: "Ella" }, { day: "04", title: "Ella viewpoints", body: "Explore walking trails and the Nine Arch Bridge with time to rest.", stay: "Ella" }, { day: "05", title: "Farewell to the hills", body: "A scenic transfer to Colombo with stops along the way.", stay: "Departure" }],
    includes: ["Proposed private transfers", "4 nights accommodation, subject to confirmation", "Daily breakfast, subject to the final quote"],
    excludes: ["International flights", "Travel insurance", "Activities and entrance fees unless included in your final quote", "Meals not listed"] },
  { id: 8, catKey: "romantic-tours", title: "Galle & Southern Slow Days", theme: "Beaches", days: 4, nights: 3, price: "$560", was: "$560", route: "Galle → Unawatuna → Mirissa", group: "Private itinerary", img: IMG.galle, stops: ["Galle", "Unawatuna", "Mirissa"], summary: "Fort lanes, coastal cafes and unhurried mornings by the ocean.",
    overview: "Proposed itinerary with sample pricing. Final accommodation, activities, availability and price are confirmed with your tailored quote.",
    itinerary: [{ day: "01", title: "Arrive in Galle", body: "Transfer from Colombo and take an evening walk around the fort.", stay: "Galle" }, { day: "02", title: "Fort lanes and coastal cafes", body: "Explore Galle on foot, then head to the coast for a relaxed afternoon.", stay: "Unawatuna" }, { day: "03", title: "Your own coastal rhythm", body: "Spend the day between the beach and nearby coastal villages.", stay: "Mirissa" }, { day: "04", title: "One last ocean morning", body: "Enjoy breakfast by the coast before returning to Colombo.", stay: "Departure" }],
    includes: ["Proposed private transfers", "3 nights accommodation, subject to confirmation", "Daily breakfast, subject to the final quote"],
    excludes: ["International flights", "Travel insurance", "Activities and entrance fees unless included in your final quote", "Meals not listed"] },
];

const FAQ = [
  { q: "Is this trip private or a group tour?", a: "Every Ceyora journey is private by default — just you and your party, your own vehicle and guide, with the pace set by you." },
  { q: "What is the best time of year to travel?", a: "Sri Lanka has two monsoons, so somewhere is always in season. We match your dates to the right region for clear skies and calm seas." },
  { q: "Are flights and visas included?", a: "International flights and the ETA visa are not included, but we help you time your flights and complete the visa before you arrive." },
  { q: "Can the itinerary be customised?", a: "Absolutely. Treat every itinerary as a starting point — add nights, swap regions or change the pace and we will re-quote it for you." },
  { q: "What about payment and cancellation?", a: "A deposit confirms your dates with the balance due before arrival. Free cancellation applies up to 14 days before departure." },
];

const POSTS = [
  { cat: "Travel Guide", title: "When to visit Sri Lanka: a month-by-month guide", date: "2026-08-18", read: "7 min read", author: "Ruwan Perera", img: IMG.tea, excerpt: "The island has two monsoons, which means somewhere is always in season. Here is how to pick your side of the country.", body: ["Sri Lanka is small enough to cross in a day and complicated enough to have two separate weather systems. The southwest monsoon brings rain to the west and south from May to September; the northeast monsoon soaks the east and north from November to February. Almost no month is a bad month — it only changes where you should be.", "From December to March the south and west coasts are at their best: dry mornings, calm seas at Mirissa and Unawatuna, whales offshore and the cultural triangle still comfortable before the April heat. This is peak season, so book Galle and the tea-country bungalows early.", "From May to September the east takes over. Arugam Bay's point break wakes up, Nilaveli and Pigeon Island turn glassy, and Trincomalee is the calmest water in the country. The hill country stays green and cool year-round, with mist in the afternoons.", "April and October are the shoulder months between monsoons. Rain arrives in short heavy bursts rather than all day, prices drop, and the sites are quiet. If your plans are flexible, these are the best value weeks of the year."], quote: "There is no single best time to visit — only a best place to be in the month you have." },
  { cat: "Experiences", title: "Riding the blue train from Kandy to Ella", date: "2026-08-02", read: "5 min read", author: "Nadeesha Silva", img: IMG.train, excerpt: "Seven hours, 1,500 metres of climbing and the most photographed carriage doorway in Asia. How to do it properly.", body: ["The Kandy–Badulla line was built to move tea, and it still climbs the same way: slowly, in long curves around the shoulders of hills, past estates where pickers wave at the windows. The stretch between Nanu Oya and Ella is the one you have seen in photographs.", "Reserved first-class seats are air-conditioned and sealed, which is comfortable and slightly beside the point. Second class reserved gives you open windows and access to the doorways; third class unreserved is a lottery that sometimes pays off beautifully.", "Board at Kandy rather than Peradeniya so you get a seat before the crowds, sit on the right-hand side heading south for the valley views, and bring more water than you think you need.", "We reserve seats for our travellers weeks in advance and send a guide to hold the carriage door section. It is the one part of a Sri Lankan itinerary where planning ahead genuinely changes the experience."], quote: "Nothing about this train is fast, and that is precisely why people remember it." },
  { cat: "Wildlife", title: "Tracking leopards in Yala without the jeep queue", date: "2026-07-21", read: "6 min read", author: "Ishara Fernando", img: IMG.leopard, excerpt: "Yala has the highest density of leopards on earth. It also has a lot of jeeps. Here is how we avoid one and find the other.", body: ["Block 1 of Yala holds the leopards, the reputation and, in high season, a queue of vehicles at every sighting. The animals are genuinely habituated, which is why photographs from Yala look so close — but a good drive is about being in the right place before anyone else.", "We stay inside the buffer zone so we are at the gate when it opens, we drive with a naturalist rather than a driver, and we spend the first hour on the rock outcrops where leopards sun themselves rather than chasing radio calls.", "Sloth bear season is June and July, when the palu fruit ripens. Elephants are constant. Bird life along the lagoons is extraordinary and almost entirely ignored by other vehicles.", "If you want leopards without any crowding at all, we run the same format in Wilpattu, where sightings are rarer but you may not see another jeep all morning."], quote: "The best sightings happen in the first forty minutes after the gate opens." },
  { cat: "Food", title: "Rice and curry: how to eat like a Sri Lankan", date: "2026-07-09", read: "4 min read", author: "Nadeesha Silva", img: IMG.stilt, excerpt: "One plate, seven bowls, and a set of unwritten rules. A short field guide to the country's best meal.", body: ["A proper rice and curry is not a dish, it is an arrangement: red rice in the middle, then dhal, a coconut sambol, a dry-fried vegetable, something sour, something with fish or chicken, and a papadam on top. You mix a little of everything with your fingertips, one mouthful at a time.", "The pol sambol — grated coconut, chilli, lime, dried fish — is the seasoning for the whole plate. Add it gradually. The gotu kola salad is there to cool things down, and the fried aubergine moju is usually the best thing on the table.", "Eat at a home-cooked lunch stop rather than a hotel buffet. Portions arrive endlessly refilled and nobody is offended if you stop asking for more.", "Breakfast is a separate pleasure entirely: hoppers, string hoppers, kiribath and a fiery lunu miris. Our itineraries build in at least two village cooking sessions."], quote: "Every family claims their pol sambol is the correct one. They are all right." },
  { cat: "Culture", title: "Esala Perahera: inside Kandy's night of drums", date: "2026-06-27", read: "5 min read", author: "Ruwan Perera", img: IMG.perahera, excerpt: "For ten nights each August, Kandy fills with fire dancers, whip crackers and caparisoned elephants. What to expect if you go.", body: ["The Esala Perahera is a procession in honour of the Sacred Tooth Relic, and it grows in size across ten consecutive nights. The final Randoli Perahera is the largest, with dozens of elephants, hundreds of dancers and a crowd that fills every street around the lake.", "Whip crackers clear the route, then fire twirlers, Kandyan dancers, drummers in rows and finally the Maligawa Tusker carrying the relic casket under a canopy. It lasts several hours and the noise is physical.", "Reserved balcony seating along Dalada Veediya is worth the cost; the street-level view is free but you will be standing for four hours with no way out.", "If you are travelling in August, we build the perahera into the itinerary as a fixed point and plan everything else around it."], quote: "You do not watch the perahera so much as stand inside it." },
  { cat: "Travel Guide", title: "Seven days, one island: our most-requested itinerary", date: "2026-06-14", read: "6 min read", author: "Nadeesha Silva", img: IMG.sigiriya, excerpt: "Most first-time visitors have a week. This is how we spend it without turning the trip into a bus tour.", body: ["A week is enough for three regions, not five. We pick the cultural triangle, the hill country and one coast, and we resist adding a fourth. Driving time in Sri Lanka is longer than the map suggests — 100 km can take three hours on a good day.", "Days one to three go north: Sigiriya at dawn, Dambulla's caves, an evening safari at Minneriya. Days four and five climb into the tea country by train, with Horton Plains at sunrise if the weather cooperates.", "Days six and seven drop to the south coast for Galle Fort and a beach that asks nothing of you. Flights out of Colombo are mostly late at night, which buys you a final full day.", "What we leave out: Jaffna, the east coast, Adam's Peak and Sinharaja. They are all worth a trip of their own, which is usually how people end up coming back."], quote: "Three regions in seven days feels generous. Five feels like a commute." },
];

async function main() {
  console.log("Clearing catalogue…");
  await prisma.booking.updateMany({ data: { packageId: null } });
  await prisma.package.deleteMany({});
  await prisma.destination.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.blog.deleteMany({});

  console.log("Seeding categories…");
  const catId: Record<string, number> = {};
  for (let i = 0; i < CATS.length; i++) {
    const c = CATS[i];
    const created = await prisma.category.create({
      data: { title: c.title, slug: c.key, description: c.blurb, coverImage: c.img, cardImage: c.img, isPopular: c.popular, sortOrder: i + 1 },
    });
    catId[c.key] = created.id;
  }

  console.log("Seeding destinations…");
  const destId: Record<string, number> = {};
  for (let i = 0; i < DESTS.length; i++) {
    const d = DESTS[i];
    const created = await prisma.destination.create({
      data: {
        name: d.name, slug: slug(d.name), tag: d.tag, subtitle: d.blurb, description: d.long, shortDesc: d.blurb,
        hero: d.img, gallery: [], rating: d.rating, pinLeft: pct(d.x, 420), pinTop: pct(d.y, 620), isFeatured: i < 6,
      },
    });
    destId[d.name] = created.id;
  }

  console.log("Seeding packages…");
  for (const p of PKGS) {
    const price = num(p.price);
    const was = num(p.was);
    const hasDeal = was > price;
    const journey = p.itinerary.map((d) => ({ day: Number(d.day), title: d.title, description: `${d.body}${d.stay && d.stay !== "Departure" ? `\n\nStay: ${d.stay}` : ""}` }));
    const route = p.stops.slice(0, -1).map((s, i) => ({ from: s, to: p.stops[i + 1], note: "" }));
    const destConnect = p.stops
      .map((s) => destId[s])
      .filter((id): id is number => Boolean(id))
      .map((id) => ({ id }));
    await prisma.package.create({
      data: {
        title: p.title, slug: slug(p.title), summary: p.summary, badge: p.badge ?? null,
        days: p.days, nights: p.nights,
        price: hasDeal ? was : price, dealPrice: hasDeal ? price : null,
        isFeatured: Boolean(p.featured), heroImage: p.img, overview: p.overview,
        gallery: [], journey, route, included: p.includes, excluded: p.excludes, faq: FAQ,
        categoryId: catId[p.catKey] ?? null,
        destinations: destConnect.length ? { connect: destConnect } : undefined,
      },
    });
  }

  console.log("Seeding blog posts…");
  for (const b of POSTS) {
    await prisma.blog.create({
      data: {
        title: b.title, slug: slug(b.title), category: b.cat, excerpt: b.excerpt,
        content: [...b.body, `\n“${b.quote}”`].join("\n\n"),
        coverImage: b.img, author: b.author, isPublished: true, publishedAt: new Date(b.date),
      },
    });
  }

  console.log("✔ Content seeded:", CATS.length, "categories,", DESTS.length, "destinations,", PKGS.length, "packages,", POSTS.length, "posts");
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
