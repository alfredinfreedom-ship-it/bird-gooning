import { Link } from 'react-router-dom';

const timeline = [
  { era: '~230 MYA', title: 'Theropod Dinosaurs', text: 'Bipedal predators emerge. Hollow bones and a bipedal stance — shared with T-Rex — become the skeletal blueprint birds inherit.' },
  { era: '~160 MYA', title: 'Proto-feathers Appear', text: 'Feathers first evolved for display or thermoregulation, not flight. Coelurosaurs sport filamentous structures across their bodies.' },
  { era: '~150 MYA', title: 'Archaeopteryx', text: 'The transitional icon. Reptilian teeth combined with asymmetric flight feathers. Found in Jurassic limestone of Bavaria.' },
  { era: '~125 MYA', title: 'Confuciusornis', text: 'First known beaked bird. The beak evolved to replace heavy teeth, aiding the lightweight ergonomic design that defines modern birds.' },
  { era: '~66 MYA', title: 'K-Pg Mass Extinction', text: 'Non-avian dinosaurs perish. Small, seed-eating birds survive. This bottleneck gives rise to the Neoaves radiation.' },
  { era: '~60 MYA', title: 'Neoaves Radiation', text: 'Explosive diversification produces raptors, songbirds, waterbirds, and parrots. Most modern bird families originate here.' },
  { era: 'Today', title: '~10,000 Living Species', text: 'Birds are the last living lineage of theropod dinosaurs, found on every continent. From 2-inch hummingbirds to 9-foot ostriches.' },
];

export default function EvolutionPage() {
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
          marginBottom: 8,
        }}>
          The Big Picture: Dinosaurs to Birds
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: 32 }}>
          Birds are the last living lineage of theropod dinosaurs. From the Jurassic period's
          Archaeopteryx to the diversification of Neoaves, birds evolved feathers for
          thermoregulation before flight, and a lightweight skeletal structure that persists
          in modern species today.
        </p>

        {/* Timeline */}
        <div style={{ position: 'relative', paddingLeft: 32 }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: 8, top: 0, bottom: 0, width: 2,
            background: 'linear-gradient(to bottom, var(--gold), var(--green-bright), var(--gold-dim))',
          }} />

          {timeline.map((t, i) => (
            <div key={i} style={{ position: 'relative', marginBottom: 28 }}>
              {/* Dot */}
              <div style={{
                position: 'absolute', left: -28, top: 4,
                width: 12, height: 12, borderRadius: '50%',
                background: 'var(--gold)',
                border: '2px solid var(--bg-primary)',
                boxShadow: '0 0 8px var(--gold-dim)',
              }} />
              <span style={{ color: 'var(--green-bright)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                {t.era}
              </span>
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: '1rem', margin: '4px 0 6px' }}>
                {t.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.6 }}>
                {t.text}
              </p>
            </div>
          ))}
        </div>

        {/* Key Highlights */}
        <div style={{
          marginTop: 24,
          background: 'var(--bg-card)',
          border: '1px solid var(--gold-dim)',
          borderRadius: 10,
          padding: '24px',
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: '1rem', marginBottom: 16 }}>
            Evolutionary Highlights
          </h2>
          {[
            { icon: '🦴', label: 'Theropods', desc: 'Birds share a bipedal stance and hollow bones with T-Rex.' },
            { icon: '🪶', label: 'Feathers', desc: 'Originally appeared for display or warmth, not flight.' },
            { icon: '🦜', label: 'The Beak', desc: 'Evolved to replace heavy teeth, aiding the lightweight ergonomic design of birds.' },
          ].map((h, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.3rem' }}>{h.icon}</span>
              <div>
                <strong style={{ color: 'var(--gold)', fontSize: '0.82rem' }}>{h.label}</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 2 }}>{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
