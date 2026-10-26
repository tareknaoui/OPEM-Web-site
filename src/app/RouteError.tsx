import { isRouteErrorResponse, Link, useRouteError } from 'react-router';
import { env } from '@/lib/env';

// Affichée si une page plante. Le détail technique n'est montré qu'en
// développement, pour ne pas divulguer d'informations internes en production.
export function RouteError() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Une erreur inattendue est survenue.';

  if (env.isDev) console.error(error);

  return (
    <main className="container page" role="alert">
      <h1>Oups…</h1>
      <p>{message}</p>
      {env.isDev && error instanceof Error && <pre>{error.stack}</pre>}
      <Link to="/">Retour à l'accueil</Link>
    </main>
  );
}
