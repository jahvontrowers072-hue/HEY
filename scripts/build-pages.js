// Builds the SEO pieces of the site. Runs on `npm run build` (Vercel runs it on every deploy).
//
//   • Structured data (schema.org JSON-LD) in index.html — business info + FAQ
//   • One page per service (automotive / residential / commercial) that reuses the
//     homepage's nav, footer and legal text, so the phone number etc. live in one place
//   • sitemap.xml and robots.txt
//
// Edit business details in BUSINESS below, service copy in SERVICES, then `npm run build`.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
// The one production domain. Every canonical, sitemap, Open Graph and schema URL is built from it.
const SITE = (process.env.SITE_URL || "https://www.cnspotlessmobilewindowtint.com").replace(/\/$/, "");

// Real pixel sizes of images used as page heroes / social previews (keeps og:image and <img> dimensions honest).
const IMAGE_SIZES = {
  "w-zr1-doors": [1600, 1200],
  "install": [1212, 952],
  "rr-glass": [1280, 720],
  "w-malibu": [1600, 1200],
  "w-gt3": [1600, 900],
  "w-mustang-front": [1600, 1200],
  "w-modely-juniper": [1600, 1200],
};

const BUSINESS = {
  name: "C&N Spotless",
  phone: "+1-954-213-7808",
  phoneDisplay: "(954) 213-7808",
  email: "clayontrowers6@gmail.com",
  region: "South Florida",
  counties: ["Miami-Dade County", "Broward County", "Palm Beach County"],
  areaText: "Miami-Dade, Broward and Palm Beach counties",
  // Service-area business: customers are served at their own address, so no street
  // address is published here or on the site. The service area is described below.
  state: "FL",
  cities: [
    "West Palm Beach",
    "Riviera Beach",
    "Wellington",
    "Lake Worth Beach",
    "Boynton Beach",
    "Delray Beach",
    "Boca Raton",
    "Deerfield Beach",
    "Pompano Beach",
    "Coral Springs",
    "Fort Lauderdale",
    "Lauderdale Lakes",
    "Plantation",
    "Sunrise",
    "Davie",
    "Weston",
    "Dania Beach",
    "Hollywood",
    "Pembroke Pines",
    "Miramar",
    "Hallandale Beach",
    "Aventura",
    "North Miami",
    "Miami Beach",
    "Hialeah",
    "Doral",
    "Miami",
    "Coral Gables",
    "Key Biscayne",
    "Kendall",
  ],
  // Add your real profile links here — they help Google connect the site to your business.
  sameAs: [
    // "https://www.facebook.com/…",
    // "https://www.instagram.com/…",
    // "https://g.page/…",   ← your Google Business Profile link
  ],
};

/* ───────────────────────── service pages ───────────────────────── */

const LAW_TABLE = `
<div class="law">
  <table>
    <caption>Florida Statutes §316.2951 through 316.2956. Medical exemptions are available through the Florida DHSMV. Limits can change, so we confirm the current rules for your vehicle before we install.</caption>
    <thead><tr><th>Window</th><th>Cars &amp; coupes</th><th>SUVs, trucks &amp; vans</th></tr></thead>
    <tbody>
      <tr><td>Windshield</td><td>Non-reflective strip above the AS-1 line only</td><td>Non-reflective strip above the AS-1 line only</td></tr>
      <tr><td>Front side windows</td><td>28% or lighter</td><td>28% or lighter</td></tr>
      <tr><td>Rear side windows</td><td>15% or lighter</td><td>6% or lighter</td></tr>
      <tr><td>Back window</td><td>15% or lighter</td><td>6% or lighter</td></tr>
      <tr><td>Reflectivity</td><td>Front ≤ 25%, rear ≤ 35%</td><td>Front ≤ 25%, rear ≤ 35%</td></tr>
    </tbody>
  </table>
</div>`;

