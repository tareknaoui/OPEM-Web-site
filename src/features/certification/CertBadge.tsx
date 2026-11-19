import type { Badge } from './content';
import styles from './CertificationPage.module.css';

const TONES = { night: '#11365b', blue: '#004d91', green: '#367624' } as const;

/** Une rangée de petits points sur le pourtour, comme un sceau. */
function Ring({ color }: { color: string }) {
  return (
    <>
      <circle cx="60" cy="60" r="57" fill={color} />
      <circle
        cx="60"
        cy="60"
        r="49"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.45"
        strokeWidth="1.5"
        strokeDasharray="1.5 4.5"
        strokeLinecap="round"
      />
    </>
  );
}

/**
 * Le badge d'un référentiel, dessiné pour le site (ce n'est pas le logo officiel, voir
 * content.ts) : un sceau rond aux couleurs d'OPEM. Seul le marquage CE reprend le symbole
 * réglementaire (deux lettres tracées sur des cercles). Décoratif : le nom du référentiel est
 * toujours écrit à côté, le badge est donc masqué aux lecteurs d'écran.
 */
export function CertBadge({ badge, className }: { badge: Badge; className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className ? `${styles.badge} ${className}` : styles.badge}
      aria-hidden="true"
      focusable="false"
    >
      {badge.kind === 'iso' && (
        <>
          <Ring color={TONES[badge.tone]} />
          <text x="60" y="49" className={styles.badgeSmall}>
            {badge.code.startsWith('170') ? 'ISO/IEC' : 'ISO'}
          </text>
          <text x="60" y="76" className={styles.badgeCode}>
            {badge.code}
          </text>
          <line x1="44" y1="86" x2="76" y2="86" stroke="#f2b230" strokeWidth="2.5" />
        </>
      )}

      {badge.kind === 'ce' && (
        <>
          <circle cx="60" cy="60" r="56" fill="#ffffff" stroke="#11365b" strokeWidth="2" />
          <g fill="none" stroke="#11365b" strokeWidth="7.5" transform="translate(4.5 0)">
            {/* C et E : deux arcs de même cercle, ouverts à droite ; la barre du E. */}
            <path d="M51.5 45.6 A17 17 0 1 0 51.5 74.4" />
            <path d="M85.5 45.6 A17 17 0 1 0 85.5 74.4" />
            <path d="M60 60 H83" />
          </g>
        </>
      )}

      {badge.kind === 'tedj' && (
        <>
          <Ring color={TONES.green} />
          {/* Une couronne (« tedj » : la couronne). */}
          <path
            d="M44 52 L50 38 L60 47 L70 38 L76 52 Z"
            fill="#f2b230"
            stroke="#f2b230"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <text x="60" y="75" className={styles.badgeWord}>
            TEDJ
          </text>
          <text x="60" y="94" className={styles.badgeArabic}>
            تاج
          </text>
        </>
      )}

      {badge.kind === 'halal' && (
        <>
          <Ring color={TONES.green} />
          <text x="60" y="66" className={styles.badgeArabicLarge}>
            حلال
          </text>
          <text x="60" y="88" className={styles.badgeSmall}>
            HALAL
          </text>
        </>
      )}

      {badge.kind === 'accueil' && (
        <>
          <Ring color={TONES.blue} />
          <text x="60" y="60" className={styles.badgeArabicMid}>
            في خدمتكم
          </text>
          <text x="60" y="80" className={styles.badgeTiny}>
            FI KHIDMATIKOUM
          </text>
        </>
      )}
    </svg>
  );
}
