import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Bird {
  id: string;
  common_name: string;
  genus: string;
  species: string;
  family: string;
  evolutionary_history: string;
  habitat_description: string;
  is_rare: boolean;
  is_extinct: boolean;
}

export default function BirdDetailPage() {
  const { id } = useParams();
  const [bird, setBird] = useState<Bird | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase.from('birds_reference').select('*').eq('id', id).single();
      if (data) setBird(data);
    })();
  }, [id]);

  if (!bird) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '24px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <Link to="/" style={{ color: 'var(--gold)', fontSize: '0.8rem', fontFamily: 'var(--font-display)' }}>
          ← Back to Species Index
        </Link>

        <div style={{
          marginTop: 20,
          background: 'var(--bg-card)',
          border: '1px solid var(--gold-dim)',
          borderRadius: 10,
          padding: '28px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: '1.5rem' }}>
              {bird.common_name}
            </h1>
            <div style={{ display: 'flex', gap: 6 }}>
              {bird.is_extinct && <span style={tag('#b42828')}>EXTINCT</span>}
              {bird.is_rare && <span style={tag('var(--gold)')}>RARE</span>}
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: 20 }}>
            {bird.genus} {bird.species} — Family {bird.family}
          </p>

          <Section title="Habitat">
            {bird.habitat_description}
          </Section>

          <Section title="Evolutionary History">
            {bird.evolutionary_history}
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        color: 'var(--gold)',
        fontSize: '0.85rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: 8,
        borderBottom: '1px solid var(--gold-dim)',
        paddingBottom: 6,
      }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text)', fontSize: '0.85rem', lineHeight: 1.7 }}>
        {children}
      </p>
    </div>
  );
}

function tag(color: string): React.CSSProperties {
  return {
    background: `${color}22`,
    border: `1px solid ${color}88`,
    color,
    fontSize: '0.6rem',
    padding: '2px 8px',
    borderRadius: 3,
    fontWeight: 600,
    letterSpacing: '0.06em',
  };
}