const SERVICES = [
  {
    slug: "automotive-window-tint",
    name: "Automotive Window Tinting",
    short: "Automotive Tint",
    blurb: "Cars, trucks & SUVs",
    title: "Car Window Tinting in South Florida | C&N Spotless",
    desc: "Mobile car, truck & SUV window tinting in your driveway across Miami-Dade, Broward & Palm Beach. Florida-legal shades. (954) 213-7808.",
    tag: "Automotive · South Florida",
    h1: ["Car window tinting,", "<em>done in your driveway.</em>"],
    sub: "Cars, trucks and SUVs tinted at your home or office anywhere in Miami-Dade, Broward or Palm Beach. Florida-legal shades, clean edges, and no day lost at a shop.",
    hero: "w-zr1-doors",
    heroAlt: "Orange Corvette ZR1 with both doors open showing tinted side glass",
    images: [["w-gt3-doors", "Yellow Porsche 911 GT3 with doors open after a window tint install"], ["w-c6-rear", "Tinted rear window on a yellow C6 Corvette"], ["w-mustang-glass", "Freshly tinted door glass on a white Ford Mustang"]],
    body: `
      <h2>Tint that looks factory and keeps you legal in Florida.</h2>
      <p>South Florida sun turns a parked car into an oven and fades dashboards and leather fast. Good window film cuts the heat and glare you feel through the glass and blocks nearly all UV, while giving you privacy on the rear windows. We install it wherever the car already is: your driveway, your office lot, your job site.</p>
      <h3>What we tint</h3>
      <ul>
        <li>Full vehicles: side windows and back glass</li>
        <li>Front two windows only, to match factory-tinted rear glass</li>
        <li>Windshield visor strips (above the AS-1 line)</li>
        <li>Cars, coupes, convertibles, trucks, SUVs and vans</li>
        <li>Removal of old, bubbling or purple tint before re-tinting</li>
      </ul>
      <h3 id="privacy-tint">Privacy tint</h3>
      <p>If you want people to see less of what's inside, the rear side windows and back glass are where you can go darker. Florida allows 15% on those windows for cars and coupes, and 6% for SUVs, trucks and vans, while the front side windows stay at 28% or lighter. We'll match the shade to your vehicle type so the car looks consistent and stays legal. For privacy at home, see <a href="/residential-window-tint#daytime-privacy">residential privacy film</a>.</p>
      <h3 id="windshield-strips">Windshield strips</h3>
      <p>A windshield strip is a band of film across the top of the windshield that cuts glare from a low sun. Florida only allows non-reflective film above the AS-1 line, the small mark printed near the top edge of most windshields, so we cut the strip to that line rather than guessing at a width.</p>
      <h3>Choosing a film</h3>
      <p>How dark a film looks and how much heat it blocks are two different things. Standard dyed films mostly add privacy; carbon and ceramic films reject far more infrared heat, even in lighter shades, and don't fade to purple. We'll show you the manufacturer's specs for each option so you can compare real numbers before you pick.</p>
      <h3>Florida window tint law</h3>
      <p>Florida sets separate limits for the front side windows and the rear windows, and they differ between cars and SUVs/trucks/vans. The percentage is how much light the film lets through. Lower is darker.</p>
      ${LAW_TABLE}
      <p style="margin-top:18px">Tell us the vehicle when you ask for a quote and we'll recommend the darkest shade that stays legal.</p>
      <h3>How a mobile install works</h3>
      <p>Most full vehicles take about 2 to 4 hours. We need a reasonably sheltered spot: a garage, carport or shaded driveway is ideal, since wind and dust are the enemy of a clean install. Afterwards, leave the windows up for 3 to 5 days while the film cures; a little haze or a few small water pockets during that time is normal and clears on its own.</p>`,
    faqs: [
      ["How much does car window tinting cost in South Florida?", "It depends on the vehicle, how many windows, the film you choose and whether old tint needs removing. Send us the year, make and model and we'll give you an exact price before anything is booked."],
      ["Can you tint my car at my apartment or office?", "Yes, that's how we work. We come to your home, apartment complex, office or job site anywhere in Miami-Dade, Broward or Palm Beach. We just need a spot that's reasonably out of the wind and dust."],
      ["Can I roll my windows down after tinting?", "Wait 3 to 5 days. The film needs that time to cure and bond to the glass; rolling the window down early can catch the bottom edge and lift it."],
    ],
  },
  {
    slug: "residential-window-tint",
    name: "Residential Window Tinting",
    short: "Residential Tint",
    blurb: "Homes & condos",
    title: "Home Window Tinting in South Florida | C&N Spotless",
    desc: "Residential window film in Miami-Dade, Broward & Palm Beach. Cut heat, glare & UV fading from Miami to West Palm. We come to you: (954) 213-7808.",
    tag: "Residential · South Florida",
    h1: ["Home window film", "<em>for the Florida sun.</em>"],
    sub: "Take the heat and glare out of hot rooms, protect floors and furniture from fading, and add daytime privacy, installed at your home anywhere in Miami-Dade, Broward or Palm Beach.",
    hero: "install",
    heroAlt: "Window film being squeegeed onto glass during an installation",
    images: [["install", "Window film being installed on glass with a squeegee"], ["w-mustang-glass", "Tinted glass reflecting palm trees"], ["rr-glass", "Tinted glass reflecting the sky and trees"]],
    body: `
      <h2 id="heat-and-glare">Cooler rooms. Less glare. Nothing fading.</h2>
      <p>West- and south-facing windows in South Florida can make a room unusable by mid-afternoon. Residential window film cuts the solar heat and glare coming through the glass and blocks nearly all UV (the main cause of faded floors, furniture and artwork) while you keep your view.</p>
      <h3>Good fits for home window film</h3>
      <ul>
        <li>Living rooms and bedrooms that bake in the afternoon sun</li>
        <li>Home offices and TV rooms with glare on screens</li>
        <li>Sunrooms, Florida rooms and sliding glass doors</li>
        <li>Street-facing windows where you want daytime privacy</li>
        <li>Condos and high-rise units with floor-to-ceiling glass</li>
      </ul>
      <h3>Choosing the right film</h3>
      <p>There's a range from nearly clear heat-control films, which barely change how your windows look, to darker and reflective films that add privacy. Darker isn't automatically cooler; the heat rejection depends on the film's construction. We'll walk you through the options for each room and show you the specs.</p>
      <h3 id="daytime-privacy">Daytime privacy</h3>
      <p>Darker and reflective films make it hard to see in during the day while you can still see out. At night, with lights on inside, that reverses, so rooms that need privacy after dark still need blinds or curtains. We'll help you choose a film that fits how you use each room. Tinting a vehicle for privacy instead? See <a href="/automotive-window-tint#privacy-tint">automotive privacy tint</a>.</p>
      <h3>Condos and HOAs</h3>
      <p>Many South Florida condo associations and HOAs have rules about how tinted windows look from outside, usually the shade or how reflective it is. If you're in one, check with your association first; we're happy to provide film samples and spec sheets for their approval.</p>
      <h3>How it works</h3>
      <p>Tell us roughly how many windows and their sizes (photos help) and we'll quote it. On install day we clean the glass, fit the film to each pane and clean up after ourselves. Film can look slightly hazy for a few days while it cures. That's normal and clears on its own.</p>`,
    faqs: [
      ["Does window film really make a room cooler?", "Yes, solar control film reduces the heat coming through sunny windows, which makes a noticeable difference in rooms that get direct sun. How much depends on the film, so we'll show you each option's heat-rejection rating."],
      ["Will tinting my windows make my house dark inside?", "Not unless you want it to. Many heat-control films are light or nearly clear. You choose the balance between light, heat reduction and privacy."],
      ["Can you tint sliding glass doors and sunrooms?", "Yes. Sliders, French doors, sunrooms and Florida rooms are some of the most common residential jobs we do."],
    ],
  },
  {
    slug: "commercial-window-tint",
    name: "Commercial Window Tinting",
    short: "Commercial Tint",
    blurb: "Offices, storefronts & fleets",
    title: "Commercial Window Tinting in South Florida | C&N Spotless",
    desc: "Office, storefront & fleet window tinting across Miami-Dade, Broward & Palm Beach, installed around your business hours. Free quote: (954) 213-7808.",
    tag: "Commercial · South Florida",
    h1: ["Commercial window tint,", "<em>on your schedule.</em>"],
    sub: "Offices, storefronts and fleet vehicles across Miami-Dade, Broward and Palm Beach, installed around your hours so the work never shuts you down.",
    hero: "rr-glass",
    heroAlt: "Tinted side glass on a luxury coupe reflecting palm trees",
    images: [["w-modely", "White Tesla Model Y with tinted windows"], ["rr-glass", "Tinted side glass reflecting palm trees"], ["install", "Window film installation in progress"]],
    body: `
      <h2>Comfortable workspaces. Protected stock. No downtime.</h2>
      <p>Sun through big panes of commercial glass means hot offices, glare on screens and faded merchandise in the window. Commercial window film tackles all three and blocks nearly all UV. And because we're mobile, we come to you and work around your opening hours.</p>
      <h3>What we do for businesses</h3>
      <ul>
        <li><b>Offices</b>: cut heat and screen glare, add privacy for conference rooms and ground-floor offices</li>
        <li><b>Storefronts &amp; retail</b>: reduce fading on products in window displays and keep the front of the store comfortable</li>
        <li><b>Restaurants &amp; waiting areas</b>: take the glare and heat out of window seating</li>
        <li><b>Fleet vehicles</b>: consistent, Florida-legal tint across company cars, trucks and vans</li>
      </ul>
      <h3>Scheduled around your business</h3>
      <p>We can install before you open, after close or on weekends so customers and staff aren't disrupted. For larger buildings, we'll quote by the number and size of the windows and can work in stages.</p>
      <h3>Fleet tinting</h3>
      <p>Company vehicles have to follow the same Florida tint limits as personal cars: 28% on the front side windows, with the rear limit depending on whether it's a car (15%) or an SUV, truck or van (6%). We'll keep every vehicle in your fleet legal and matching.</p>
      <h3>Getting a quote</h3>
      <p>Send us the address, roughly how many windows (or vehicles), and photos if you have them. We'll come back with a film recommendation and a price.</p>`,
    faqs: [
      ["Can you tint our office after business hours?", "Yes. We regularly schedule commercial installs early in the morning, after close or on weekends so there's no disruption."],
      ["Do you tint company fleets?", "Yes, cars, trucks and vans, all kept within Florida's legal limits and matched across the fleet. We come to your lot."],
      ["Will window film help protect merchandise from fading?", "Window film blocks nearly all UV light, which is a major cause of fading. It reduces fading substantially, though no film stops it completely because visible light and heat also contribute."],
    ],
  },
];

