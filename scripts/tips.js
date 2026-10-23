// "Tint Tips" articles. Each one answers a question customers actually search,
// links to the matching service page and ends with the quote form.
// Facts only: Florida's tint statutes, how film types differ, standard aftercare.
// No invented statistics, prices or savings figures.

export const TIPS_HUB = {
  slug: "tint-tips",
  title: "Window Tint Tips and Guides | C&N Spotless",
  desc: "Straight answers about window tint in Florida: legal limits, ceramic vs carbon film, cure time, back-window tint and home window film.",
  hero: "install",
  heroAlt: "Window film being installed on a vehicle's door glass",
};

export const TIPS = [
  {
    slug: "florida-window-tint-law",
    date: "2026-10-22",
    read: 5,
    title: "Florida Window Tint Law: How Dark Can You Go? | C&N Spotless",
    headline: "Florida window tint law: how dark can you go?",
    h1: ["Florida tint law,", "<em>in plain English.</em>"],
    desc: "Florida's legal tint limits for cars, SUVs and trucks: front windows 28%, rear 15% or 6%, windshield strips, reflectivity and medical exemptions.",
    sub: "How dark you can legally tint each window in Florida, why SUVs and cars have different limits, and what happens if your tint is too dark.",
    hero: "w-c6-rear",
    heroAlt: "Tinted rear window on a yellow C6 Corvette",
    service: ["/automotive-window-tint", "car window tinting"],
    body: (LAW_TABLE) => `
      <h2>The short answer</h2>
      <p>Florida measures tint by VLT, the percentage of visible light that gets through the glass. A lower number is darker. The limits depend on which window it is and whether your vehicle is a car or a multipurpose vehicle such as an SUV, truck or van.</p>
      ${LAW_TABLE}
      <h3>Windshield</h3>
      <p>The windshield can only take non-reflective film above the AS-1 line, a small mark printed near the top edge of most windshields. That's what a windshield strip is: a band of film that cuts glare from a low sun without covering your view of the road.</p>
      <h3>Front side windows</h3>
      <p>The driver and front passenger windows must let in more than 28% of light on every vehicle type. This is the window police officers can see into at a traffic stop, so it's the limit that matters most.</p>
      <h3>Rear side windows and back glass</h3>
      <p>Here the vehicle type matters. Cars and coupes can go down to 15%. SUVs, trucks and vans can go as dark as 6%. That's why two vehicles with identical-looking rear tint can be legal and illegal side by side.</p>
      <h3>Reflective tint</h3>
      <p>Florida also limits how mirror-like the film can be: no more than 25% reflective on the front side windows and no more than 35% on the rear side windows. Most quality automotive films are well under these limits; very shiny, mirrored films are the ones to watch.</p>
      <h3>Factory glass counts too</h3>
      <p>The legal number is for the glass and film together. Many SUVs and trucks leave the factory with darker privacy glass in the back. Adding film on top makes it darker again, so we take the factory shade into account when we recommend a film.</p>
      <h3>Medical exemptions</h3>
      <p>Florida offers a medical exemption for people with conditions that require extra protection from sunlight. It's issued by the Florida Department of Highway Safety and Motor Vehicles with a statement from your doctor, and the exemption paperwork stays in the vehicle. If you have one, show us before the install.</p>
      <h3>What happens if your tint is too dark?</h3>
      <p>Illegal tint is a noncriminal traffic infraction in Florida, which means a ticket and a fine, and you may be asked to remove or replace the film. It can also come up when you sell the vehicle. Getting it right the first time is cheaper.</p>
      <h3>How we keep you legal</h3>
      <p>Tell us the year, make and model when you ask for a quote. We'll recommend the darkest shade that stays within Florida law for your vehicle type, and factor in any factory tint on the rear glass.</p>
      <p class="tip-note">This guide summarizes Florida Statutes sections 316.2951 to 316.2957 as of October 2026. Laws can change, so check the current statute if you need the exact wording.</p>`,
  },
  {
    slug: "ceramic-vs-carbon-window-tint",
    date: "2026-10-22",
    read: 4,
    title: "Ceramic vs Carbon Window Tint: Which Is Worth It? | C&N Spotless",
    headline: "Ceramic vs carbon window tint: which is worth it?",
    h1: ["Ceramic vs carbon tint:", "<em>which is worth it?</em>"],
    desc: "How dyed, carbon and ceramic window tint compare on heat rejection, fading, signal interference and price, and which makes sense in South Florida.",
    sub: "How the three main types of window film compare, what the spec sheet numbers mean, and which one makes sense for South Florida sun.",
    hero: "w-modely-juniper",
    heroAlt: "White Tesla Model Y with dark tinted glass reflecting palm trees",
    service: ["/automotive-window-tint", "car window tinting"],
    body: () => `
      <h2>Darker doesn't mean cooler</h2>
      <p>The biggest misunderstanding about window tint is that a darker film keeps the car cooler. Most of the heat you feel through glass is infrared light, which you can't see. A light ceramic film can block more of that heat than a much darker dyed film. So the shade you pick is mostly about looks and privacy; the film type decides the heat.</p>
      <h3>Dyed film</h3>
      <p>The most affordable option. A dye layer absorbs light, which adds privacy and cuts glare, but it does relatively little against infrared heat. Over time the dye breaks down in the sun and can turn purple or bubble. Fine if you only want the look; not the best choice for Florida heat.</p>
      <h3>Carbon film</h3>
      <p>Carbon particles in the film block a good share of infrared heat and don't fade the way dye does. It has a clean, matte look and doesn't interfere with phone, GPS or radio signals. A solid middle ground on price and performance.</p>
      <h3>Ceramic film</h3>
      <p>Ceramic particles reject the most infrared heat for a given shade, stay clear and color-stable for the life of the film, and don't interfere with signals. It costs more than carbon. Many drivers choose it because it keeps the cabin noticeably cooler even in lighter, fully legal shades.</p>
      <h3>Quick comparison</h3>
      <div class="law"><table>
        <thead><tr><th>Film</th><th>Heat rejection</th><th>Fades</th><th>Price</th></tr></thead>
        <tbody>
          <tr><td>Dyed</td><td>Low</td><td>Yes</td><td>$</td></tr>
          <tr><td>Carbon</td><td>Good</td><td>No</td><td>$$</td></tr>
          <tr><td>Ceramic</td><td>Best</td><td>No</td><td>$$$</td></tr>
        </tbody>
      </table></div>
      <p style="margin-top:14px">None of the three interferes with phone, GPS or radio signals; that was a problem with older metallic films.</p>
      <h3>How to read a spec sheet</h3>
      <p>Every film comes with manufacturer numbers. The most useful are <b>VLT</b> (how much light gets through, which also decides whether it's legal), <b>TSER</b> (total solar energy rejected, the best single number for overall heat) and <b>UV rejection</b>. Infrared rejection figures are often quoted at a single wavelength and can look higher than the real-world result, so compare TSER when you can. We'll show you the actual specs for each option before you choose.</p>
      <h3>Which should you pick?</h3>
      <ul>
        <li><b>You park outside or drive a lot in the sun:</b> ceramic. The heat difference is what you're paying for.</li>
        <li><b>You want good performance on a tighter budget:</b> carbon.</li>
        <li><b>You only care about the look or privacy:</b> dyed works, but expect to replace it sooner.</li>
      </ul>
      <p>Whatever you choose, the shade still has to follow Florida law. See <a href="/florida-window-tint-law">how dark you can legally go</a>.</p>`,
  },
  {
    slug: "window-tint-cure-time",
    date: "2026-10-22",
    read: 3,
    title: "How Long Does Window Tint Take to Cure? | C&N Spotless",
    headline: "How long does window tint take to cure?",
    h1: ["How long does tint", "<em>take to cure?</em>"],
    desc: "What to expect after a window tint install: how long to keep windows up, why haze and water pockets are normal, and how to clean tinted glass.",
    sub: "What's normal in the days after a tint install, how long to keep the windows up, and how to look after the film so it lasts.",
    hero: "install",
    heroAlt: "Window film being squeegeed onto a vehicle's door glass",
    service: ["/automotive-window-tint", "car window tinting"],
    body: () => `
      <h2>Keep the windows up for 3 to 5 days</h2>
      <p>Window film goes on with a mounting solution that needs time to dry out from behind the film. Until it does, the adhesive hasn't fully bonded to the glass. Rolling a window down too early can catch the bottom edge of the film and peel it. Give it 3 to 5 days, a little longer if the weather has been cool or rainy.</p>
      <h3>Haze and small water pockets are normal</h3>
      <p>For the first few days, fresh film can look slightly hazy or show small bubbles of water. That's moisture still drying out, not a defect. It clears on its own, usually within days and sometimes up to a couple of weeks. Florida heat and sun actually speed this up, so parking in the sun helps.</p>
      <h3>What to avoid while it cures</h3>
      <ul>
        <li>Rolling the tinted windows down</li>
        <li>Cleaning the inside of the glass for about a week</li>
        <li>Using the rear defroster for the first few days</li>
        <li>Pushing on bubbles or picking at the edges</li>
      </ul>
      <p>Washing the outside of the car is fine; the film is on the inside of the glass.</p>
      <h3>Cleaning tinted windows</h3>
      <p>Once it's cured, clean the film with a soft microfiber cloth and an ammonia-free cleaner. Ammonia can damage window film over time and may affect the manufacturer's warranty. Skip paper towels and anything abrasive.</p>
      <h3>Home window film takes longer</h3>
      <p>Residential and commercial film on large panes can take several weeks to fully cure, depending on the film and the weather. Hold off on cleaning it for about a month.</p>
      <h3>When to call us</h3>
      <p>If you still see bubbles after a couple of weeks, notice an edge lifting, or spot something trapped under the film, get in touch and we'll take a look.</p>`,
  },
  {
    slug: "tint-back-windows-only",
    date: "2026-10-22",
    read: 3,
    title: "Can You Tint Only the Back Windows? | C&N Spotless",
    headline: "Can you tint only the back windows?",
    h1: ["Can you tint only", "<em>the back windows?</em>"],
    desc: "Yes. Why many drivers tint just the back passenger windows and rear glass, Florida's legal limits for back windows, and what to know about factory tint.",
    sub: "Why plenty of drivers only tint the back passenger windows and rear glass, and what Florida allows for back windows on cars and SUVs.",
    hero: "rr-rear",
    heroAlt: "Rear seats and headliner of a luxury coupe behind tinted glass",
    service: ["/automotive-window-tint#back-windows", "back window tinting"],
    body: () => `
      <h2>Yes, and it's a common request</h2>
      <p>You don't have to tint every window. Tinting just the back passenger windows and the rear glass is one of the most common jobs we do. It gives the back seat privacy and shade while the driver's view through the front windows stays exactly as it was.</p>
      <h3>Why people tint only the back</h3>
      <ul>
        <li><b>Kids and pets:</b> less sun and heat on whoever rides in the back</li>
        <li><b>Privacy:</b> bags, tools and equipment on the back seat stay out of plain view</li>
        <li><b>Clear view up front:</b> some drivers prefer untinted front windows, especially at night</li>
        <li><b>Cost:</b> fewer windows means a smaller job and a lower price</li>
      </ul>
      <h3>How dark can the back windows be?</h3>
      <p>Florida lets the rear side windows and back glass go darker than the front. On cars and coupes the limit is 15%. On SUVs, trucks and vans it's 6%. If you leave the front windows untinted, they're automatically legal. See the full <a href="/florida-window-tint-law">Florida tint law guide</a> for every window.</p>
      <h3>What about factory privacy glass?</h3>
      <p>Many SUVs, trucks and minivans already have darker glass in the back from the factory. That's tinted glass, not film, so it won't peel or fade. If you want it darker or want better heat rejection, film can go on top, and we'll factor in the factory shade so the combined result stays legal. Plenty of owners with factory privacy glass do the opposite: tint only the front two windows to match.</p>
      <h3>Matching the look</h3>
      <p>A clear front with dark back windows is a common, factory-style look. If you want everything to match, we can choose a front shade that blends with the back while staying at the legal 28% or lighter.</p>`,
  },
  {
    slug: "home-window-film-energy-savings",
    date: "2026-10-22",
    read: 4,
    title: "Does Home Window Film Lower Your Energy Bill? | C&N Spotless",
    headline: "Does home window film lower your energy bill?",
    h1: ["Does home window film", "<em>lower your energy bill?</em>"],
    desc: "How residential window film reduces solar heat and AC load in Florida homes, which windows benefit most, and what to check before you tint.",
    sub: "How residential window film cuts the sun's heat, which rooms benefit most, and what to check about your windows before you tint.",
    hero: "shade-base",
    heroAlt: "Tinted glass on a luxury coupe used to preview tint shades",
    service: ["/residential-window-tint", "residential window film"],
    body: () => `
      <h2>It can help, especially in sunny rooms</h2>
      <p>In South Florida, a big share of the heat your air conditioner fights comes straight through the windows as sunlight. Window film rejects part of that solar heat before it gets into the room, so the AC has less to remove. How much you save depends on your home, so be wary of anyone who promises a specific percentage without looking at your windows.</p>
      <h3>Which windows benefit most</h3>
      <ul>
        <li><b>West and south-facing windows</b> that take direct afternoon sun</li>
        <li><b>Large glass</b> such as sliding doors, picture windows and sunrooms</li>
        <li><b>Single-pane windows</b>, which let more heat through than modern insulated glass</li>
      </ul>
      <p>North-facing windows and glass that's already shaded by trees or overhangs usually gain the least. We can quote room by room so you only film the windows that make a difference.</p>
      <h3>Benefits beyond the power bill</h3>
      <p>Even where the savings are modest, film makes sunny rooms more comfortable, cuts glare on TVs and screens, and blocks nearly all UV light, which helps protect floors, furniture and artwork from fading.</p>
      <h3>Reflective or nearly clear?</h3>
      <p>Reflective films reject a lot of heat and add daytime privacy, but they change how your windows look from outside. Spectrally selective films target infrared heat while staying close to clear, which suits homes where you want to keep the view and the look. If you're in a condo or HOA community, check their rules on how film looks from outside first.</p>
      <h3>Check your windows first</h3>
      <p>Some window manufacturers have warranty terms about aftermarket film, and certain films aren't suited to some double-pane or very large panes because of heat stress on the glass. We'll recommend a film that's rated for your glass type, and it's worth checking your window warranty before the install.</p>`,
  },
];
