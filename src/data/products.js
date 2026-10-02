const imageSet = (colors) => colors.map((color) => ({ color }))

export const products = [
  {
    id: 'tee-001', slug: 'after-hours-tee', name: 'After Hours Tee', category: 'tees', price: 1499, compareAtPrice: 1799,
    shortDescription: 'For the hours that do not make the calendar.',
    description: 'A clean heavyweight tee for late trains, loud streets, and the walk home after the city clocks out.',
    fabricFit: ['240 GSM combed cotton', 'Relaxed unisex cut', 'Ribbed crew neck'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Carbon', hex: '#232924' }, { name: 'Bone', hex: '#e8e8df' }],
    images: imageSet(['#232924', '#e8e8df', '#516254']), tag: 'New', drop: 'Night Shift',
  },
  {
    id: 'tee-002', slug: 'no-signal-tee', name: 'No Signal Tee', category: 'tees', price: 1399,
    shortDescription: 'Disconnect loudly.', description: 'A soft daily uniform with a small front mark and a back print made for the offline crowd.',
    fabricFit: ['220 GSM ring-spun cotton', 'Boxy fit', 'Screen-printed graphic'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Ink', hex: '#121613' }, { name: 'Dust', hex: '#c8d2c8' }],
    images: imageSet(['#121613', '#c8d2c8', '#3a463c']), tag: 'Bestseller', drop: 'Offline Dept.',
  },
  {
    id: 'tee-003', slug: 'concrete-flower-tee', name: 'Concrete Flower Tee', category: 'tees', price: 1599, compareAtPrice: 1899,
    shortDescription: 'Softness with a hard edge.', description: 'An off-white tee with a considered back graphic for people who find color in the concrete.',
    fabricFit: ['240 GSM organic cotton', 'Dropped shoulder', 'Garment washed finish'], sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Chalk', hex: '#e6e3d7' }, { name: 'Moss', hex: '#516254' }],
    images: imageSet(['#e6e3d7', '#516254', '#232924']), tag: null, drop: 'Concrete Garden',
  },
  {
    id: 'tee-004', slug: 'city-is-yours-tee', name: 'City Is Yours Tee', category: 'tees', price: 1299,
    shortDescription: 'Claim your corner.', description: 'A compact tee with a sharp little message and enough weight to hold its shape all day.',
    fabricFit: ['200 GSM cotton jersey', 'Standard fit', 'Contrast neck tape'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Paper', hex: '#fafffa' }, { name: 'Forest', hex: '#2e3830' }],
    images: imageSet(['#fafffa', '#2e3830', '#121613']), tag: null, drop: 'Street Notes',
  },
  {
    id: 'tee-005', slug: 'minority-report-tee', name: 'Minority Report Tee', category: 'tees', price: 1699,
    shortDescription: 'For the ones who read the room first.', description: 'A statement tee cut with a little more room and printed with a little less permission.',
    fabricFit: ['260 GSM heavyweight cotton', 'Oversized fit', 'Reinforced shoulder seams'], sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Rust', hex: '#6b4030' }, { name: 'Ink', hex: '#121613' }],
    images: imageSet(['#6b4030', '#121613', '#e8e8df']), tag: 'New', drop: 'Street Notes',
  },
  {
    id: 'hoodie-001', slug: 'common-ground-hoodie', name: 'Common Ground Hoodie', category: 'hoodies', price: 2799, compareAtPrice: 3199,
    shortDescription: 'Heavyweight peace offering.', description: 'A dense fleece layer with a low-key chest mark and a hood built for weather and wandering.',
    fabricFit: ['450 GSM brushed fleece', 'Relaxed fit', 'Double-layer hood'], sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Pine', hex: '#2e3830' }, { name: 'Ash', hex: '#a7aea4' }],
    images: imageSet(['#2e3830', '#a7aea4', '#232924']), tag: 'Bestseller', drop: 'Common Ground',
  },
  {
    id: 'hoodie-002', slug: 'static-club-hoodie', name: 'Static Club Hoodie', category: 'hoodies', price: 2999,
    shortDescription: 'Join the quiet side.', description: 'A structured hoodie with an oversized back hit, made to disappear into the night in the best way.',
    fabricFit: ['420 GSM cotton fleece', 'Oversized fit', 'Kangaroo pocket'], sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Carbon', hex: '#232924' }, { name: 'Bone', hex: '#e8e8df' }],
    images: imageSet(['#232924', '#e8e8df', '#516254']), tag: 'New', drop: 'Night Shift',
  },
  {
    id: 'hoodie-003', slug: 'off-grid-hoodie', name: 'Off-Grid Hoodie', category: 'hoodies', price: 2599,
    shortDescription: 'No bars. Full battery.', description: 'A warm everyday layer finished with a small sleeve detail for a deliberate flash of attitude.',
    fabricFit: ['380 GSM loopback cotton', 'Regular fit', 'Ribbed cuffs and hem'], sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Moss', hex: '#516254' }, { name: 'Chalk', hex: '#e6e3d7' }],
    images: imageSet(['#516254', '#e6e3d7', '#121613']), tag: null, drop: 'Offline Dept.',
  },
  {
    id: 'hoodie-004', slug: 'last-train-hoodie', name: 'Last Train Hoodie', category: 'hoodies', price: 2899,
    shortDescription: 'Catch it or do not.', description: 'A nearly-black hoodie with a generous body and a little green linework hidden in the details.',
    fabricFit: ['440 GSM brushed fleece', 'Cropped relaxed fit', 'Metal zip hardware'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Ink', hex: '#121613' }, { name: 'Signal', hex: '#78837a' }],
    images: imageSet(['#121613', '#78837a', '#232924']), tag: null, drop: 'Night Shift',
  },
  {
    id: 'cap-001', slug: 'typeshi-standard-cap', name: 'Typeshi Standard Cap', category: 'caps', price: 999,
    shortDescription: 'The one you keep by the door.', description: 'A six-panel cap with a clean embroidered wordmark and an adjustable back strap.',
    fabricFit: ['Cotton twill', 'Unstructured six-panel', 'Adjustable metal clasp'], sizes: ['One Size'],
    colors: [{ name: 'Ink', hex: '#121613' }, { name: 'Bone', hex: '#e8e8df' }],
    images: imageSet(['#121613', '#e8e8df', '#2e3830']), tag: 'Bestseller', drop: 'Everyday Uniform',
  },
  {
    id: 'cap-002', slug: 'night-route-cap', name: 'Night Route Cap', category: 'caps', price: 1099,
    shortDescription: 'For the long way home.', description: 'A low-profile cap in washed cotton with a tiny route mark at the front.',
    fabricFit: ['Washed cotton canvas', 'Low-profile crown', 'Brass adjuster'], sizes: ['One Size'],
    colors: [{ name: 'Pine', hex: '#2e3830' }, { name: 'Rust', hex: '#6b4030' }],
    images: imageSet(['#2e3830', '#6b4030', '#c8d2c8']), tag: 'New', drop: 'Night Shift',
  },
  {
    id: 'cap-003', slug: 'offline-dept-cap', name: 'Offline Dept. Cap', category: 'caps', price: 899,
    shortDescription: 'Low signal, high standards.', description: 'A sturdy everyday cap with a tonal front embroidery and a gently curved brim.',
    fabricFit: ['Cotton ripstop', 'Structured six-panel', 'Curved brim'], sizes: ['One Size'],
    colors: [{ name: 'Moss', hex: '#516254' }, { name: 'Chalk', hex: '#e6e3d7' }],
    images: imageSet(['#516254', '#e6e3d7', '#232924']), tag: null, drop: 'Offline Dept.',
  },
]

export const getProductBySlug = (slug) => products.find((product) => product.slug === slug)