/* ───────────────────────── city pages ─────────────────────────
   One page per main city. Each has its own copy and FAQs (no swapped-name templates),
   and only states what's true of the business: mobile service, Florida tint law, how installs work. */

const SVC_LINKS = `<a href="/automotive-window-tint">car window tinting</a>, <a href="/residential-window-tint">home window film</a> and <a href="/commercial-window-tint">commercial tinting</a>`;

const CITY_PAGES = [
  {
    slug: "window-tinting-west-palm-beach",
    city: "West Palm Beach",
    county: "Palm Beach County",
    name: "Window Tinting in West Palm Beach",
    short: "West Palm Beach",
    title: "Mobile Window Tinting in West Palm Beach, FL | C&N Spotless",
    desc: "Mobile window tinting in West Palm Beach for cars, homes and businesses. We come to your driveway, condo or office. Florida-legal shades. (954) 213-7808.",
    tag: "West Palm Beach · Palm Beach County",
    h1: ["Window tinting in", "<em>West Palm Beach.</em>"],
    sub: "Cars, homes and storefronts tinted at your address in West Palm Beach, from downtown and Northwood to the neighborhoods along the Intracoastal.",
    hero: "w-malibu",
    heroAlt: "Light blue classic Chevrolet Malibu with dark tinted windows",
    images: [["w-modely", "White Tesla Model Y in a driveway with the front door open showing tinted glass"], ["w-mustang-glass", "Freshly tinted door glass on a white Ford Mustang"], ["w-c6-rear", "Tinted rear window on a yellow C6 Corvette"]],
    nearby: ["Riviera Beach", "Lake Worth Beach", "Wellington", "Boynton Beach"],
    body: `
      <h2>Mobile window tinting across West Palm Beach.</h2>
      <p>C&amp;N Spotless brings the film, tools and setup to you anywhere in West Palm Beach. There's no shop to drop the car at and no afternoon lost in a waiting room: we tint your car in your driveway or parking lot, and your home or business where the glass already is. We offer ${SVC_LINKS}.</p>
      <h3>Cars, trucks and SUVs</h3>
      <p>Palm Beach sun bakes a parked car fast, and the glare off the water and the Intracoastal doesn't help. Ceramic and carbon films cut the heat you feel through the glass, block nearly all UV, and keep your dash and seats from fading. We'll recommend the darkest shade that stays legal for your vehicle, since Florida sets different limits for cars than for SUVs, trucks and vans.</p>
      <h3>Homes and condos</h3>
      <p>West Palm Beach has a lot of condos and HOA communities, and many associations have rules about how tinted windows look from outside. If yours does, check with them first; we can provide film samples and spec sheets for their approval. Residential film cuts heat and glare in sun-facing rooms and protects floors and furniture from UV fading.</p>
      <h3>Offices and storefronts</h3>
      <p>For downtown offices and storefronts, we install before you open, after you close or on weekends, so staff and customers aren't disrupted. Film evens out glare on screens, keeps front-of-store displays from fading, and can add daytime privacy to street-facing glass.</p>
      <h3>Staying legal in Florida</h3>
      <p>Florida limits front side windows to 28% or lighter, and rear side and back windows to 15% on cars or 6% on SUVs, trucks and vans. The full table is on our <a href="/automotive-window-tint">automotive tint page</a>.</p>`,
    faqs: [
      ["Do you come to condos and apartment complexes in West Palm Beach?", "Yes. We tint in parking lots and garages at condos, apartments and offices across West Palm Beach. We just need a reasonably sheltered spot out of the wind and dust, and permission to work there if your building requires it."],
      ["How long does car window tinting take?", "Most full vehicles take about 2 to 4 hours. Afterwards, keep the windows up for 3 to 5 days while the film cures."],
      ["Do I need HOA approval for home window film in Palm Beach County?", "Many condo associations and HOAs have rules about the shade or reflectivity of window film. Check with yours before booking; we'll give you samples and spec sheets to submit for approval."],
    ],
  },
  {
    slug: "window-tinting-boca-raton",
    city: "Boca Raton",
    county: "Palm Beach County",
    name: "Window Tinting in Boca Raton",
    short: "Boca Raton",
    title: "Mobile Window Tinting in Boca Raton, FL | C&N Spotless",
    desc: "Window tinting in Boca Raton at your home, office or gated community. Ceramic and carbon films for cars, homes and businesses. Free quote: (954) 213-7808.",
    tag: "Boca Raton · Palm Beach County",
    h1: ["Window tinting in", "<em>Boca Raton.</em>"],
    sub: "Mobile tinting for cars, homes and offices in Boca Raton, installed in your driveway, garage or office lot, with Florida-legal shades and clean edges.",
    hero: "w-gt3",
    heroAlt: "Yellow Porsche 911 GT3 front view with the driver door open",
    images: [["w-zr1-front", "Orange Corvette ZR1 head-on after a tint install"], ["w-modely-juniper", "White Tesla Model Y with dark tinted glass reflecting palm trees"], ["w-c6-rear", "Tinted rear window on a yellow C6 Corvette"]],
    nearby: ["Delray Beach", "Deerfield Beach", "Boynton Beach", "Coral Springs"],
    body: `
      <h2>Tint installed where your car already is.</h2>
      <p>Boca Raton drivers don't need to leave the car at a shop for the day. C&amp;N Spotless is fully mobile: we come to your home, your office or your community and do the install on site. We offer ${SVC_LINKS}, all with the same care and clean-up.</p>
      <h3>Luxury and performance vehicles</h3>
      <p>We regularly tint high-end and performance cars, so we take the extra care they need: interior panels protected, film cut to the glass, and a careful clean-up afterwards. Ceramic film is the usual pick here because it rejects a lot of heat even in lighter shades and won't fade to purple over time.</p>
      <h3>Gated communities and HOAs</h3>
      <p>Many Boca Raton communities are gated or managed by an HOA. Let us know if we'll need a gate pass or approval to work on site. For homes, associations often have rules about how film looks from outside, so check first; we can supply samples and spec sheets.</p>
      <h3>Home window film</h3>
      <p>Residential film takes the heat and glare out of sunny rooms and blocks nearly all UV, which helps protect flooring, furniture and art from fading. Darker and reflective films add daytime privacy, though at night with the lights on you'll still want blinds.</p>
      <h3>Offices and medical suites</h3>
      <p>For offices, we install around your hours so patients, clients and staff aren't disrupted. Film cuts glare on screens and keeps west-facing rooms cooler through the afternoon.</p>
      <h3>Florida tint limits</h3>
      <p>Front side windows must stay at 28% or lighter. Rear side and back windows can go to 15% on cars or 6% on SUVs, trucks and vans. See the full table on our <a href="/automotive-window-tint">automotive tint page</a>.</p>`,
    faqs: [
      ["Can you tint my car inside a gated community in Boca Raton?", "Yes. Just let us know ahead of time if we need a gate pass or your community's approval to work on site."],
      ["Which film is best for a luxury car?", "Most owners choose ceramic film. It rejects much more heat than standard dyed film, stays clear for electronics and GPS, and won't turn purple. We'll show you the manufacturer's specs so you can compare."],
      ["Do you tint offices in Boca Raton outside business hours?", "Yes. We can work early in the morning, after close or on weekends so your office keeps running normally."],
    ],
  },
  {
    slug: "window-tinting-fort-lauderdale",
    city: "Fort Lauderdale",
    county: "Broward County",
    name: "Window Tinting in Fort Lauderdale",
    short: "Fort Lauderdale",
    title: "Mobile Window Tinting in Fort Lauderdale, FL | C&N Spotless",
    desc: "Fort Lauderdale mobile window tinting for cars, homes and businesses, installed at your home or office. Florida-legal shades. Call (954) 213-7808.",
    tag: "Fort Lauderdale · Broward County",
    h1: ["Window tinting in", "<em>Fort Lauderdale.</em>"],
    sub: "We tint cars, homes and businesses at your address in Fort Lauderdale, from Las Olas and Victoria Park to Coral Ridge and the canal neighborhoods.",
    hero: "w-mustang-front",
    heroAlt: "White Ford Mustang convertible with both doors open and tinted windows",
    images: [["w-zr1-doors", "Orange Corvette ZR1 with both doors open showing tinted side glass"], ["w-modely", "White Tesla Model Y in a driveway with the front door open showing tinted glass"], ["w-mustang-glass", "Freshly tinted door glass on a white Ford Mustang"]],
    nearby: ["Wilton Manors", "Oakland Park", "Plantation", "Dania Beach", "Hollywood"],
    body: `
      <h2>Fort Lauderdale window tinting, brought to you.</h2>
      <p>C&amp;N Spotless is based in Broward County and works across Fort Lauderdale. We're a mobile service, so we come to your driveway, office lot or job site with everything we need. We offer ${SVC_LINKS}.</p>
      <h3>Car tint for Fort Lauderdale heat</h3>
      <p>Between the sun, the humidity and the glare off the water, cars here heat up quickly. Quality film cuts the heat and glare coming through the glass, blocks nearly all UV and adds privacy on the rear windows. Convertibles, coupes, trucks and SUVs are all fine; we'll match the shade to your vehicle type so it stays legal.</p>
      <h3>Homes near the water</h3>
      <p>Waterfront and canal-side homes get a lot of reflected light. Window film cuts that glare and the heat in sun-facing rooms, and protects floors and furniture from fading. If you're in a condo or HOA community, check their rules on how film looks from outside before booking; we'll provide samples for approval.</p>
      <h3>Businesses and fleets</h3>
      <p>We tint storefronts and offices around your hours, and we can tint company cars, trucks and vans in your own lot, all kept within Florida's legal limits and matched across the fleet.</p>
      <h3>Florida tint law in brief</h3>
      <p>Front side windows: 28% or lighter. Rear side and back windows: 15% for cars, 6% for SUVs, trucks and vans. Windshields can only take a non-reflective strip above the AS-1 line. The full table is on our <a href="/automotive-window-tint">automotive tint page</a>.</p>`,
    faqs: [
      ["Are you local to Fort Lauderdale?", "Yes. C&N Spotless is based in Broward County and serves Fort Lauderdale and the surrounding cities as a mobile service, so we come to you."],
      ["Can you tint a car in a parking garage?", "Yes, a covered garage is actually ideal because it keeps wind and dust off the glass. Just make sure we have permission to work there and room to open the doors."],
      ["Do you tint company fleets in Fort Lauderdale?", "Yes. We come to your lot and tint cars, trucks and vans to matching, Florida-legal shades."],
    ],
  },
  {
    slug: "window-tinting-miami",
    city: "Miami",
    county: "Miami-Dade County",
    name: "Window Tinting in Miami",
    short: "Miami",
    title: "Mobile Window Tinting in Miami, FL | C&N Spotless",
    desc: "Mobile window tinting in Miami. We tint cars, condos, homes and storefronts at your address, including high-rise garages. Free quote: (954) 213-7808.",
    tag: "Miami · Miami-Dade County",
    h1: ["Window tinting in", "<em>Miami.</em>"],
    sub: "Car, home and commercial window tinting at your address in Miami, from Brickell and Downtown to Coconut Grove, Little Havana and Kendall.",
    hero: "w-modely-juniper",
    heroAlt: "White Tesla Model Y with dark tinted windshield and side glass reflecting palm trees",
    images: [["w-gt3-doors", "Yellow Porsche 911 GT3 with doors open after a window tint install"], ["w-malibu", "Classic Chevrolet Malibu with dark tinted windows"], ["w-zr1-front", "Orange Corvette ZR1 head-on after a tint install"]],
    nearby: ["Miami Beach", "Coral Gables", "Doral", "Hialeah", "Key Biscayne"],
    body: `
      <h2>Miami window tinting without the shop visit.</h2>
      <p>Getting to a tint shop in Miami traffic can eat half a day. C&amp;N Spotless comes to you instead: your building's garage, your driveway or your office lot. We offer ${SVC_LINKS} across Miami and the rest of Miami-Dade.</p>
      <h3>High-rise and condo garages</h3>
      <p>A covered parking garage is one of the best places to tint a car, since it keeps wind and dust off the glass. If you live or work in a high-rise, we can usually do the install right in your space. Check that your building allows contractors to work in the garage, and let us know about any access or parking passes.</p>
      <h3>Heat, glare and privacy for your car</h3>
      <p>Miami sun is strong year-round. Ceramic and carbon films reject far more infrared heat than standard dyed films, block nearly all UV, and add privacy on the rear windows. We'll recommend the darkest shade that keeps your vehicle legal under Florida law.</p>
      <h3>Condos and homes</h3>
      <p>Floor-to-ceiling glass lets in a lot of heat and glare. Residential film cuts both and protects floors and furniture from fading. Most condo associations have rules about how film looks from outside, so check with yours first; we'll provide samples and spec sheets for approval.</p>
      <h3>Storefronts and offices</h3>
      <p>For shops and offices, we work around your hours, before opening, after close or on weekends, so business carries on as normal.</p>
      <h3>Florida tint limits</h3>
      <p>Front side windows must let in at least 28% of light. Rear side and back windows can go to 15% on cars or 6% on SUVs, trucks and vans. See the full table on our <a href="/automotive-window-tint">automotive tint page</a>.</p>`,
    faqs: [
      ["Can you tint my car in my building's parking garage in Miami?", "Usually, yes. A covered garage is ideal for a clean install. Check that your building allows contractors to work there, and tell us about any access or parking passes we'll need."],
      ["Do you serve all of Miami-Dade?", "Yes. We cover Miami and the rest of Miami-Dade, including Miami Beach, Coral Gables, Doral, Hialeah, Kendall and Key Biscayne."],
      ["Can you tint floor-to-ceiling condo windows?", "Yes. We'll measure the glass and recommend a film that cuts heat and glare. Many condo associations have rules about how film looks from outside, so check with yours first and we'll provide samples for approval."],
    ],
  },
];

