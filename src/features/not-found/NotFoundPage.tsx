import { Link } from 'react-router';
import { env } from '@/lib/env';

export default function NotFoundPage() {
  return (
    <div className="container page">
      <title>{`Page introuvable · ${env.appName}`}</title>
      <h1>Page introuvable</h1>
      <p>Cette adresse n'existe pas.</p>
      <Link to="/">Retour à l'accueil</Link>
    </div>
  );
}
