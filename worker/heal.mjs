#!/usr/bin/env node
// ═══════════════════════════════════════════════════════
//  BIRD GOONING — Self-Healing Worker
//  Scans 'Ingested' records, researches each bird,
//  fills in evolutionary history + clade + image, marks 'Healthy'
// ═══════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dfdnkhvllevapeomwosa.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('ERROR: Set SUPABASE_SERVICE_ROLE_KEY environment variable.');
  console.error('Find it in Supabase Dashboard → Settings → API → service_role secret');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ── Clade mapping based on taxonomic order/family ─────
const CLADE_MAP = {
  // Galloanserae
  'Anatidae':       { clade: 'Galloanserae → Anseriformes',  note: 'Waterfowl — ducks, geese, swans. Among the most basal living Neognathae, diverging early after the K-Pg extinction.' },
  'Phasianidae':    { clade: 'Galloanserae → Galliformes',   note: 'Landfowl — chickens, turkeys, quail. Sister group to Anseriformes; together they form the ancient Galloanserae.' },
  'Odontophoridae': { clade: 'Galloanserae → Galliformes',   note: 'New World quail. Part of the Galliformes, the ground-dwelling branch of Galloanserae.' },
  'Cracidae':       { clade: 'Galloanserae → Galliformes',   note: 'Guans and curassows. Ancient Galliformes lineage from Neotropical forests.' },

  // Neoaves — Strisores (nightjars, swifts, hummingbirds)
  'Trochilidae':    { clade: 'Neoaves → Strisores → Apodiformes',  note: 'Hummingbirds. Extreme hovering specialists with the highest metabolic rate of any bird. Diverged from swifts ~42 MYA.' },
  'Apodidae':       { clade: 'Neoaves → Strisores → Apodiformes',  note: 'Swifts. Aerial specialists that share a common ancestor with hummingbirds.' },
  'Caprimulgidae':  { clade: 'Neoaves → Strisores → Caprimulgiformes', note: 'Nightjars. Nocturnal insectivores in the ancient Strisores radiation.' },

  // Neoaves — Columbaves
  'Columbidae':     { clade: 'Neoaves → Columbaves → Columbiformes', note: 'Pigeons and doves. Includes the extinct Dodo. Ancient lineage within Neoaves.' },

  // Neoaves — Gruiformes
  'Rallidae':       { clade: 'Neoaves → Gruiformes',         note: 'Rails and coots. Secretive waterbirds; many island species evolved flightlessness.' },
  'Gruidae':        { clade: 'Neoaves → Gruiformes',         note: 'Cranes. Ancient wading birds with fossil record extending to the Eocene.' },

  // Neoaves — Aequorlitornithes (shorebirds, waterbirds)
  'Laridae':        { clade: 'Neoaves → Aequorlitornithes → Charadriiformes', note: 'Gulls and terns. Charadriiform seabirds with global distribution.' },
  'Scolopacidae':   { clade: 'Neoaves → Aequorlitornithes → Charadriiformes', note: 'Sandpipers. Shorebirds with remarkable long-distance migrations.' },
  'Charadriidae':   { clade: 'Neoaves → Aequorlitornithes → Charadriiformes', note: 'Plovers. Ground-nesting shorebirds found worldwide.' },
  'Haematopodidae': { clade: 'Neoaves → Aequorlitornithes → Charadriiformes', note: 'Oystercatchers. Specialized shorebirds with blade-like bills for prying open shellfish.' },
  'Recurvirostridae':{ clade: 'Neoaves → Aequorlitornithes → Charadriiformes', note: 'Avocets and stilts. Elegant waders with upturned or needle-thin bills.' },
  'Alcidae':        { clade: 'Neoaves → Aequorlitornithes → Charadriiformes', note: 'Auks and puffins. Northern Hemisphere seabirds that use wings for underwater propulsion.' },
  'Gaviidae':       { clade: 'Neoaves → Aequorlitornithes → Gaviiformes', note: 'Loons/divers. Ancient fish-eating waterbirds with solid bones for diving — unusual among birds.' },
  'Pelecanidae':    { clade: 'Neoaves → Aequorlitornithes → Pelecaniformes', note: 'Pelicans. Large waterbirds with distinctive throat pouches.' },
  'Ardeidae':       { clade: 'Neoaves → Aequorlitornithes → Pelecaniformes', note: 'Herons and bitterns. Wading predators with specialized neck vertebrae for striking prey.' },
  'Anhingidae':     { clade: 'Neoaves → Aequorlitornithes → Suliformes', note: 'Darters. Spear-fishing birds that swim submerged with only their neck above water.' },
  'Phoenicopteridae':{ clade: 'Neoaves → Aequorlitornithes → Phoenicopteriformes', note: 'Flamingos. Filter-feeders with an ancient lineage; debated placement near grebes.' },

  // Neoaves — Telluraves (land birds)
  'Accipitridae':   { clade: 'Neoaves → Telluraves → Accipitriformes', note: 'Hawks and eagles. Apex aerial predators retaining the killing instinct of their theropod ancestors.' },
  'Cathartidae':    { clade: 'Neoaves → Telluraves → Accipitriformes', note: 'New World vultures. Includes the California Condor. Scavengers with extraordinary soaring ability.' },
  'Strigidae':      { clade: 'Neoaves → Telluraves → Strigiformes', note: 'Typical owls. Nocturnal predators with asymmetric ears for sound-based hunting.' },
  'Tytonidae':      { clade: 'Neoaves → Telluraves → Strigiformes', note: 'Barn owls. Ancient owl lineage with heart-shaped facial disc for funneling sound.' },
  'Falconidae':     { clade: 'Neoaves → Telluraves → Falconiformes', note: 'Falcons. Surprisingly closer to parrots than hawks — convergent evolution of raptor form. Peregrine stoops at 240+ mph.' },
  'Corvidae':       { clade: 'Neoaves → Telluraves → Passeriformes → Corvida', note: 'Crows, ravens, jays, magpies. Among the most intelligent birds; tool use documented in multiple species.' },
  'Paridae':        { clade: 'Neoaves → Telluraves → Passeriformes → Passerida', note: 'Tits and chickadees. Small passerines with complex social systems and food-caching behavior.' },
  'Passerellidae':  { clade: 'Neoaves → Telluraves → Passeriformes → Passerida', note: 'New World sparrows. Seed-eating oscines that radiated across the Americas.' },
  'Parulidae':      { clade: 'Neoaves → Telluraves → Passeriformes → Passerida', note: 'New World warblers. Neotropical migrants; many species undertake trans-Gulf flights.' },
  'Icteridae':      { clade: 'Neoaves → Telluraves → Passeriformes → Passerida', note: 'New World blackbirds, orioles, grackles. Diverse family with elaborate nest-building.' },
  'Fringillidae':   { clade: 'Neoaves → Telluraves → Passeriformes → Passerida', note: 'Finches. Seed specialists whose beak shapes famously inspired Darwin.' },
  'Turdidae':       { clade: 'Neoaves → Telluraves → Passeriformes → Passerida', note: 'Thrushes. Globally distributed songbirds including the American Robin.' },
  'Tyrannidae':     { clade: 'Neoaves → Telluraves → Passeriformes → Tyranni', note: 'Tyrant flycatchers. Largest passerine family in the New World — suboscine insectivores.' },
  'Hirundinidae':   { clade: 'Neoaves → Telluraves → Passeriformes → Passerida', note: 'Swallows. Aerial insectivores with forked tails; Barn Swallow is the most widespread.' },
  'Bombycillidae':  { clade: 'Neoaves → Telluraves → Passeriformes → Passerida', note: 'Waxwings. Frugivorous songbirds with waxy red wing-tips used in courtship display.' },
  'Motacillidae':   { clade: 'Neoaves → Telluraves → Passeriformes → Passerida', note: 'Pipits and wagtails. Ground-dwelling passerines found across tundra and alpine habitats.' },
  'Cinclidae':      { clade: 'Neoaves → Telluraves → Passeriformes → Passerida', note: 'Dippers. The only truly aquatic passerines — walk underwater to feed on stream invertebrates.' },
  'Troglodytidae':  { clade: 'Neoaves → Telluraves → Passeriformes → Passerida', note: 'Wrens. Small, loud songbirds. Carolina Wren is among the most vocal backyard birds.' },
  'Aegithalidae':   { clade: 'Neoaves → Telluraves → Passeriformes → Passerida', note: 'Long-tailed tits and bushtits. Tiny communal nesters that build elaborate hanging nests.' },
  'Thraupidae':     { clade: 'Neoaves → Telluraves → Passeriformes → Passerida', note: 'Tanagers. Largest passerine family; includes the Bananaquit. Explosive Neotropical radiation.' },
  'Phylloscopidae': { clade: 'Neoaves → Telluraves → Passeriformes → Passerida', note: 'Leaf warblers. Old World insectivores; Arctic Warbler breeds in both Asia and Alaska.' },
  'Alcedinidae':    { clade: 'Neoaves → Telluraves → Coraciiformes', note: 'Kingfishers. Diving fish-catchers with large heads and dagger bills.' },
  'Picidae':        { clade: 'Neoaves → Telluraves → Piciformes', note: 'Woodpeckers. Specialized for excavating wood; shock-absorbing skull protects the brain.' },

  // Additional families (D-Z ingestion)
  'Cardinalidae':   { clade: 'Neoaves → Telluraves → Passeriformes → Passerida', note: 'Cardinals, grosbeaks, buntings. Seed-cracking songbirds with sexually dimorphic plumage — males bright, females cryptic.' },
  'Phalacrocoracidae': { clade: 'Neoaves → Aequorlitornithes → Suliformes', note: 'Cormorants. Diving fish-eaters that lack waterproof feathers — they spread wings to dry after diving.' },
  'Podicipedidae':  { clade: 'Neoaves → Aequorlitornithes → Podicipediformes', note: 'Grebes. Diving waterbirds with lobed toes; phylogenetically close to flamingos despite appearances.' },
  'Sturnidae':      { clade: 'Neoaves → Telluraves → Passeriformes → Passerida', note: 'Starlings and mynas. Old World passerines; European Starling is one of the most successful invasive species globally.' },
  'Threskiornithidae': { clade: 'Neoaves → Aequorlitornithes → Pelecaniformes', note: 'Ibises and spoonbills. Wading birds with specialized curved or flattened bills for tactile foraging.' },
  'Regulidae':      { clade: 'Neoaves → Telluraves → Passeriformes → Passerida', note: 'Kinglets. Tiny insectivorous songbirds with colorful crown patches; among the smallest passerines.' },
  'Mimidae':        { clade: 'Neoaves → Telluraves → Passeriformes → Passerida', note: 'Mockingbirds, catbirds, thrashers. Renowned vocal mimics that can learn hundreds of song phrases.' },
  'Laniidae':       { clade: 'Neoaves → Telluraves → Passeriformes → Corvida', note: 'Shrikes. "Butcher birds" that impale prey on thorns — predatory passerines with hooked bills.' },
  'Gruidae':        { clade: 'Neoaves → Gruiformes', note: 'Cranes. Ancient wading birds with fossil record extending to the Eocene; elaborate dancing courtship displays.' },
  'Pandionidae':    { clade: 'Neoaves → Telluraves → Accipitriformes', note: 'Ospreys. Fish-hunting raptors with reversible outer toes and oily, water-resistant plumage.' },
  'Sittidae':       { clade: 'Neoaves → Telluraves → Passeriformes → Passerida', note: 'Nuthatches. Bark-foraging birds that uniquely descend tree trunks headfirst.' },
  'Phasianidae':    { clade: 'Galloanserae → Galliformes', note: 'Pheasants, turkeys, grouse. Ground-dwelling Galliformes; Wild Turkey is among the largest Galloanserae in North America.' },
  'Cuculidae':      { clade: 'Neoaves → Otidimorphae → Cuculiformes', note: 'Cuckoos. Ancient Neoaves lineage; many Old World species are brood parasites, though New World species raise their own young.' },
  'Passeridae':     { clade: 'Neoaves → Telluraves → Passeriformes → Passerida', note: 'Old World sparrows. House Sparrow is a globally successful commensal species, thriving near human habitation.' },

  // Fallback
  '_default':       { clade: 'Neoaves (unresolved)', note: 'Placement within Neoaves requires further phylogenetic analysis.' },
};