/* ───────────────────────── helpers ───────────────────────── */

const esc = (s) => String(s).replace(/&(?!amp;|lt;|gt;|quot;|#)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const strip = (s) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
const ld = (obj) => `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2).replace(/</g, "\\u003c")}\n</script>`;
function between(src, startMarker, endMarker) {
  const a = src.indexOf(startMarker), b = src.indexOf(endMarker, a);
  if (a < 0 || b < 0) throw new Error(`Marker not found: ${startMarker}`);
  return src.slice(a, b);
}
function replaceBlock(src, name, content) {
  const re = new RegExp(`(<!-- @${name}:[^>]*-->)[\\s\\S]*?(<!-- @end -->)`);
  if (!re.test(src)) throw new Error(`Block @${name} not found in index.html`);
  return src.replace(re, `$1\n${content}\n$2`);
}
// Homepage-relative links (#services) must point back to the homepage (/#services) on other pages.
const rootLinks = (html) => html
  .replace(/href="#top"/g, 'href="/"')
  .replace(/href="#([a-z][\w-]*)"/g, 'href="/#$1"');

/* ───────────────────────── schema ───────────────────────── */

const businessId = `${SITE}/#business`;
// Cars, homes and businesses: both LocalBusiness subtypes apply.
const BUSINESS_TYPES = ["AutomotiveBusiness", "HomeAndConstructionBusiness"];
const businessSchema = {
  "@context": "https://schema.org",
  "@type": BUSINESS_TYPES,
  "@id": businessId,
  name: BUSINESS.name,
  alternateName: "C&N Spotless Mobile Window Tinting",
  description: `Mobile window tinting for cars, homes and businesses across ${BUSINESS.areaText}, Florida. We install at your home, office or job site.`,
  url: `${SITE}/`,
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  image: [`${SITE}/assets/w-zr1-doors.jpg`, `${SITE}/assets/w-gt3-doors.jpg`, `${SITE}/assets/w-c6-rear.jpg`],
  logo: `${SITE}/assets/logo-full.png`,
  // No priceRange: the site doesn't publish prices, so none is claimed here.
  // Region only: a mobile, service-area business with no customer-facing premises.
  address: { "@type": "PostalAddress", addressRegion: BUSINESS.state, addressCountry: "US" },
  areaServed: [
    ...BUSINESS.counties.map((c) => ({
      "@type": "AdministrativeArea",
      name: `${c}, ${BUSINESS.state}`,
      containedInPlace: { "@type": "State", name: "Florida" },
    })),
    ...BUSINESS.cities.map((c) => ({ "@type": "City", name: `${c}, ${BUSINESS.state}` })),
  ],
  openingHoursSpecification: [{
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "08:30", closes: "18:00",
  }],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Window tinting services",
    itemListElement: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name, url: `${SITE}/${s.slug}` },
    })),
  },
  ...(BUSINESS.sameAs.length ? { sameAs: BUSINESS.sameAs } : {}),
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE}/#website`,
  name: BUSINESS.name,
  url: `${SITE}/`,
  inLanguage: "en-US",
  publisher: { "@id": businessId },
};

