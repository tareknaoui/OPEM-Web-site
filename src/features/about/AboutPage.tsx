import { env } from '@/lib/env';

export default function AboutPage() {
  return (
    <div className="container page">
      <title>{`À propos · ${env.appName}`}</title>
      <h1>À propos</h1>
      <p>Une deuxième page, chargée uniquement quand on la visite.</p>
    </div>
  );
}
