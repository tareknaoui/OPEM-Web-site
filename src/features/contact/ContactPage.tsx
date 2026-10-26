import { env } from '@/lib/env';

export default function ContactPage() {
  return (
    <div className="container page">
      <title>{`Contact · ${env.appName}`}</title>
      <h1>Contact</h1>
      <p>Page à compléter : formulaire, adresse e-mail, réseaux sociaux…</p>
    </div>
  );
}
