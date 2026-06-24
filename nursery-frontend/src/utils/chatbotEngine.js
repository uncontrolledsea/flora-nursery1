/**
 * Botanical Chatbot Knowledgebase and Inference Engine
 * Incorporates Rule-Based AI matching and Plant Health Diagnostics
 */

export const plants = {
  tulsi: {
    water: "Daily watering, keep soil moist but not soggy.",
    sunlight: "Full sunlight (6–8 hrs/day).",
    soil: "Well-drained, fertile loamy soil.",
    climate: "Warm and humid. Thrives in tropical climates.",
    tips: "Pinch off flower buds to encourage bushy growth. Great for medicinal use."
  },
  neem: {
    water: "Water 2–3 times a week. Drought tolerant once established.",
    sunlight: "Full sunlight.",
    soil: "Sandy or loamy, well-drained soil.",
    climate: "Hot, dry to semi-arid climates.",
    tips: "Excellent natural pesticide. Very low maintenance once mature."
  },
  aloe: {
    water: "Water once a week in summer, once in 2–3 weeks in winter.",
    sunlight: "Bright indirect or direct sunlight.",
    soil: "Sandy, well-drained soil or cactus mix.",
    climate: "Dry, warm climates. Drought-tolerant.",
    tips: "Do not overwater — root rot is the #1 killer. Great for burns and skincare."
  },
  money: {
    water: "Water every 2–3 days. Allow top soil to dry between watering.",
    sunlight: "Indirect or low light. Avoid direct harsh sun.",
    soil: "Moist, well-drained potting mix.",
    climate: "Adapts to most indoor environments.",
    tips: "One of the easiest indoor plants. Grows in water too."
  },
  rose: {
    water: "Water deeply 2–3 times a week at the base.",
    sunlight: "Full sun (at least 6 hrs/day).",
    soil: "Rich, well-drained loamy soil with compost.",
    climate: "Temperate; prefers cool nights and warm days.",
    tips: "Prune regularly for more blooms. Watch for aphids and blackspot."
  },
  jasmine: {
    water: "Water regularly, keep soil moist but not waterlogged.",
    sunlight: "Full sun to partial shade.",
    soil: "Moist, well-drained, fertile soil.",
    climate: "Warm, humid climates.",
    tips: "Fragrant flowers. Needs support to climb. Blooms more in full sun."
  },
  cactus: {
    water: "Water once every 2–3 weeks in summer, once a month in winter.",
    sunlight: "Full direct sunlight.",
    soil: "Sandy, gritty, extremely well-drained cactus mix.",
    climate: "Dry, arid, hot climates. Very drought-tolerant.",
    tips: "Less is more with watering. Perfect for forgetful plant owners."
  },
  sunflower: {
    water: "Water deeply once a week. More during dry spells.",
    sunlight: "Full sun — needs 6–8 hrs of direct sunlight.",
    soil: "Well-drained, slightly acidic to neutral soil.",
    climate: "Warm season. Does not tolerate frost.",
    tips: "Fast growing. Faces the sun when young. Attracts pollinators."
  },
  bamboo: {
    water: "Water every 2–3 days. Keep soil consistently moist.",
    sunlight: "Full sun to partial shade.",
    soil: "Rich, moist, well-drained soil.",
    climate: "Warm, tropical to temperate climates.",
    tips: "Grows extremely fast. Contains roots with barriers to prevent spreading."
  },
  lavender: {
    water: "Water once a week. Allow soil to dry out between watering.",
    sunlight: "Full sun (6+ hrs/day).",
    soil: "Sandy, alkaline, well-drained soil.",
    climate: "Mediterranean — warm days, cool nights, low humidity.",
    tips: "Fragrant and repels mosquitoes. Do not overwater."
  },
  mint: {
    water: "Keep soil consistently moist. Water every 2–3 days.",
    sunlight: "Partial shade to full sun.",
    soil: "Rich, moist, slightly acidic soil.",
    climate: "Cool to moderate climates.",
    tips: "Grows aggressively — best grown in containers to control spread."
  },
  basil: {
    water: "Water every 2–3 days. Keep soil moist but not wet.",
    sunlight: "Full sun (6–8 hrs/day).",
    soil: "Rich, moist, well-drained potting soil.",
    climate: "Warm, humid. Does not tolerate frost.",
    tips: "Pinch off flowers to keep producing leaves. Great companion for tomatoes."
  },
  tomato: {
    water: "Water deeply every 2–3 days. Consistent moisture is key.",
    sunlight: "Full sun (8+ hrs/day).",
    soil: "Rich, well-drained, slightly acidic loamy soil.",
    climate: "Warm season crop. Needs warm days and nights.",
    tips: "Use stakes or cages for support. Feed with potassium for fruiting."
  },
  marigold: {
    water: "Water every 2–3 days. Drought-tolerant once established.",
    sunlight: "Full sun.",
    soil: "Well-drained, moderately fertile soil.",
    climate: "Warm climates. Tolerates heat well.",
    tips: "Natural pest deterrent. Great companion plant. Easy to grow from seed."
  },
  hibiscus: {
    water: "Water daily in summer, every 2–3 days in cooler months.",
    sunlight: "Full sun (6–8 hrs/day).",
    soil: "Moist, well-drained, slightly acidic soil.",
    climate: "Tropical and subtropical.",
    tips: "Heavy feeder — fertilize monthly. Attracts butterflies and hummingbirds."
  },
  fern: {
    water: "Keep soil consistently moist. Mist leaves regularly.",
    sunlight: "Low to indirect light. Avoid direct sun.",
    soil: "Rich, moist, well-drained soil with high organic matter.",
    climate: "Humid, cool to moderate environments.",
    tips: "Loves humidity — great for bathrooms. Mist daily or use a pebble tray."
  },
  snake: {
    water: "Water once every 2–4 weeks. Very drought tolerant.",
    sunlight: "Low light to bright indirect light. Very adaptable.",
    soil: "Sandy, well-drained potting mix.",
    climate: "Adaptable to most indoor conditions.",
    tips: "Nearly indestructible. One of the best air-purifying plants. Toxic to pets."
  },
  pothos: {
    water: "Water every 1–2 weeks. Allow soil to dry halfway between watering.",
    sunlight: "Low to bright indirect light.",
    soil: "Well-drained all-purpose potting mix.",
    climate: "Any indoor environment.",
    tips: "Extremely easy to grow and propagate. Trails beautifully. Toxic to pets."
  },
  peacelily: {
    water: "Water once a week. Keep soil slightly moist.",
    sunlight: "Low to medium indirect light.",
    soil: "Rich, well-drained potting mix.",
    climate: "Warm indoor environments with moderate humidity.",
    tips: "Droops when thirsty — easy watering signal. Toxic to pets and children."
  },
  spider: {
    water: "Water every 1–2 weeks. Allow soil to dry out between watering.",
    sunlight: "Indirect bright light.",
    soil: "Well-drained potting mix.",
    climate: "Adaptable indoor plant.",
    tips: "Very easy care. Great for beginners. Non-toxic to pets. Produces baby plants."
  },
  rubber: {
    water: "Water every 1–2 weeks. Allow top inch of soil to dry between watering.",
    sunlight: "Bright indirect light.",
    soil: "Well-drained, rich potting mix.",
    climate: "Warm indoor environment.",
    tips: "Wipe leaves with a damp cloth for shine. Toxic to pets."
  },
  jade: {
    water: "Water every 2–3 weeks. Allow soil to completely dry out.",
    sunlight: "Full sun to bright indirect light (4+ hrs/day).",
    soil: "Sandy, well-drained succulent or cactus mix.",
    climate: "Dry, warm to room temperature.",
    tips: "Very long-lived — can grow for decades. Overwatering is the main risk."
  },
  orchid: {
    water: "Water once a week. Allow roots to dry between watering.",
    sunlight: "Bright indirect light. Avoid direct sun.",
    soil: "Orchid bark or sphagnum moss — NOT regular potting soil.",
    climate: "Warm, humid with good air circulation.",
    tips: "Feed monthly with orchid fertilizer. Repot every 2 years."
  },
  curryleaf: {
    water: "Water every 2–3 days. Do not let soil dry out completely.",
    sunlight: "Full sun.",
    soil: "Well-drained, loamy or sandy soil.",
    climate: "Tropical, warm climates.",
    tips: "Pinch new growth to make it bushy. Leaves used heavily in South Indian cooking."
  },
  banana: {
    water: "Water daily or every 2 days. Needs a lot of moisture.",
    sunlight: "Full sun.",
    soil: "Rich, deep, well-drained loamy soil.",
    climate: "Tropical, hot and humid.",
    tips: "Heavy feeder. Needs potassium for fruit development."
  },
  lemon: {
    water: "Water every 2–3 days. Allow top inch of soil to dry.",
    sunlight: "Full sun (8+ hrs/day).",
    soil: "Well-drained, slightly acidic sandy-loam soil.",
    climate: "Warm, subtropical or Mediterranean.",
    tips: "Fertilize with citrus fertilizer. Great for containers on balconies."
  },
  guava: {
    water: "Water 2–3 times a week. Drought-tolerant once established.",
    sunlight: "Full sun.",
    soil: "Well-drained, fertile loamy soil. Tolerates a wide range.",
    climate: "Tropical to subtropical.",
    tips: "Very easy to grow. Fruiting starts within 2–4 years from seed."
  },
  mango: {
    water: "Water every 2–3 days when young. Mature trees are drought-tolerant.",
    sunlight: "Full sun.",
    soil: "Deep, well-drained sandy-loam or loamy soil.",
    climate: "Tropical, hot, and humid. Needs dry season to flower.",
    tips: "Do not overwater once established. Needs space — grows into a large tree."
  },
  bougainvillea: {
    water: "Water every 3–4 days. Allow soil to partially dry between watering.",
    sunlight: "Full sun (5+ hrs/day).",
    soil: "Well-drained, slightly acidic soil.",
    climate: "Tropical and subtropical. Drought-tolerant.",
    tips: "Stress triggers blooming — reduce water when you want more flowers."
  },
  chrysanthemum: {
    water: "Water every 2–3 days. Keep soil moist.",
    sunlight: "Full sun to partial shade.",
    soil: "Well-drained, fertile soil.",
    climate: "Cool to moderate climates. Blooms in autumn.",
    tips: "Pinch tips in summer to encourage more blooms. Great cut flower."
  }
};

