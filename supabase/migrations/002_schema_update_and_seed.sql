-- ═══════════════════════════════════════════════════════
--  BIRD GOONING — Schema Update + Mass Seed
-- ═══════════════════════════════════════════════════════

-- Step 1: Add new columns to birds_reference
ALTER TABLE birds_reference ADD COLUMN IF NOT EXISTS genus_species text DEFAULT 'AUTO_RESEARCH_PENDING';
ALTER TABLE birds_reference ADD COLUMN IF NOT EXISTS dinosaur_clade text DEFAULT 'AUTO_RESEARCH_PENDING';
ALTER TABLE birds_reference ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE birds_reference ADD COLUMN IF NOT EXISTS status text DEFAULT 'Ingested';

-- Unique index on common_name
CREATE UNIQUE INDEX IF NOT EXISTS idx_birds_common_name_unique ON birds_reference(common_name);

-- Update existing seed records to 'Healthy' (they already have data)
UPDATE birds_reference SET status = 'Healthy' WHERE evolutionary_history IS NOT NULL AND evolutionary_history != 'AUTO_RESEARCH_PENDING';

-- ───────────────────────────────────────────────────────
--  Step 2: Mass Alphabetical Ingestion (A–C)
-- ───────────────────────────────────────────────────────
INSERT INTO birds_reference (common_name, genus, species, family, genus_species, evolutionary_history, habitat_description, dinosaur_clade, status)
VALUES
  ('Abert''s Towhee', 'Melozone', 'aberti', 'Passerellidae', 'Melozone aberti', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Acadian Flycatcher', 'Empidonax', 'virescens', 'Tyrannidae', 'Empidonax virescens', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Acorn Woodpecker', 'Melanerpes', 'formicivorus', 'Picidae', 'Melanerpes formicivorus', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('African Collared-Dove', 'Streptopelia', 'roseogrisea', 'Columbidae', 'Streptopelia roseogrisea', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Alder Flycatcher', 'Empidonax', 'alnorum', 'Tyrannidae', 'Empidonax alnorum', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Aleutian Tern', 'Onychoprion', 'aleuticus', 'Laridae', 'Onychoprion aleuticus', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Allen''s Hummingbird', 'Selasphorus', 'sasin', 'Trochilidae', 'Selasphorus sasin', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Altamira Oriole', 'Icterus', 'gularis', 'Icteridae', 'Icterus gularis', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Amazon Kingfisher', 'Chloroceryle', 'amazona', 'Alcedinidae', 'Chloroceryle amazona', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('American Avocet', 'Recurvirostra', 'americana', 'Recurvirostridae', 'Recurvirostra americana', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('American Bittern', 'Botaurus', 'lentiginosus', 'Ardeidae', 'Botaurus lentiginosus', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('American Black Duck', 'Anas', 'rubripes', 'Anatidae', 'Anas rubripes', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('American Coot', 'Fulica', 'americana', 'Rallidae', 'Fulica americana', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('American Crow', 'Corvus', 'brachyrhynchos', 'Corvidae', 'Corvus brachyrhynchos', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('American Dipper', 'Cinclus', 'mexicanus', 'Cinclidae', 'Cinclus mexicanus', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('American Flamingo', 'Phoenicopterus', 'ruber', 'Phoenicopteridae', 'Phoenicopterus ruber', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('American Golden-Plover', 'Pluvialis', 'dominica', 'Charadriidae', 'Pluvialis dominica', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('American Goldfinch', 'Spinus', 'tristis', 'Fringillidae', 'Spinus tristis', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('American Kestrel', 'Falco', 'sparverius', 'Falconidae', 'Falco sparverius', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('American Oystercatcher', 'Haematopus', 'palliatus', 'Haematopodidae', 'Haematopus palliatus', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('American Pipit', 'Anthus', 'rubescens', 'Motacillidae', 'Anthus rubescens', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('American Redstart', 'Setophaga', 'ruticilla', 'Parulidae', 'Setophaga ruticilla', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('American Robin', 'Turdus', 'migratorius', 'Turdidae', 'Turdus migratorius', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Ancient Murrelet', 'Synthliboramphus', 'antiquus', 'Alcidae', 'Synthliboramphus antiquus', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Anhinga', 'Anhinga', 'anhinga', 'Anhingidae', 'Anhinga anhinga', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Anna''s Hummingbird', 'Calypte', 'anna', 'Trochilidae', 'Calypte anna', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Arctic Loon', 'Gavia', 'arctica', 'Gaviidae', 'Gavia arctica', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Arctic Tern', 'Sterna', 'paradisaea', 'Laridae', 'Sterna paradisaea', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Arctic Warbler', 'Phylloscopus', 'borealis', 'Phylloscopidae', 'Phylloscopus borealis', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Arizona Woodpecker', 'Dryobates', 'arizonae', 'Picidae', 'Dryobates arizonae', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Ash-throated Flycatcher', 'Myiarchus', 'cinerascens', 'Tyrannidae', 'Myiarchus cinerascens', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Audubon''s Oriole', 'Icterus', 'graduacauda', 'Icteridae', 'Icterus graduacauda', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Aztec Thrush', 'Ridgwayia', 'pinicola', 'Turdidae', 'Ridgwayia pinicola', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Baltimore Oriole', 'Icterus', 'galbula', 'Icteridae', 'Icterus galbula', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Bananaquit', 'Coereba', 'flaveola', 'Thraupidae', 'Coereba flaveola', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Barn Owl', 'Tyto', 'alba', 'Tytonidae', 'Tyto alba', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Barn Swallow', 'Hirundo', 'rustica', 'Hirundinidae', 'Hirundo rustica', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Barred Owl', 'Strix', 'varia', 'Strigidae', 'Strix varia', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Barrow''s Goldeneye', 'Bucephala', 'islandica', 'Anatidae', 'Bucephala islandica', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Belted Kingfisher', 'Megaceryle', 'alcyon', 'Alcedinidae', 'Megaceryle alcyon', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Black-billed Magpie', 'Pica', 'hudsonia', 'Corvidae', 'Pica hudsonia', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Black-capped Chickadee', 'Poecile', 'atricapillus', 'Paridae', 'Poecile atricapillus', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Blue Jay', 'Cyanocitta', 'cristata', 'Corvidae', 'Cyanocitta cristata', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Bobolink', 'Dolichonyx', 'oryzivorus', 'Icteridae', 'Dolichonyx oryzivorus', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Boreal Chickadee', 'Poecile', 'hudsonicus', 'Paridae', 'Poecile hudsonicus', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Brown Pelican', 'Pelecanus', 'occidentalis', 'Pelecanidae', 'Pelecanus occidentalis', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Bufflehead', 'Bucephala', 'albeola', 'Anatidae', 'Bucephala albeola', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Burrowing Owl', 'Athene', 'cunicularia', 'Strigidae', 'Athene cunicularia', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Bushtit', 'Psaltriparus', 'minimus', 'Aegithalidae', 'Psaltriparus minimus', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Cackling Goose', 'Branta', 'hutchinsii', 'Anatidae', 'Branta hutchinsii', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('California Condor', 'Gymnogyps', 'californianus', 'Cathartidae', 'Gymnogyps californianus', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Canada Goose', 'Branta', 'canadensis', 'Anatidae', 'Branta canadensis', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Canvasback', 'Aythya', 'valisineria', 'Anatidae', 'Aythya valisineria', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Carolina Wren', 'Thryothorus', 'ludovicianus', 'Troglodytidae', 'Thryothorus ludovicianus', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Caspian Tern', 'Hydroprogne', 'caspia', 'Laridae', 'Hydroprogne caspia', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Cedar Waxwing', 'Bombycilla', 'cedrorum', 'Bombycillidae', 'Bombycilla cedrorum', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Chipping Sparrow', 'Spizella', 'passerina', 'Passerellidae', 'Spizella passerina', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Common Loon', 'Gavia', 'immer', 'Gaviidae', 'Gavia immer', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested'),
  ('Common Raven', 'Corvus', 'corax', 'Corvidae', 'Corvus corax', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'AUTO_RESEARCH_PENDING', 'Ingested')
ON CONFLICT (common_name) DO NOTHING;
