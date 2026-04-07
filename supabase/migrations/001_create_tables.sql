-- ═══════════════════════════════════════════════════════
--  BIRD GOONING — Database Schema
-- ═══════════════════════════════════════════════════════

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

-- ───────────────────────────────────────────────────────
--  Table: birds_reference
-- ───────────────────────────────────────────────────────
create table if not exists birds_reference (
  id uuid primary key default uuid_generate_v4(),
  common_name text not null,
  genus text not null,
  species text not null,
  family text not null,
  evolutionary_history text,
  habitat_description text,
  is_rare boolean default false,
  is_extinct boolean default false,
  created_at timestamptz default now()
);

-- Full-text search index on common_name and genus
create index if not exists idx_birds_fts
  on birds_reference
  using gin (to_tsvector('english', coalesce(common_name, '') || ' ' || coalesce(genus, '')));

-- ───────────────────────────────────────────────────────
--  Table: sighting_logs
-- ───────────────────────────────────────────────────────
create table if not exists sighting_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  bird_id uuid references birds_reference(id) on delete cascade,
  sighting_date timestamptz default now(),
  location_coordinates geography(Point, 4326),
  location_name text,
  user_notes text,
  image_path text,
  created_at timestamptz default now()
);

create index if not exists idx_sightings_user on sighting_logs(user_id);
create index if not exists idx_sightings_bird on sighting_logs(bird_id);
create index if not exists idx_sightings_geo on sighting_logs using gist(location_coordinates);

-- ───────────────────────────────────────────────────────
--  Row Level Security
-- ───────────────────────────────────────────────────────
alter table birds_reference enable row level security;
alter table sighting_logs enable row level security;

-- Everyone can read the bird reference
create policy "Public read access" on birds_reference
  for select using (true);

-- Users can only see their own sightings
create policy "Users read own sightings" on sighting_logs
  for select using (auth.uid() = user_id);

create policy "Users insert own sightings" on sighting_logs
  for insert with check (auth.uid() = user_id);

create policy "Users update own sightings" on sighting_logs
  for update using (auth.uid() = user_id);

create policy "Users delete own sightings" on sighting_logs
  for delete using (auth.uid() = user_id);