const faqSchema = (pairs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: pairs.map(([q, a]) => ({ "@type": "Question", name: strip(q), acceptedAnswer: { "@type": "Answer", text: strip(a) } })),
});

/* ───────────────────────── cache busting ───────────────────────── */

// site.css?v=<hash>: browsers cache it for a month, yet get changes the moment the file changes.
const version = (file) => crypto.createHash("sha1").update(fs.readFileSync(path.join(ROOT, "assets", file))).digest("hex").slice(0, 10);
const CSS_V = version("site.css"), JS_V = version("site.js");
const stamp = (html) => html
  .replace(/\/assets\/site\.css(\?v=\w+)?/g, `/assets/site.css?v=${CSS_V}`)
  .replace(/\/assets\/site\.js(\?v=\w+)?/g, `/assets/site.js?v=${JS_V}`);

/* ───────────────────────── homepage ───────────────────────── */

const indexPath = path.join(ROOT, "index.html");
let index = fs.readFileSync(indexPath, "utf8");

const homeFaqs = [...index.matchAll(/<button class="faq-q"[^>]*><span>([\s\S]*?)<\/span>[\s\S]*?<div class="faq-a"><div><p>([\s\S]*?)<\/p>/g)]
  .map((m) => [m[1], m[2]]);
index = replaceBlock(index, "business-schema", ld(businessSchema) + "\n" + ld(websiteSchema));
index = replaceBlock(index, "faq-schema", ld(faqSchema(homeFaqs)));
index = stamp(index);
fs.writeFileSync(indexPath, index);

