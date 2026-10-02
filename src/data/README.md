# Demo data

Products, site copy, hero photography, colors, and mockup image metadata live in this folder. Replace the `images` entries in `products.js` with objects containing a real `src` URL when photography is ready; `<ProductImage />` will prefer that URL and retain the generated SVG as its fallback.

Replace the eight URLs in `heroTiles.js` with approved apparel photography. `<Tile />` applies grayscale styling and falls back to the dark surface when an image cannot load.
