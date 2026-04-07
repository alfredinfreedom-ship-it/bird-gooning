#!/usr/bin/env node
// Runs SQL migrations via Supabase service role by creating a temporary exec function

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const SUPABASE_URL = 'https://dfdnkhvllevapeomwosa.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.error('Set SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  db: { schema: 'public' },
});

// The service role can insert/update/delete but can't run DDL via REST.
// Instead, let's use the supabase-js admin features to insert data
// and handle schema changes separately.

// For the seed data, we can use the service role to insert directly.
async function seedBirds() {
  console.log('Seeding initial 8 birds from migration 001...');

  // First, check if table exists by trying to query it
  const { data: existing, error: checkErr } = await supabase
    .from('birds_reference')
    .select('id')
    .limit(1);

  if (checkErr) {
    console.error('birds_reference table does not exist yet.');
    console.error('You must run the DDL (CREATE TABLE) statements in the Supabase SQL Editor first.');
    console.error('File: supabase/migrations/001_create_tables.sql');
    console.error('Only the CREATE TABLE, ALTER TABLE, CREATE INDEX, and CREATE POLICY statements need the SQL Editor.');
    console.error('After that, re-run this script to seed data.');
    process.exit(1);
  }

  console.log('Table exists! Checking existing records...');
  const { data: allBirds } = await supabase.from('birds_reference').select('common_name');
  const existingNames = new Set((allBirds || []).map(b => b.common_name));

  // Seed the original 8 birds
  const seed1 = [
    { common_name: 'Archaeopteryx', genus: 'Archaeopteryx', species: 'lithographica', family: 'Archaeopterygidae', evolutionary_history: 'Birds are the last living lineage of theropod dinosaurs. From the Jurassic period\'s Archaeopteryx to the diversification of Neoaves, birds evolved feathers for thermoregulation before flight, and a lightweight skeletal structure that persists in modern species today. Archaeopteryx, dating to ~150 million years ago, represents the transitional form between non-avian dinosaurs and modern birds, possessing both reptilian teeth and flight feathers.', habitat_description: 'Late Jurassic limestone lagoons of what is now Bavaria, Germany. Tropical archipelago environment.', is_rare: true, is_extinct: true },
    { common_name: 'Bald Eagle', genus: 'Haliaeetus', species: 'leucocephalus', family: 'Accipitridae', evolutionary_history: 'Birds are the last living lineage of theropod dinosaurs. Eagles belong to Accipitridae, part of Neoaves — the massive radiation of bird species that occurred after the K-Pg extinction event 66 million years ago. Raptors evolved powerful talons and hooked beaks as apex predators, retaining the bipedal stance of their theropod ancestors.', habitat_description: 'Found near large bodies of open water with abundant food supply and old-growth trees for nesting. Ranges across North America from Alaska to northern Mexico.', is_rare: false, is_extinct: false },
    { common_name: 'Carolina Parakeet', genus: 'Conuropsis', species: 'carolinensis', family: 'Psittacidae', evolutionary_history: 'Birds are the last living lineage of theropod dinosaurs. Parrots (Psittacidae) diverged early in the Neoaves radiation. The Carolina Parakeet was the only parrot species native to the eastern United States. Its extinction in 1918 was driven by habitat destruction and hunting.', habitat_description: 'Eastern deciduous forests and forest edges of the United States, from the Ohio Valley to the Gulf of Mexico. Nested in hollow trees.', is_rare: true, is_extinct: true },
    { common_name: 'Atlantic Puffin', genus: 'Fratercula', species: 'arctica', family: 'Alcidae', evolutionary_history: 'Birds are the last living lineage of theropod dinosaurs. Alcids (auks, puffins) evolved for a semi-aquatic lifestyle, using their wings for underwater propulsion. Their hollow bones, inherited from theropod ancestors, remain lightweight enough for both flight and diving.', habitat_description: 'Rocky coastal cliffs and offshore islands of the North Atlantic. Breeds in burrows on grassy clifftops. Winters at sea.', is_rare: false, is_extinct: false },
    { common_name: 'Dodo', genus: 'Raphus', species: 'cucullatus', family: 'Columbidae', evolutionary_history: 'Birds are the last living lineage of theropod dinosaurs. The Dodo descended from pigeons (Columbidae) that colonized Mauritius and, lacking predators, evolved flightlessness. Extinct by 1681 due to human hunting and introduced species.', habitat_description: 'Endemic to Mauritius in the Indian Ocean. Inhabited lowland forests with abundant fruit and seed resources.', is_rare: true, is_extinct: true },
    { common_name: 'Ruby-throated Hummingbird', genus: 'Archilochus', species: 'colubris', family: 'Trochilidae', evolutionary_history: 'Birds are the last living lineage of theropod dinosaurs. Hummingbirds represent one of the most extreme evolutionary specializations in Neoaves — hovering flight powered by a unique shoulder joint, the highest metabolic rate of any bird, and feathers evolved far beyond thermoregulation into iridescent display structures.', habitat_description: 'Eastern North America. Deciduous and mixed forests, gardens, and meadows. Migrates across the Gulf of Mexico — a 500-mile non-stop flight.', is_rare: false, is_extinct: false },
    { common_name: 'Great Auk', genus: 'Pinguinus', species: 'impennis', family: 'Alcidae', evolutionary_history: 'Birds are the last living lineage of theropod dinosaurs. The Great Auk was a large, flightless seabird of the North Atlantic — the original "penguin". Like the Dodo, it shows how theropod descendants can lose flight when ecological pressures favor swimming over flying. Extinct by 1844.', habitat_description: 'Rocky islands and coastlines of the North Atlantic, from Canada to Norway. Bred in dense colonies on low-lying rocky islets.', is_rare: true, is_extinct: true },
    { common_name: 'Peregrine Falcon', genus: 'Falco', species: 'peregrinus', family: 'Falconidae', evolutionary_history: 'Birds are the last living lineage of theropod dinosaurs. Falcons were once grouped with hawks but DNA evidence places them closer to parrots and songbirds — stunning convergent evolution. The Peregrine\'s stoop at over 240 mph makes it the fastest animal on Earth.', habitat_description: 'Found on every continent except Antarctica. Nests on cliff faces, skyscrapers, and bridges. Hunts in open airspace.', is_rare: false, is_extinct: false },
  ];

  for (const bird of seed1) {
    if (existingNames.has(bird.common_name)) {
      console.log(`  Skip (exists): ${bird.common_name}`);
      continue;
    }
    const { error } = await supabase.from('birds_reference').insert(bird);
    if (error) console.log(`  FAIL: ${bird.common_name} — ${error.message}`);
    else console.log(`  ✓ ${bird.common_name}`);
  }

  // Seed the A-C mass ingestion
  console.log('\nSeeding A-C birds (59 species)...');
  const acBirds = [
    ["Abert's Towhee","Melozone","aberti","Passerellidae"],
    ["Acadian Flycatcher","Empidonax","virescens","Tyrannidae"],
    ["Acorn Woodpecker","Melanerpes","formicivorus","Picidae"],
    ["African Collared-Dove","Streptopelia","roseogrisea","Columbidae"],
    ["Alder Flycatcher","Empidonax","alnorum","Tyrannidae"],
    ["Aleutian Tern","Onychoprion","aleuticus","Laridae"],
    ["Allen's Hummingbird","Selasphorus","sasin","Trochilidae"],
    ["Altamira Oriole","Icterus","gularis","Icteridae"],
    ["Amazon Kingfisher","Chloroceryle","amazona","Alcedinidae"],
    ["American Avocet","Recurvirostra","americana","Recurvirostridae"],
    ["American Bittern","Botaurus","lentiginosus","Ardeidae"],
    ["American Black Duck","Anas","rubripes","Anatidae"],
    ["American Coot","Fulica","americana","Rallidae"],
    ["American Crow","Corvus","brachyrhynchos","Corvidae"],
    ["American Dipper","Cinclus","mexicanus","Cinclidae"],
    ["American Flamingo","Phoenicopterus","ruber","Phoenicopteridae"],
    ["American Golden-Plover","Pluvialis","dominica","Charadriidae"],
    ["American Goldfinch","Spinus","tristis","Fringillidae"],
    ["American Kestrel","Falco","sparverius","Falconidae"],
    ["American Oystercatcher","Haematopus","palliatus","Haematopodidae"],
    ["American Pipit","Anthus","rubescens","Motacillidae"],
    ["American Redstart","Setophaga","ruticilla","Parulidae"],
    ["American Robin","Turdus","migratorius","Turdidae"],
    ["Ancient Murrelet","Synthliboramphus","antiquus","Alcidae"],
    ["Anhinga","Anhinga","anhinga","Anhingidae"],
    ["Anna's Hummingbird","Calypte","anna","Trochilidae"],
    ["Arctic Loon","Gavia","arctica","Gaviidae"],
    ["Arctic Tern","Sterna","paradisaea","Laridae"],
    ["Arctic Warbler","Phylloscopus","borealis","Phylloscopidae"],
    ["Arizona Woodpecker","Dryobates","arizonae","Picidae"],
    ["Ash-throated Flycatcher","Myiarchus","cinerascens","Tyrannidae"],
    ["Audubon's Oriole","Icterus","graduacauda","Icteridae"],
    ["Aztec Thrush","Ridgwayia","pinicola","Turdidae"],
    ["Baltimore Oriole","Icterus","galbula","Icteridae"],
    ["Bananaquit","Coereba","flaveola","Thraupidae"],
    ["Barn Owl","Tyto","alba","Tytonidae"],
    ["Barn Swallow","Hirundo","rustica","Hirundinidae"],
    ["Barred Owl","Strix","varia","Strigidae"],
    ["Barrow's Goldeneye","Bucephala","islandica","Anatidae"],
    ["Belted Kingfisher","Megaceryle","alcyon","Alcedinidae"],
    ["Black-billed Magpie","Pica","hudsonia","Corvidae"],
    ["Black-capped Chickadee","Poecile","atricapillus","Paridae"],
    ["Blue Jay","Cyanocitta","cristata","Corvidae"],
    ["Bobolink","Dolichonyx","oryzivorus","Icteridae"],
    ["Boreal Chickadee","Poecile","hudsonicus","Paridae"],
    ["Brown Pelican","Pelecanus","occidentalis","Pelecanidae"],
    ["Bufflehead","Bucephala","albeola","Anatidae"],
    ["Burrowing Owl","Athene","cunicularia","Strigidae"],
    ["Bushtit","Psaltriparus","minimus","Aegithalidae"],
    ["Cackling Goose","Branta","hutchinsii","Anatidae"],
    ["California Condor","Gymnogyps","californianus","Cathartidae"],
    ["Canada Goose","Branta","canadensis","Anatidae"],
    ["Canvasback","Aythya","valisineria","Anatidae"],
    ["Carolina Wren","Thryothorus","ludovicianus","Troglodytidae"],
    ["Caspian Tern","Hydroprogne","caspia","Laridae"],
    ["Cedar Waxwing","Bombycilla","cedrorum","Bombycillidae"],
    ["Chipping Sparrow","Spizella","passerina","Passerellidae"],
    ["Common Loon","Gavia","immer","Gaviidae"],
    ["Common Raven","Corvus","corax","Corvidae"],
  ];

  let inserted = 0;
  for (const [name, genus, species, family] of acBirds) {
    if (existingNames.has(name)) {
      console.log(`  Skip (exists): ${name}`);
      continue;
    }
    const { error } = await supabase.from('birds_reference').insert({
      common_name: name,
      genus,
      species,
      family,
      genus_species: `${genus} ${species}`,
      evolutionary_history: 'AUTO_RESEARCH_PENDING',
      habitat_description: 'AUTO_RESEARCH_PENDING',
      dinosaur_clade: 'AUTO_RESEARCH_PENDING',
      status: 'Ingested',
    });
    if (error) {
      console.log(`  FAIL: ${name} — ${error.message}`);
    } else {
      console.log(`  ✓ ${name}`);
      inserted++;
    }
  }
  console.log(`\nInserted ${inserted} new A-C birds.`);
}

seedBirds();