export const rules = [
  {
    condition: (i) => i.includes("low water") || i.includes("less water") || i.includes("drought"),
    result: ["aloe", "cactus", "snake", "neem", "jade"],
    reason: "These plants are highly drought-tolerant and need very little water."
  },
  {
    condition: (i) => i.includes("forget to water") || i.includes("forgetful") || i.includes("busy"),
    result: ["cactus", "snake", "jade", "aloe"],
    reason: "These plants survive extended periods without watering — perfect for forgetful owners."
  },
  {
    condition: (i) => i.includes("daily water") || i.includes("water every day"),
    result: ["tulsi", "banana", "hibiscus"],
    reason: "These plants thrive with daily watering."
  },
  {
    condition: (i) => i.includes("once a week") || i.includes("weekly water"),
    result: ["lavender", "aloe", "orchid", "peacelily"],
    reason: "These plants do well with weekly watering."
  },
  {
    condition: (i) => i.includes("overwater") || i.includes("water a lot") || i.includes("moist soil"),
    result: ["fern", "mint", "peacelily", "bamboo"],
    reason: "These plants prefer consistently moist or wet soil."
  },
  {
    condition: (i) => i.includes("rainy season") || i.includes("monsoon"),
    result: ["tulsi", "bamboo", "banana", "hibiscus"],
    reason: "These plants love rain and high humidity during monsoon season."
  },
  {
    condition: (i) => i.includes("water twice") || i.includes("water 2"),
    result: ["rose", "tomato", "basil", "money"],
    reason: "These plants are best watered every 2–3 days."
  },
  {
    condition: (i) => i.includes("no rain") || i.includes("dry area") || i.includes("arid"),
    result: ["cactus", "aloe", "neem", "jade", "bougainvillea"],
    reason: "These plants excel in dry, low-rainfall conditions."
  },
  {
    condition: (i) => i.includes("full sun") || i.includes("direct sun") || i.includes("lots of sunlight"),
    result: ["tulsi", "neem", "rose", "sunflower", "tomato", "cactus"],
    reason: "These plants need 6–8+ hours of direct sunlight daily."
  },
  {
    condition: (i) => i.includes("partial sun") || i.includes("partial shade") || i.includes("some sun"),
    result: ["mint", "jasmine", "chrysanthemum", "marigold"],
    reason: "These plants do well with 3–6 hours of sun per day."
  },
  {
    condition: (i) => i.includes("low light") || i.includes("no window") || i.includes("dark room"),
    result: ["pothos", "snake", "peacelily", "fern"],
    reason: "These plants thrive in low-light indoor environments."
  },
  {
    condition: (i) => i.includes("indirect light") || i.includes("indirect sun") || i.includes("bright room"),
    result: ["pothos", "rubber", "orchid", "spider", "money"],
    reason: "These plants prefer bright but indirect light — away from harsh direct sun."
  },
  {
    condition: (i) => i.includes("shade") || i.includes("no sun"),
    result: ["fern", "peacelily", "pothos", "snake"],
    reason: "These plants can grow in shade or very low-light conditions."
  },
  {
    condition: (i) => i.includes("balcony") || i.includes("terrace"),
    result: ["tulsi", "mint", "basil", "marigold", "lemon"],
    reason: "These plants are perfect for balcony or terrace gardening in containers."
  },
  {
    condition: (i) => i.includes("windowsill"),
    result: ["aloe", "cactus", "jade", "snake", "pothos"],
    reason: "These compact plants are ideal for windowsill placement."
  },
  {
    condition: (i) => i.includes("indoor") || i.includes("inside") || i.includes("inside house"),
    result: ["money", "snake", "pothos", "peacelily", "spider", "rubber"],
    reason: "These are popular, low-maintenance indoor plants."
  },
  {
    condition: (i) => i.includes("outdoor") || i.includes("garden") || i.includes("outside"),
    result: ["rose", "marigold", "sunflower", "hibiscus", "neem", "guava"],
    reason: "These plants thrive outdoors in garden settings."
  },
  {
    condition: (i) => i.includes("apartment") || i.includes("flat") || i.includes("small space"),
    result: ["pothos", "snake", "spider", "aloe", "money"],
    reason: "These compact plants are perfect for apartments and small spaces."
  },
  {
    condition: (i) => i.includes("office") || i.includes("desk") || i.includes("workspace"),
    result: ["snake", "pothos", "spider", "jade"],
    reason: "These low-maintenance plants are ideal for office desks."
  },
  {
    condition: (i) => i.includes("bedroom"),
    result: ["snake", "peacelily", "lavender", "spider"],
    reason: "These plants are great for bedrooms — some even improve sleep quality."
  },
  {
    condition: (i) => i.includes("bathroom"),
    result: ["fern", "pothos", "peacelily", "spider"],
    reason: "These humidity-loving plants thrive in bathrooms."
  },
  {
    condition: (i) => i.includes("kitchen"),
    result: ["mint", "basil", "aloe", "pothos"],
    reason: "These useful plants are great near kitchens for herbs and first-aid."
  },
  {
    condition: (i) => i.includes("hot climate") || i.includes("summer") || i.includes("heat"),
    result: ["cactus", "aloe", "neem", "sunflower", "hibiscus", "bougainvillea"],
    reason: "These plants are excellent at tolerating high heat and hot climates."
  },
  {
    condition: (i) => i.includes("cold") || i.includes("winter") || i.includes("frost"),
    result: ["chrysanthemum", "lavender", "snake", "pothos"],
    reason: "These plants can tolerate or even prefer cooler temperatures."
  },
  {
    condition: (i) => i.includes("tropical") || i.includes("humid") || i.includes("india"),
    result: ["tulsi", "banana", "hibiscus", "mango", "curryleaf", "guava"],
    reason: "These plants are native to or thrive in tropical, humid conditions like India."
  },
  {
    condition: (i) => i.includes("dry") || i.includes("desert") || i.includes("low humidity"),
    result: ["cactus", "aloe", "jade", "lavender"],
    reason: "These drought-tolerant plants do well in dry, low-humidity conditions."
  },
  {
    condition: (i) => i.includes("all season") || i.includes("year round") || i.includes("perennial"),
    result: ["tulsi", "aloe", "snake", "money", "neem"],
    reason: "These plants grow year-round with minimal seasonal care."
  },
  {
    condition: (i) => i.includes("spring") || i.includes("new growth"),
    result: ["rose", "marigold", "sunflower", "chrysanthemum"],
    reason: "These plants bloom beautifully in spring with fresh growth."
  },
  {
    condition: (i) => i.includes("autumn") || i.includes("fall"),
    result: ["chrysanthemum", "marigold"],
    reason: "These plants bloom in autumn and are perfect for fall gardens."
  },
  {
    condition: (i) => i.includes("sandy soil"),
    result: ["cactus", "aloe", "lavender", "neem", "jade"],
    reason: "These plants prefer or tolerate sandy, well-draining soil."
  },
  {
    condition: (i) => i.includes("clay soil") || i.includes("heavy soil"),
    result: ["bamboo", "sunflower", "guava"],
    reason: "These plants are more tolerant of heavier clay soils."
  },
  {
    condition: (i) => i.includes("loamy soil") || i.includes("fertile soil"),
    result: ["tomato", "rose", "tulsi", "basil", "mango"],
    reason: "These plants thrive in rich, loamy, fertile soil."
  },
  {
    condition: (i) => i.includes("well drained") || i.includes("well-drained"),
    result: ["lavender", "cactus", "rose", "lemon", "aloe"],
    reason: "These plants need excellent drainage to prevent root rot."
  },
  {
    condition: (i) => i.includes("potting mix") || i.includes("pot") || i.includes("container"),
    result: ["pothos", "snake", "aloe", "jade", "orchid", "money"],
    reason: "These plants do excellently in containers with standard potting mix."
  },
  {
    condition: (i) => i.includes("water propagate") || i.includes("grow in water"),
    result: ["money", "pothos", "mint"],
    reason: "These plants can easily grow and propagate in water alone."
  },
  {
    condition: (i) => i.includes("medicinal") || i.includes("medicine") || i.includes("herbal"),
    result: ["tulsi", "aloe", "neem", "mint", "curryleaf"],
    reason: "These plants have significant medicinal and herbal properties."
  },
  {
    condition: (i) => i.includes("cook") || i.includes("kitchen herb") || i.includes("edible"),
    result: ["tulsi", "mint", "basil", "curryleaf"],
    reason: "These aromatic herbs are widely used in cooking."
  },
  {
    condition: (i) => i.includes("fruit") || i.includes("fruiting") || i.includes("edible fruit"),
    result: ["mango", "guava", "lemon", "banana", "tomato"],
    reason: "These plants produce edible fruits."
  },
  {
    condition: (i) => i.includes("flower") || i.includes("blooming") || i.includes("colourful"),
    result: ["rose", "marigold", "hibiscus", "sunflower", "chrysanthemum", "bougainvillea", "orchid"],
    reason: "These plants produce vibrant, beautiful flowers."
  },
  {
    condition: (i) => i.includes("fragrant") || i.includes("smell good") || i.includes("aroma") || i.includes("scent"),
    result: ["jasmine", "lavender", "rose", "mint", "tulsi"],
    reason: "These plants are known for their wonderful fragrance."
  },
  {
    condition: (i) => i.includes("air purif") || i.includes("clean air") || i.includes("oxygen"),
    result: ["snake", "pothos", "peacelily", "spider", "rubber", "aloe"],
    reason: "These plants are NASA-tested air purifiers and excellent oxygen producers."
  },
  {
    condition: (i) => i.includes("pest") || i.includes("mosquito") || i.includes("insect repel"),
    result: ["neem", "lavender", "marigold", "tulsi", "mint"],
    reason: "These plants are natural pest and mosquito repellents."
  },
  {
    condition: (i) => i.includes("lucky") || i.includes("good luck") || i.includes("vastu") || i.includes("feng shui"),
    result: ["money", "jade", "tulsi", "bamboo"],
    reason: "These plants are considered lucky and auspicious in various traditions."
  },
  {
    condition: (i) => i.includes("privacy") || i.includes("hedge") || i.includes("fence"),
    result: ["bamboo", "neem", "bougainvillea"],
    reason: "These fast-growing plants make excellent natural privacy screens."
  },
  {
    condition: (i) => i.includes("shade tree") || i.includes("large tree"),
    result: ["neem", "mango", "guava", "banana"],
    reason: "These are large, shade-providing trees suitable for open spaces."
  },
  {
    condition: (i) => i.includes("beginner") || i.includes("easy") || i.includes("first plant") || i.includes("new to"),
    result: ["pothos", "snake", "spider", "marigold", "money"],
    reason: "These are the most forgiving and easiest plants for beginners."
  },
  {
    condition: (i) => i.includes("low maintenance") || i.includes("no maintenance") || i.includes("easy care"),
    result: ["snake", "cactus", "aloe", "pothos", "jade"],
    reason: "These plants require minimal care and attention."
  },
  {
    condition: (i) => i.includes("hard to kill") || i.includes("tough") || i.includes("survive"),
    result: ["snake", "pothos", "aloe", "cactus", "neem"],
    reason: "These are among the most resilient and hard-to-kill plants."
  },
  {
    condition: (i) => i.includes("expert") || i.includes("advanced") || i.includes("challenge"),
    result: ["orchid", "bonsai", "rose"],
    reason: "These plants require more skill and attention — great for experienced growers."
  },
  {
    condition: (i) => i.includes("child") || i.includes("kid") || i.includes("school project"),
    result: ["sunflower", "marigold", "tomato", "spider"],
    reason: "These fast-growing, easy plants are great for children's gardening projects."
  },
  {
    condition: (i) => i.includes("pet safe") || i.includes("cat safe") || i.includes("dog safe") || i.includes("non toxic"),
    result: ["spider", "marigold", "basil", "sunflower"],
    reason: "These plants are non-toxic and safe around cats and dogs."
  },
  {
    condition: (i) => i.includes("toxic") || i.includes("poisonous") || i.includes("avoid pet"),
    result: ["snake", "pothos", "peacelily", "rubber"],
    reason: "⚠️ These popular plants are toxic to pets — keep them out of reach!"
  },
  {
    condition: (i) => i.includes("fast grow") || i.includes("quick grow"),
    result: ["bamboo", "sunflower", "pothos", "money", "marigold"],
    reason: "These plants are among the fastest-growing available."
  },
  {
    condition: (i) => i.includes("slow grow") || i.includes("compact"),
    result: ["cactus", "jade", "orchid", "aloe"],
    reason: "These plants grow slowly and stay compact for a long time."
  },
  {
    condition: (i) => i.includes("climber") || i.includes("vine") || i.includes("trailing"),
    result: ["money", "pothos", "bougainvillea", "jasmine"],
    reason: "These plants are natural climbers or trailers, great for vertical growth."
  },
  {
    condition: (i) => i.includes("tall") || i.includes("big plant") || i.includes("large"),
    result: ["bamboo", "neem", "mango", "banana", "rubber"],
    reason: "These plants grow tall and make a bold statement."
  },
  {
    condition: (i) => i.includes("small plant") || i.includes("mini") || i.includes("tiny"),
    result: ["aloe", "jade", "cactus", "mint", "spider"],
    reason: "These plants stay small and are suitable for tiny spaces."
  },
  {
    condition: (i) => i.includes("spread") || i.includes("ground cover"),
    result: ["mint", "marigold", "spider"],
    reason: "These plants spread easily and work well as ground cover."
  },
  {
    condition: (i) => i.includes("succulent"),
    result: ["aloe", "jade", "cactus"],
    reason: "These are popular succulents that store water in their leaves."
  },
  {
    condition: (i) => i.includes("tulsi") || i.includes("holy basil"),
    result: "tulsi",
    reason: "You asked about Tulsi (Holy Basil) — a sacred and medicinal plant."
  },
  {
    condition: (i) => i.includes("aloe vera") || i.includes("aloe"),
    result: "aloe",
    reason: "You asked about Aloe Vera — great for skincare and burns."
  },
  {
    condition: (i) => i.includes("money plant") || i.includes("pothos"),
    result: "money",
    reason: "You asked about Money Plant (Pothos) — an easy, lucky indoor plant."
  },
  {
    condition: (i) => i.includes("neem"),
    result: "neem",
    reason: "You asked about Neem — a powerful medicinal and pest-repellent tree."
  },
  {
    condition: (i) => i.includes("rose"),
    result: "rose",
    reason: "You asked about Rose — the most beloved flowering plant."
  },
  {
    condition: (i) => i.includes("jasmine"),
    result: "jasmine",
    reason: "You asked about Jasmine — famous for its incredible fragrance."
  },
  {
    condition: (i) => i.includes("cactus"),
    result: "cactus",
    reason: "You asked about Cactus — the ultimate low-maintenance succulent."
  },
  {
    condition: (i) => i.includes("sunflower"),
    result: "sunflower",
    reason: "You asked about Sunflower — cheerful, fast-growing, and sun-loving."
  },
  {
    condition: (i) => i.includes("bamboo"),
    result: "bamboo",
    reason: "You asked about Bamboo — the fastest growing plant on earth."
  },
  {
    condition: (i) => i.includes("lavender"),
    result: "lavender",
    reason: "You asked about Lavender — calming fragrance and drought tolerant."
  },
  {
    condition: (i) => i.includes("mint"),
    result: "mint",
    reason: "You asked about Mint — a fast-spreading culinary herb."
  },
  {
    condition: (i) => i.includes("basil"),
    result: "basil",
    reason: "You asked about Basil — a must-have cooking herb."
  },
  {
    condition: (i) => i.includes("tomato"),
    result: "tomato",
    reason: "You asked about Tomato — a rewarding vegetable to grow at home."
  },
  {
    condition: (i) => i.includes("marigold"),
    result: "marigold",
    reason: "You asked about Marigold — easy to grow and a great companion plant."
  },
  {
    condition: (i) => i.includes("hibiscus"),
    result: "hibiscus",
    reason: "You asked about Hibiscus — vibrant tropical blooms."
  },
  {
    condition: (i) => i.includes("fern"),
    result: "fern",
    reason: "You asked about Fern — lush and beautiful in humid environments."
  },
  {
    condition: (i) => i.includes("snake plant") || i.includes("sansevieria"),
    result: "snake",
    reason: "You asked about Snake Plant — one of the best air purifiers."
  },
  {
    condition: (i) => i.includes("peace lily"),
    result: "peacelily",
    reason: "You asked about Peace Lily — elegant and excellent in low light."
  },
  {
    condition: (i) => i.includes("spider plant"),
    result: "spider",
    reason: "You asked about Spider Plant — non-toxic and great for beginners."
  },
  {
    condition: (i) => i.includes("rubber plant") || i.includes("rubber tree"),
    result: "rubber",
    reason: "You asked about Rubber Plant — a bold, glossy statement plant."
  },
  {
    condition: (i) => i.includes("jade plant") || i.includes("jade"),
    result: "jade",
    reason: "You asked about Jade Plant — long-lived and very low maintenance."
  },
  {
    condition: (i) => i.includes("orchid"),
    result: "orchid",
    reason: "You asked about Orchid — exotic and elegant, but needs special care."
  },
  {
    condition: (i) => i.includes("curry leaf") || i.includes("curry plant"),
    result: "curryleaf",
    reason: "You asked about Curry Leaf — essential in South Indian cooking."
  },
  {
    condition: (i) => i.includes("banana"),
    result: "banana",
    reason: "You asked about Banana — a tropical plant that fruits in 1–2 years."
  },
  {
    condition: (i) => i.includes("lemon") || i.includes("lemon tree"),
    result: "lemon",
    reason: "You asked about Lemon Tree — great for home gardens and balconies."
  },
  {
    condition: (i) => i.includes("guava"),
    result: "guava",
    reason: "You asked about Guava — easy to grow and rich in Vitamin C."
  },
  {
    condition: (i) => i.includes("mango"),
    result: "mango",
    reason: "You asked about Mango — the king of tropical fruits."
  },
  {
    condition: (i) => i.includes("bougainvillea"),
    result: "bougainvillea",
    reason: "You asked about Bougainvillea — drought-tolerant and strikingly colourful."
  },
  {
    condition: (i) => i.includes("chrysanthemum") || i.includes("mum"),
    result: "chrysanthemum",
    reason: "You asked about Chrysanthemum — a classic autumn-blooming flower."
  },
  {
    condition: (i) => i.includes("fertilizer") || i.includes("feed") || i.includes("nutrient"),
    result: ["tomato", "rose", "hibiscus", "banana"],
    reason: "These heavy feeders benefit most from regular fertilizing."
  },
  {
    condition: (i) => i.includes("repot") || i.includes("transplant"),
    result: ["orchid", "rubber", "snake", "money"],
    reason: "These plants commonly need repotting every 1–2 years as they grow."
  },
  {
    condition: (i) => i.includes("propagate") || i.includes("cutting") || i.includes("grow more"),
    result: ["pothos", "mint", "spider", "money", "basil"],
    reason: "These plants are very easy to propagate from cuttings or offshoots."
  },
  {
    condition: (i) => i.includes("attract butterfly") || i.includes("pollinator") || i.includes("bee"),
    result: ["marigold", "lavender", "sunflower", "hibiscus", "jasmine"],
    reason: "These flowering plants attract bees, butterflies, and other pollinators."
  },
  {
    condition: (i) => i.includes("gift") || i.includes("gifting") || i.includes("present"),
    result: ["money", "orchid", "rose", "jade", "lavender"],
    reason: "These plants make beautiful and meaningful gifts."
  },
  {
    condition: (i) => i.includes("religious") || i.includes("pooja") || i.includes("temple") || i.includes("worship"),
    result: ["tulsi", "marigold", "jasmine"],
    reason: "These plants are sacred and commonly used in Indian religious rituals."
  }
];