function getCladeInfo(family) {
  return CLADE_MAP[family] || CLADE_MAP['_default'];
}

function buildEvolutionaryHistory(bird, cladeInfo) {
  return `Birds are the last living lineage of theropod dinosaurs. ${bird.common_name} (${bird.genus} ${bird.species}) belongs to the family ${bird.family}, placed within ${cladeInfo.clade}. ${cladeInfo.note} From the Jurassic Archaeopteryx to the K-Pg survival bottleneck 66 million years ago, the ancestors of ${bird.common_name} inherited hollow bones, feathers originally evolved for thermoregulation, and a keratinous beak that replaced the heavy toothed jaws of their theropod forebears.`;
}

// ── Wikipedia image fetch ─────────────────────────────
async function fetchWikipediaImage(birdName) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(birdName)}&prop=pageimages&format=json&pithumbsize=400&redirects=1`;
    const res = await fetch(searchUrl);
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0];
    return page?.thumbnail?.source || null;
  } catch {
    return null;
  }
}

// ── Main healing loop ─────────────────────────────────
async function healAll() {
  console.log('🔬 Bird Gooning Self-Healing Worker starting...\n');

  const { data: birds, error } = await supabase
    .from('birds_reference')
    .select('*')
    .eq('status', 'Ingested')
    .order('common_name');

  if (error) {
    console.error('Failed to fetch birds:', error.message);
    process.exit(1);
  }

  console.log(`Found ${birds.length} birds with status 'Ingested'\n`);

  let healed = 0;
  let failed = 0;

  for (const bird of birds) {
    process.stdout.write(`  Healing: ${bird.common_name}...`);

    try {
      const cladeInfo = getCladeInfo(bird.family);
      const evolutionaryHistory = buildEvolutionaryHistory(bird, cladeInfo);
      const imageUrl = await fetchWikipediaImage(bird.common_name);

      const { error: updateError } = await supabase
        .from('birds_reference')
        .update({
          dinosaur_clade: cladeInfo.clade,
          evolutionary_history: evolutionaryHistory,
          habitat_description: bird.habitat_description === 'AUTO_RESEARCH_PENDING' ? `Habitat data pending for ${bird.common_name} (${bird.genus} ${bird.species}).` : bird.habitat_description,
          image_url: imageUrl,
          status: 'Healthy',
        })
        .eq('id', bird.id);

      if (updateError) {
        console.log(` FAILED (${updateError.message})`);
        failed++;
      } else {
        console.log(` ✓ ${cladeInfo.clade}${imageUrl ? ' [img]' : ' [no img]'}`);
        healed++;
      }

      // Small delay to be polite to Wikipedia API
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.log(` ERROR: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n═══════════════════════════════════════`);
  console.log(`  Healed: ${healed} | Failed: ${failed} | Total: ${birds.length}`);
  console.log(`═══════════════════════════════════════\n`);
}

healAll();
