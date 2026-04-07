import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Bird {
  id: string;
  common_name: string;
  genus: string;
  species: string;
  family: string;
  is_rare: boolean;
  is_extinct: boolean;
  habitat_description: string;
}

export default function HomePage() {
  const [birds, setBirds] = useState<Bird[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('birds_reference')
        .select('*')
        .order('common_name');
      if (data) setBirds(data);
      setLoading(false);
    })();
  }, []);

  const filtered = birds.filter(b =>
    b.common_name.toLowerCase().includes(search.toLowerCase()) ||
    b.genus.toLowerCase().includes(search.toLowerCase()) ||
    b.family.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{
        padding: '32px 24px 24px',
        borderBottom: '1px solid var(--gold-dim)',
        textAlign: 'center',
      }}>
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: '2rem', marginBottom: 8 }}>
          Bird Gooning
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
          Species Reference &amp; Field Sighting Log
        </p>
        <nav style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/evolution" style={navBtn}>Evolutionary History</Link>
          <Link to="/sightings" style={navBtn}>My Sightings</Link>
        </nav>
      </header>

      {/* Search */}
      <div style={{ padding: '20px 24px 0' }}>
        <input
          type="text"
          placeholder="Search by name, genus, or family..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: 500,
            display: 'block',
            margin: '0 auto',
            padding: '10px 16px',
            background: 'var(--bg-card)',
            border: '1px solid var(--gold-dim)',
            borderRadius: 6,
            color: 'var(--text)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            outline: 'none',
          }}
        />
      </div>

      {/* Bird Grid */}
      <div style={{
        padding: '24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
        maxWidth: 1000,
        margin: '0 auto',
      }}>
        {loading ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: '1/-1' }}>Loading species...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: '1/-1' }}>
            {birds.length === 0 ? 'No species found. Run the SQL migration to seed data.' : 'No matches.'}
          </p>
        ) : filtered.map(bird => (
          <Link to={`/bird/${bird.id}`} key={bird.id} style={{ textDecoration: 'none' }}>
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: '1rem' }}>
                  {bird.common_name}
                </h3>
                <div style={{ display: 'flex', gap: 4 }}>
                  {bird.is_extinct && <span style={tagExtinct}>EXTINCT</span>}
                  {bird.is_rare && <span style={tagRare}>RARE</span>}
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontStyle: 'italic', marginBottom: 6 }}>
                {bird.genus} {bird.species}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                Family: {bird.family}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const navBtn: React.CSSProperties = {
  padding: '8px 18px',
  background: 'var(--bg-card)',
  border: '1px solid var(--gold-dim)',
  borderRadius: 6,
  color: 'var(--gold)',
  fontFamily: 'var(--font-display)',
  fontSize: '0.8rem',
  cursor: 'pointer',
};

const cardStyle: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--gold-dim)',
  borderRadius: 8,
  padding: '16px',
  transition: 'border-color 0.2s',
};

const tagExtinct: React.CSSProperties = {
  background: 'rgba(180, 40, 40, 0.3)',
  border: '1px solid rgba(180, 40, 40, 0.6)',
  color: '#e06060',
  fontSize: '0.55rem',
  padding: '2px 6px',
  borderRadius: 3,
  fontWeight: 600,
  letterSpacing: '0.05em',
};

const tagRare: React.CSSProperties = {
  background: 'rgba(200, 164, 74, 0.15)',
  border: '1px solid var(--gold-dim)',
  color: 'var(--gold)',
  fontSize: '0.55rem',
  padding: '2px 6px',
  borderRadius: 3,
  fontWeight: 600,
  letterSpacing: '0.05em',
};