export function inferPlant(input) {
  let matchedRules = [];
  const text = input.toLowerCase();

  rules.forEach(rule => {
    if (rule.condition(text)) {
      matchedRules.push(rule);
    }
  });

  if (matchedRules.length === 0) {
    return {
      answer: "❓ No matching plant found. Try asking about watering needs, sunlight, indoor/outdoor, climate, or a plant name.",
      explanation: "No rules matched your query. Try keywords like: 'indoor', 'low water', 'full sun', 'beginner', 'fragrant', 'edible', 'air purifier', etc."
    };
  }

  let selected = matchedRules[0];

  return {
    answer: generateResponse(selected.result),
    explanation: selected.reason
  };
}

function generateResponse(result) {
  if (Array.isArray(result)) {
    let names = result.map(r => r.toUpperCase()).join(", ");
    let guides = result.map(r => {
      let p = plants[r];
      if (!p) return `🌿 ${r.toUpperCase()}: No data available.`;
      return `<b>🌱 ${r.toUpperCase()}</b><br>💧 <b>Water:</b> ${p.water}<br>☀️ <b>Sun:</b> ${p.sunlight}<br>🌍 <b>Soil:</b> ${p.soil}`;
    }).join("<br><br>");

    return `🌿 <b>Suggested Plants:</b> ${names}<br><br>${guides}`;
  }

  let p = plants[result];
  if (!p) return `🌿 ${result.toUpperCase()}: No care data found.`;

  return `🌱 <b>${result.toUpperCase()} CARE GUIDE</b><br>💧 <b>Water:</b> ${p.water}<br>☀️ <b>Sunlight:</b> ${p.sunlight}<br>🌍 <b>Soil:</b> ${p.soil}<br>🌡️ <b>Climate:</b> ${p.climate}<br>💡 <b>Tips:</b> ${p.tips}`;
}