/* ───────────────────────── service pages ───────────────────────── */

const headFonts = between(index, '<link rel="preconnect" href="https://fonts.googleapis.com">', "<!-- @business-schema");
const chrome = rootLinks(between(index, "<!-- ========== NAV ========== -->", "<main id=\"main\">"));
const tail = rootLinks(between(index, "<!-- ========== FOOTER ========== -->", "<!-- ========== LIGHTBOX ========== -->"))
  + between(index, "<!-- ========== LEGAL MODALS ========== -->", '<script src="/assets/site.js');

function img(name, alt, attrs = "") {
  // w-* photos use their 800px versions (4:3); others use their real dimensions.
  const [w, h] = name.startsWith("w-") ? [800, 600] : (IMAGE_SIZES[name] || [1600, 1200]);
  return `<img src="/assets/${name}${name.startsWith("w-") ? "-800" : ""}.jpg" alt="${esc(alt)}" loading="lazy" decoding="async" width="${w}" height="${h}"${attrs}>`;
}

function servicePage(s) {
  const url = `${SITE}/${s.slug}`;
  const heroSrc = `/assets/${s.hero}.jpg`;
  const [heroW, heroH] = IMAGE_SIZES[s.hero];
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: s.name, item: url },
    ],
  };
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.city ? `Mobile Window Tinting in ${s.city}, FL` : `${s.name} in ${BUSINESS.region}`,
    serviceType: s.city ? "Window Tinting" : s.name,
    url,
    description: s.desc,
    provider: { "@id": businessId, "@type": BUSINESS_TYPES, name: BUSINESS.name, telephone: BUSINESS.phone, url: `${SITE}/` },
    // City pages name their own city (inside its county); service pages cover the whole region.
    areaServed: s.city
      ? [{ "@type": "City", name: `${s.city}, ${BUSINESS.state}`, containedInPlace: { "@type": "AdministrativeArea", name: `${s.county}, ${BUSINESS.state}` } }]
      : businessSchema.areaServed,
  };

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(s.title)}</title>
<meta name="description" content="${esc(s.desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#08080A">
<meta name="geo.region" content="US-FL">
<meta name="geo.placename" content="${s.city || BUSINESS.region}, Florida">
<meta property="og:type" content="website">
<meta property="og:locale" content="en_US">
<meta property="og:site_name" content="${esc(BUSINESS.name)}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(s.title)}">
<meta property="og:description" content="${esc(s.desc)}">
<meta property="og:image" content="${SITE}${heroSrc}">
<meta property="og:image:width" content="${heroW}">
<meta property="og:image:height" content="${heroH}">
<meta property="og:image:alt" content="${esc(s.heroAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(s.title)}">
<meta name="twitter:description" content="${esc(s.desc)}">
<meta name="twitter:image" content="${SITE}${heroSrc}">
<meta name="twitter:image:alt" content="${esc(s.heroAlt)}">
<link rel="icon" href="/assets/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="/assets/favicon.png">
<link rel="preload" as="image" href="${heroSrc}" fetchpriority="high">
${headFonts.trim()}
${ld(service)}
${ld(breadcrumb)}
${ld(faqSchema(s.faqs))}
<link rel="stylesheet" href="/assets/site.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<!-- Generated by scripts/build-pages.js — edit the SERVICES data there, not this file. -->

