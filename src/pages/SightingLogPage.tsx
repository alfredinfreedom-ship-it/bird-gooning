import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Sighting {
  id: string;
  sighting_date: string;
  location_name: string;
  user_notes: string;
  birds_reference: { common_name: string } | null;
}

export default function SightingLogPage() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('sighting_logs')
        .select('id, sighting_date, location_name, user_notes, birds_reference(common_name)')
        .order('sighting_date', { ascending: false });
      if (data) setSightings(data as any);
      setLoading(false);
    })();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '24px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <Link to="/" style={{ color: 'var(--gold)', fontSize: '0.8rem', fontFamily: 'var(--font-display)' }}>
          ← Back to Species Index
        </Link>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--gold)',
          fontSize: '1.5rem',
          marginTop: 24,
          marginBottom: 24,
        }}>
          My Sighting Log
        </h1>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading sightings...</p>
        ) : sightings.length === 0 ? (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--gold-dim)',
            borderRadius: 10,
            padding: '32px',
            textAlign: 'center',
          }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 8 }}>
              No sightings recorded yet.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              Sign in and log your first bird sighting to see it here.
            </p>
          </div>
        ) : sightings.map(s => (
          <div key={s.id} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--gold-dim)',
            borderRadius: 8,
            padding: '16px',
            marginBottom: 12,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <strong style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '0.9rem' }}>
                {s.birds_reference?.common_name || 'Unknown Species'}
              </strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                {new Date(s.sighting_date).toLocaleDateString()}
              </span>
            </div>
            {s.location_name && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                📍 {s.location_name}
              </p>
            )}
            {s.user_notes && (
              <p style={{ color: 'var(--text)', fontSize: '0.8rem', marginTop: 6, lineHeight: 1.5 }}>
                {s.user_notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