export const DIAGNOSES = {
  'Yellow Leaves': {
    causes: [
      { name: 'Overwatering (Root Suffocation)', probability: 65, treatment: 'Allow the soil to dry out completely. Improve drainage by checking pot holes or adding perlite.', prevention: 'Water only when the top 1-2 inches of soil is dry. Use well-draining soil mix.' },
      { name: 'Nitrogen Deficiency', probability: 25, treatment: 'Apply a balanced, nitrogen-rich liquid fertilizer.', prevention: 'Maintain a regular seasonal feeding schedule.' },
      { name: 'Inadequate Lighting', probability: 10, treatment: 'Relocate the plant to a spot with more bright, indirect sunlight.', prevention: 'Ensure appropriate light placement tailored to the plant species.' }
    ],
    products: ['Areca Palm', 'Money Plant', 'Organic Soil Booster']
  },
  'Brown Spots': {
    causes: [
      { name: 'Fungal Infection (Leaf Spot)', probability: 55, treatment: 'Prune affected leaves immediately. Spray organic copper fungicide or neem oil. Avoid overhead watering.', prevention: 'Improve air circulation and avoid splashing water onto the leaves.' },
      { name: 'Chemical/Salt Build-up (Tap Water)', probability: 30, treatment: 'Flush the soil thoroughly with distilled water or rainwater.', prevention: 'Use filtered water or let tap water sit uncovered for 24 hours before use.' },
      { name: 'Critically Low Humidity', probability: 15, treatment: 'Mist the foliage daily, place on a pebble tray, or use a room humidifier.', prevention: 'Maintain humidity above 50% for tropical species.' }
    ],
    products: ['Peace Lily', 'Rubber Plant', 'Organic Fungicide Spray']
  },
  'Root Rot': {
    causes: [
      { name: 'Waterlogged Soil (Soggy Environment)', probability: 80, treatment: 'Remove plant from pot, trim mushy black roots, treat with fungicide, and repot in clean, dry, well-draining soil.', prevention: 'Ensure pots have functional drainage holes. Never let pots stand in drainage water.' },
      { name: 'Pathogenic Soil-borne Fungi', probability: 20, treatment: 'Drench soil with a biological fungicide containing Trichoderma.', prevention: 'Always use sterilized potting mix for new plants.' }
    ],
    products: ['Snake Plant', 'Jade Plant', 'Perlite Soil Aerator']
  },
  'Wilting': {
    causes: [
      { name: 'Severe Underwatering', probability: 60, treatment: 'Rehydrate soil using the bottom-watering method for 20-30 minutes.', prevention: 'Set recurring schedule reminders on the "My Plant Care" dashboard.' },
      { name: 'Advanced Root Rot (Cannot absorb water)', probability: 40, treatment: 'Inspect roots. If rotten, treat immediately as root rot. If healthy, water thoroughly.', prevention: 'Maintain balanced watering; avoid extreme drought-to-soak cycles.' }
    ],
    products: ['Tulsi (Holy Basil)', 'Aloe Vera', 'Self-Watering Pot']
  },
  'Drooping Leaves': {
    causes: [
      { name: 'Environmental Shock (Sudden Shift)', probability: 50, treatment: 'Leave the plant in a fixed, suitable location. Minimize changes in temperature and light.', prevention: 'Avoid moving plants frequently. Acclimate slowly when moving outdoors.' },
      { name: 'Cold Drafts or Sudden Heat Spikes', probability: 30, treatment: 'Move the plant away from drafty windows, air vents, or radiators.', prevention: 'Maintain indoor temperatures between 18°C and 25°C.' },
      { name: 'Dehydration (Initial signs)', probability: 20, treatment: 'Give the plant a moderate watering. Leaves should perk up within a few hours.', prevention: 'Monitor moisture levels weekly.' }
    ],
    products: ['Pothos', 'Bamboo Plant', 'Soil Moisture Meter']
  },
  'Pest Attack': {
    causes: [
      { name: 'Infestation (Spider Mites/Mealybugs/Scale)', probability: 70, treatment: 'Isolate plant. Wash pests off under a faucet, then spray thoroughly with diluted neem oil or insecticidal soap.', prevention: 'Inspect leaf undersides regularly. Keep new plants quarantined for 2 weeks.' },
      { name: 'Soil Fungus Gnats (Excessive Soil Moisture)', probability: 30, treatment: 'Allow soil to dry out completely. Apply sticky yellow traps and water with diluted hydrogen peroxide.', prevention: 'Sprinkle sand over topsoil to prevent adult gnats from laying eggs.' }
    ],
    products: ['Neem Tree', 'Lavender', 'Organic Neem Oil Spray']
  }
};

export function diagnoseSymptom(symptom) {
  const diagnosis = DIAGNOSES[symptom];
  if (!diagnosis) return null;

  return {
    symptom,
    possibleCauses: diagnosis.causes,
    recommendedProducts: diagnosis.products
  };
}