${chrome}<main id="main">
<section class="hero phero">
  <div class="hero-media"><img src="${heroSrc}" alt="" fetchpriority="high" width="${heroW}" height="${heroH}"></div>
  <div class="hero-sweep" aria-hidden="true"></div>
  <div class="wrap hero-in">
    <nav aria-label="Breadcrumb"><ol class="crumbs"><li><a href="/">Home</a></li><li aria-current="page">${esc(s.name)}</li></ol></nav>
    <span class="hero-tag"><i></i> ${esc(s.tag)}</span>
    <h1>${s.h1.map((l) => `<span class="ln">${l.startsWith("<em>") ? l : `<span>${l}</span>`}</span>`).join(" ")}</h1>
    <p class="hero-sub">${s.sub}</p>
    <div class="hero-btns">
      <a class="btn btn-red" href="/#quote">Get a Free Quote</a>
      <a class="btn btn-ghost" href="tel:${BUSINESS.phone.replace(/-/g, "")}">Call ${BUSINESS.phoneDisplay}</a>
    </div>
  </div>
</section>

<section class="sect">
  <div class="wrap split">
    <article class="prose rv">${s.body}
    </article>
    <div class="split-media rv rv-d1">
      ${s.images.map(([n, a]) => img(n, a)).join("\n      ")}
    </div>
  </div>
