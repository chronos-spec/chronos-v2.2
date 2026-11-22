# Planisphère — prompts d'images par époque (plan B)

À utiliser si le service scientifique GPlates ne convient pas (lenteur, indisponibilité) ou pour des versions illustrées.
Générer en 2:1 (planisphère), puis comparer chaque image à une carte de référence (PALEOMAP de C. Scotese, ou
GPlates) : une IA d'image invente facilement des côtes. Ne garder que les images fidèles.

**Style (à mettre au début de chaque prompt)**
`Scientific paleogeographic world map, equal-area Equal Earth projection, 2:1 aspect ratio, whole globe visible, north up. Deep navy ocean (#0b2a4a) shading to lighter blue (#1d5a8a) over shallow continental shelves, land in muted ochre-sand (#c9b27a) blending to olive green (#6e7f3c) in humid zones, white ice caps where specified, subtle relief shading on mountain belts, thin faint latitude/longitude grid. Clean, elegant, museum-quality, flat lighting, no text, no labels, no legend, no compass, no frame, no modern borders, no cities.`

**Négatif** : `text, letters, labels, modern country borders, modern coastlines, satellite photo, 3D globe, fantasy map, decorative frame, people`

| Époque | Prompt (à la suite du style) |
|---|---|
| Aujourd'hui | `Present-day continents exactly as today: Americas, Africa, Eurasia, Australia, Antarctica with ice sheet, Greenland ice sheet.` |
| 20 Ma (Miocène) | `Early Miocene world: continents almost in modern positions; India already joined to Asia with a young Himalaya; a seaway still links the Mediterranean to the Indian Ocean through the Middle East; Australia slightly further south; Antarctic ice sheet present, no northern ice; Panama isthmus not yet closed, open sea between North and South America.` |
| 50 Ma (Éocène) | `Early Eocene greenhouse world, no ice at either pole: India an island continent in the Indian Ocean approaching southern Asia; Australia still very close to Antarctica; Atlantic narrower than today; Europe an archipelago of islands with shallow seas; Tethys sea extending from the Mediterranean to Asia; North and South America separated by sea.` |
| 66 Ma (fin Crétacé) | `Latest Cretaceous world: narrow South Atlantic between South America and Africa; India an island far south in the Indian Ocean; Madagascar separated; broad shallow seas flooding North Africa and Europe; western North America still partly flooded; no polar ice.` |
| 100 Ma (Crétacé) | `Mid-Cretaceous high sea level: a wide shallow seaway (Western Interior Seaway) splits North America from north to south; South America and Africa just separating with a narrow young South Atlantic; India detaching from Antarctica/Australia; large shallow seas over Europe and North Africa; no ice.` |
| 150 Ma (Jurassique) | `Late Jurassic: Pangaea breaking into Laurasia (north) and Gondwana (south); young narrow North Atlantic between North America and Africa; wide Tethys Ocean wedge opening from the east; Gondwana still a single southern landmass (South America, Africa, India, Antarctica, Australia joined); no ice.` |
| 200 Ma (fin Trias) | `End-Triassic Pangaea: a single C-shaped supercontinent centred on the equator, beginning to rift between North America and Africa (thin rift valleys, no open ocean yet); Tethys Ocean as a large wedge-shaped bay on the east side; the global Panthalassa ocean covering the rest of the globe; arid interior; no ice.` |
| 250 Ma (début Trias) | `Early Triassic Pangaea fully assembled: one huge C-shaped supercontinent from pole to pole, Tethys Ocean as a wedge-shaped embayment opening to the east near the equator, Siberia and China blocks at its northern-eastern edge, vast surrounding Panthalassa ocean, very arid interior, no ice.` |
| 300 Ma (Carbonifère) | `Late Carboniferous: Gondwana (southern supercontinent) colliding with Euramerica near the equator, forming Pangaea; large ice sheet covering southern Gondwana around the South Pole; equatorial lowlands green with coal forests; Siberia separate to the north; Panthalassa ocean everywhere else.` |
| 400 Ma (Dévonien) | `Early Devonian: Gondwana a huge continent spread across the southern hemisphere and over the South Pole; Laurussia (North America joined with Baltica and Avalonia) near the equator; Siberia separate to the north; Rheic Ocean between Gondwana and Laurussia; land mostly barren with green patches near coasts.` |
| 500 Ma (Cambrien) | `Late Cambrian: barren lifeless land (brown, grey, no green); Gondwana large in the southern hemisphere stretching from the equator toward the South Pole; Laurentia (North America), Baltica and Siberia as separate smaller continents near the equator; Iapetus Ocean between Laurentia and Baltica; wide shallow continental seas.` |
| 600 Ma (Édiacarien) | `Ediacaran: barren grey-brown continents with no vegetation; fragments of the broken supercontinent Rodinia scattered, many in the southern hemisphere; Gondwana assembling from several blocks; Laurentia, Baltica and Amazonia close together near the South Pole region; wide oceans between.` |
| 750 Ma (Cryogénien) | `Cryogenian: supercontinent Rodinia breaking apart near the equator, rift oceans opening between Laurentia and the other blocks; barren grey land, no vegetation; thin sea ice beginning at high latitudes (prelude to Snowball Earth).` |
| 1 Ga (Protérozoïque) | `Mesoproterozoic supercontinent Rodinia: one large barren grey-brown landmass assembled around Laurentia near the equator, surrounded by a single global ocean (Mirovia); no vegetation, no ice.` |

Rappel : avant 250 Ma, les positions sont débattues entre scientifiques ; afficher sur le site la mention « reconstitution approximative ».