-- ───────────────────────────────────────────────────────
--  Storage Buckets
-- ───────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('reference_media', 'reference_media', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('user_vault', 'user_vault', false)
on conflict (id) do nothing;

-- Storage policies: everyone can read reference_media
create policy "Public read reference_media" on storage.objects
  for select using (bucket_id = 'reference_media');

-- Storage policies: users can only access their own files in user_vault
create policy "Users read own vault files" on storage.objects
  for select using (bucket_id = 'user_vault' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users upload to own vault" on storage.objects
  for insert with check (bucket_id = 'user_vault' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users delete own vault files" on storage.objects
  for delete using (bucket_id = 'user_vault' and auth.uid()::text = (storage.foldername(name))[1]);

-- ───────────────────────────────────────────────────────
--  Seed: Evolutionary History Module
-- ───────────────────────────────────────────────────────
insert into birds_reference (common_name, genus, species, family, evolutionary_history, habitat_description, is_rare, is_extinct) values
(
  'Archaeopteryx',
  'Archaeopteryx',
  'lithographica',
  'Archaeopterygidae',
  'Birds are the last living lineage of theropod dinosaurs. From the Jurassic period''s Archaeopteryx to the diversification of Neoaves, birds evolved feathers for thermoregulation before flight, and a lightweight skeletal structure that persists in modern species today. Archaeopteryx, dating to ~150 million years ago, represents the transitional form between non-avian dinosaurs and modern birds, possessing both reptilian teeth and flight feathers.',
  'Late Jurassic limestone lagoons of what is now Bavaria, Germany. Tropical archipelago environment.',
  true,
  true
),
(
  'Bald Eagle',
  'Haliaeetus',
  'leucocephalus',
  'Accipitridae',
  'Birds are the last living lineage of theropod dinosaurs. Eagles belong to Accipitridae, part of Neoaves — the massive radiation of bird species that occurred after the K-Pg extinction event 66 million years ago. Raptors evolved powerful talons and hooked beaks as apex predators, retaining the bipedal stance of their theropod ancestors.',
  'Found near large bodies of open water with abundant food supply and old-growth trees for nesting. Ranges across North America from Alaska to northern Mexico.',
  false,
  false
),
(
  'Carolina Parakeet',
  'Conuropsis',
  'carolinensis',
  'Psittacidae',
  'Birds are the last living lineage of theropod dinosaurs. Parrots (Psittacidae) diverged early in the Neoaves radiation. The Carolina Parakeet was the only parrot species native to the eastern United States. Its extinction in 1918 was driven by habitat destruction and hunting — a reminder that the beak, which evolved to replace heavy teeth, could not adapt fast enough to human encroachment.',
  'Eastern deciduous forests and forest edges of the United States, from the Ohio Valley to the Gulf of Mexico. Nested in hollow trees.',
  true,
  true
),
(
  'Atlantic Puffin',
  'Fratercula',
  'arctica',
  'Alcidae',
  'Birds are the last living lineage of theropod dinosaurs. Alcids (auks, puffins) evolved for a semi-aquatic lifestyle, using their wings for underwater propulsion — a parallel to penguins but in the Northern Hemisphere. Their hollow bones, inherited from theropod ancestors, remain lightweight enough for both flight and diving.',
  'Rocky coastal cliffs and offshore islands of the North Atlantic. Breeds in burrows on grassy clifftops. Winters at sea.',
  false,
  false
),
(
  'Dodo',
  'Raphus',
  'cucullatus',
  'Columbidae',
  'Birds are the last living lineage of theropod dinosaurs. The Dodo descended from pigeons (Columbidae) that colonized Mauritius and, lacking predators, evolved flightlessness. Its beak — which evolved to replace heavy teeth — grew large for crushing hard seeds. Extinct by 1681 due to human hunting and introduced species.',
  'Endemic to Mauritius in the Indian Ocean. Inhabited lowland forests with abundant fruit and seed resources.',
  true,
  true
),
(
  'Ruby-throated Hummingbird',
  'Archilochus',
  'colubris',
  'Trochilidae',
  'Birds are the last living lineage of theropod dinosaurs. Hummingbirds represent one of the most extreme evolutionary specializations in Neoaves — hovering flight powered by a unique shoulder joint, the highest metabolic rate of any bird, and feathers evolved far beyond thermoregulation into iridescent display structures. Their lightweight skeletal structure is pushed to its minimum.',
  'Eastern North America. Deciduous and mixed forests, gardens, and meadows. Migrates across the Gulf of Mexico — a 500-mile non-stop flight.',
  false,
  false
),
(
  'Great Auk',
  'Pinguinus',
  'impennis',
  'Alcidae',
  'Birds are the last living lineage of theropod dinosaurs. The Great Auk was a large, flightless seabird of the North Atlantic — the original "penguin" (the name was later transferred to Southern Hemisphere birds). Like the Dodo, it shows how theropod descendants can lose flight when ecological pressures favor swimming over flying. Extinct by 1844.',
  'Rocky islands and coastlines of the North Atlantic, from Canada to Norway. Bred in dense colonies on low-lying rocky islets.',
  true,
  true
),
(
  'Peregrine Falcon',
  'Falco',
  'peregrinus',
  'Falconidae',
  'Birds are the last living lineage of theropod dinosaurs. Falcons were once grouped with hawks but DNA evidence places them closer to parrots and songbirds — a stunning example of convergent evolution. The Peregrine''s stoop (hunting dive) at over 240 mph makes it the fastest animal on Earth, powered by the same lightweight hollow-bone architecture inherited from theropods.',
  'Found on every continent except Antarctica. Nests on cliff faces, skyscrapers, and bridges. Hunts in open airspace.',
  false,
  false
);