</section>

<section class="sect why">
  <div class="wrap faq-layout">
    <div class="rv">
      <span class="eyebrow">FAQ</span>
      <h2>${s.city ? `${esc(s.city)} tinting questions.` : `${esc(s.short)} questions.`}</h2>
      <div class="faq-aside" style="margin-top:34px">
        <h3>Want a price?</h3>
        <p>Tell us what needs tinting and where you are in ${s.city || BUSINESS.region}. We'll come back with a recommendation and a quote.</p>
        <a class="btn btn-red btn-sm" href="/#quote" style="width:100%">Get a Free Quote</a>
      </div>
    </div>
    <div class="faq-list rv rv-d1">
${s.faqs.map(([q, a]) => `      <div class="faq-item">
        <button class="faq-q" aria-expanded="false"><span>${q}</span><span class="faq-ic" aria-hidden="true"></span></button>
        <div class="faq-a"><div><p>${a}</p></div></div>
      </div>`).join("\n")}
    </div>
  </div>
</section>

<section class="sect">
  <div class="wrap">
    <div class="sect-head rv">
      <span class="eyebrow">Service Area</span>
${s.city
      ? `      <h2>Serving ${esc(s.city)} and nearby.</h2>
      <p class="lede">We also come to ${s.nearby.join(", ")} and everywhere else in ${BUSINESS.areaText}.</p>`
      : `      <h2>Mobile ${esc(s.name.toLowerCase())} across ${BUSINESS.region}.</h2>
      <p class="lede">We come to you in ${BUSINESS.cities.slice(0, -1).join(", ")} and ${BUSINESS.cities.at(-1)}.</p>`}
    </div>
    <nav class="related rv" aria-label="Our services">
${SERVICES.map((o) => `      <a href="/${o.slug}"${o.slug === s.slug ? ' aria-current="page"' : ""}><b>${esc(o.short)}</b><span>${esc(o.blurb)}</span></a>`).join("\n")}
    </nav>
  </div>
</section>

<section class="sect fcta">
  <div class="fcta-bg"><img src="/assets/cabin-pov.jpg" alt="" loading="lazy" width="1500" height="1125"></div>
  <div class="wrap rv">
    <span class="eyebrow" style="justify-content:center">Ready When You Are</span>
    <h2>${s.city ? `Get a free window tint quote in ${esc(s.city)}.` : `Get a free ${esc(s.short.toLowerCase())} quote.`}</h2>
    <p>Tell us what needs tinting and where you are. We'll bring the shop to you.</p>
    <div class="fcta-btns">
      <a class="btn btn-red" href="/#quote">Get a Free Quote</a>
      <a class="btn btn-ghost" href="tel:${BUSINESS.phone.replace(/-/g, "")}">Call ${BUSINESS.phoneDisplay}</a>
    </div>
  </div>
</section>
</main>

${tail}<script src="/assets/site.js" defer></script>
</body>
</html>
`;
}

for (const s of [...SERVICES, ...CITY_PAGES]) fs.writeFileSync(path.join(ROOT, `${s.slug}.html`), stamp(servicePage(s)));

// 404 page — same look, points people back to something useful. Not in the sitemap.
fs.writeFileSync(path.join(ROOT, "404.html"), stamp(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Page not found | ${esc(BUSINESS.name)}</title>
<meta name="robots" content="noindex">
<link rel="icon" href="/assets/favicon.png" type="image/png">
${headFonts.trim()}
<link rel="stylesheet" href="/assets/site.css">
</head>
<body>
${chrome}<main id="main">
<section class="hero phero">
  <div class="hero-media"><img src="/assets/hero-poster.jpg" alt="" width="1280" height="720"></div>
  <div class="wrap hero-in">
    <span class="hero-tag"><i></i> 404 · Page not found</span>
    <h1><span class="ln"><span>That page</span></span> <span class="ln"><em>isn't here.</em></span></h1>
    <p class="hero-sub">It may have moved. Head back to the homepage, or get in touch for a free quote.</p>
    <div class="hero-btns">
      <a class="btn btn-red" href="/">Back to Home</a>
      <a class="btn btn-ghost" href="tel:${BUSINESS.phone.replace(/-/g, "")}">Call ${BUSINESS.phoneDisplay}</a>
    </div>
  </div>
</section>
</main>
${tail}<script src="/assets/site.js" defer></script>
</body>
</html>
`));

/* ───────────────────────── sitemap + robots ───────────────────────── */

const today = new Date().toISOString().slice(0, 10);
const urls = [{ loc: `${SITE}/`, pri: "1.0" }, ...SERVICES.map((s) => ({ loc: `${SITE}/${s.slug}`, pri: "0.8" })), ...CITY_PAGES.map((c) => ({ loc: `${SITE}/${c.slug}`, pri: "0.7" }))];
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.pri}</priority></url>`).join("\n")}
</urlset>
`);
fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);

console.log(`SEO build: index schema (${homeFaqs.length} FAQs) + ${SERVICES.length} service pages + ${CITY_PAGES.length} city pages + sitemap.xml + robots.txt`);
