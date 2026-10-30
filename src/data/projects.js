// All project details are FICTIONAL placeholders for a portfolio exercise.
// `kind`, `tone`, `seed` control the generated illustration (see ArtImage.jsx).
// To use real photos later, add `image: '/images/cedar-house.jpg'` and `gallery: [...]`.

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'new-home', label: 'New Homes' },
  { id: 'renovation', label: 'Renovations' },
  { id: 'commercial', label: 'Commercial' },
];

export const TYPE_LABELS = {
  'new-home': 'New Home',
  renovation: 'Renovation',
  commercial: 'Commercial',
};

export const PROJECT_TYPE_OPTIONS = [
  { value: 'new-home', label: 'New home' },
  { value: 'renovation', label: 'Renovation' },
  { value: 'commercial', label: 'Commercial space' },
  { value: 'not-sure', label: 'Not sure yet' },
];

export const projects = [
  {
    slug: 'cedar-house', name: 'Cedar House', location: 'Riverside', type: 'new-home',
    size: '240 m²', year: '2025', status: 'Completed', kind: 'house', tone: 'dawn', seed: 11,
    overview: 'A family home on a narrow riverside plot, designed for a couple who wanted quiet rooms, generous storage and a direct link to the garden.',
    intent: 'Two stacked volumes let the bedrooms float above a glazed living level. A deep cantilever shades the terrace in summer, and warm timber against pale render keeps the house calm and easy to read.',
  },
  {
    slug: 'courtyard-residence', name: 'Courtyard Residence', location: 'Hillcrest', type: 'new-home',
    size: '310 m²', year: '2024', status: 'Completed', kind: 'courtyard', tone: 'forest', seed: 23,
    overview: 'A multi-generational home arranged around a shared garden, giving each household privacy without losing the sense of living together.',
    intent: 'Two wings face a sheltered courtyard linked by a single low roof. Every main room borrows light from the garden, and the circulation is kept short and legible for all ages.',
  },
  {
    slug: 'atelier-loft', name: 'Atelier Loft', location: 'Old Town', type: 'renovation',
    size: '120 m²', year: '2025', status: 'Completed', kind: 'tower', tone: 'stone', seed: 35,
    overview: 'The conversion of a former workshop floor into a live-work loft for a pair of designers.',
    intent: 'We kept the original structure visible and inserted a lighter, warmer layer of joinery. Storage walls divide the space without closing it, so daylight still reaches the full depth of the plan.',
  },
  {
    slug: 'garden-extension', name: 'Garden Extension', location: 'Parkside', type: 'renovation',
    size: '45 m²', year: '2024', status: 'Completed', kind: 'pavilion', tone: 'dawn', seed: 47,
    overview: 'A rear extension that turns a dark kitchen into the brightest room of an existing terrace house.',
    intent: 'A slim pavilion with a slender roof edge and full-height glazing opens the kitchen to the garden. The new volume is clearly modern, yet sits quietly beside the original brickwork.',
  },
  {
    slug: 'terrace-home', name: 'Terrace Home', location: 'Hillcrest', type: 'renovation',
    size: '168 m²', year: '2023', status: 'Completed', kind: 'house', tone: 'forest', seed: 59,
    overview: 'A full refit of a narrow three-storey home to give a growing family more light, space and storage.',
    intent: 'Reopening the stair and adding a rooftop volume brought daylight into the centre of the plan. Calm, repeated materials hold the rooms together across the three floors.',
  },
  {
    slug: 'linen-cafe', name: 'Linen Café', location: 'Market Street', type: 'commercial',
    size: '85 m²', year: '2025', status: 'Completed', kind: 'pavilion', tone: 'stone', seed: 71,
    overview: 'A neighbourhood café and bakery with a compact kitchen and a welcoming street frontage.',
    intent: 'A continuous bench and one long counter organise the room. Soft, natural finishes and a warm lighting scheme make the space feel relaxed in the morning and intimate at night.',
  },
  {
    slug: 'harbour-offices', name: 'Harbour Offices', location: 'Waterfront', type: 'commercial',
    size: '1,200 m²', year: '2024', status: 'Completed', kind: 'tower', tone: 'dusk', seed: 83,
    overview: 'Workspace for a small group of companies, designed to be flexible as teams grow and change.',
    intent: 'A stepped facade pulls light deep into each floor, while shared terraces give staff places to meet outdoors. The structure is simple and repeatable so tenants can reshape the interiors.',
  },
  {
    slug: 'hillside-retreat', name: 'Hillside Retreat', location: 'Highlands', type: 'new-home',
    size: '190 m²', year: '2023', status: 'Completed', kind: 'house', tone: 'dusk', seed: 95,
    overview: 'A weekend house on a sloping site, built to make the most of long views across the valley.',
    intent: 'The house follows the slope in two stepped levels. Large openings frame the landscape, and a thick, solid rear wall keeps the interior sheltered and quiet.',
  },
  {
    slug: 'maple-studio', name: 'Maple Studio', location: 'Old Town', type: 'commercial',
    size: '140 m²', year: '2023', status: 'Completed', kind: 'courtyard', tone: 'dawn', seed: 107,
    overview: 'A creative studio and small gallery arranged around a planted internal court.',
    intent: 'The central court acts as both circulation and exhibition space. Simple, robust materials let the work of the studio take centre stage.',
  },
];

// Gallery images shift the colour mood so they feel like different views.
const TONES = ['dawn', 'forest', 'dusk', 'stone'];
export const toneAt = (tone, step) => TONES[(Math.max(0, TONES.indexOf(tone)) + step) % TONES.length];

export const getProject = (slug) => projects.find((p) => p.slug === slug);

export const nextProject = (slug) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
