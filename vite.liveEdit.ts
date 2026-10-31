import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { join, relative, resolve, sep } from 'node:path';
import type { Plugin } from 'vite';

/* ==========================================================================
   Édition en direct depuis la page (développement seulement, npm run dev ;
   apply: 'serve' : rien de tout cela n'existe en production).
   - POST /__live-text  { from, to, all? } : remplace la chaîne exacte '…' dans les
     fichiers .ts de src (contenus, menus, libellés).
   - POST /__live-style { file, className, props } : écrit des propriétés dans la
     règle .className du fichier .module.css (règle de base, hors media queries).
   Vite recharge ensuite la page à chaud. Seule la page du serveur de dev peut appeler
   ces adresses (en-tête Origin vérifié).
   ========================================================================== */

const SRC = resolve('src');
const MAX_LENGTH = 5000;

// Propriétés réglables depuis la page, et valeurs acceptées.
const PX = /^-?\d{1,4}(\.\d{1,2})?px$/;
const STYLE_PROPS: Record<string, RegExp> = {
  'font-size': /^\d{1,3}(\.\d{1,2})?px$/,
  'margin-top': PX,
  'margin-bottom': PX,
  position: /^relative$/,
  top: PX,
  left: PX,
  'text-align': /^(start|center|end)$/,
};

/** Chaîne TypeScript entre apostrophes, comme dans les fichiers de contenu. */
const literal = (text: string) => `'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

/** Apostrophe droite tapée au clavier → apostrophe typographique, comme le reste du site. */
const typographic = (text: string) => text.trim().replace(/'/g, '’');

/** Fichiers .ts de src, sans les tests ni les déclarations. */
function textFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return textFiles(path);
    return /(?<!\.test|\.d)\.ts$/.test(entry.name) ? [path] : [];
  });
}

/** Écrit les propriétés dans la règle de base `.className { … }` (créée si absente). */
function writeRule(css: string, className: string, props: Record<string, string | null>) {
  const head = new RegExp(`^\\.${className} \\{$`, 'm').exec(css);
  if (!head) {
    const lines = Object.entries(props)
      .filter(([, value]) => value !== null)
      .map(([prop, value]) => `  ${prop}: ${value};`);
    return lines.length ? `${css.trimEnd()}\n\n.${className} {\n${lines.join('\n')}\n}\n` : css;
  }
  const start = head.index + head[0].length;
  const end = css.indexOf('\n}', start);
  let block = css.slice(start, end);
  for (const [prop, value] of Object.entries(props)) {
    // Ancienne valeur retirée, nouvelle ajoutée en fin de règle (après un éventuel raccourci
    // comme « margin », qu'elle doit pouvoir préciser).
    block = block.replace(new RegExp(`\\n  ${prop}: [^;\\n]*;`, 'g'), '');
    if (value !== null) block += `\n  ${prop}: ${value};`;
  }
  return css.slice(0, start) + block + css.slice(end);
}

function readBody(req: IncomingMessage) {
  return new Promise<unknown>((done, fail) => {
    let raw = '';
    req.on('data', (chunk: Buffer) => {
      raw += chunk.toString('utf8');
      if (raw.length > 50_000) req.destroy();
    });
    req.on('end', () => {
      try {
        done(JSON.parse(raw));
      } catch (error) {
        fail(error);
      }
    });
  });
}

type Handler = (body: Record<string, unknown>) => [number, object];

function endpoint(handler: Handler) {
  return (req: IncomingMessage, res: ServerResponse) => {
    const reply = ([status, body]: [number, object]) => {
      res.statusCode = status;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(body));
    };
    if (req.method !== 'POST') return reply([405, { error: 'method' }]);
    const origin = req.headers.origin;
    if (origin && new URL(origin).host !== req.headers.host) {
      return reply([403, { error: 'origin' }]);
    }
    readBody(req).then(
      (body) =>
        reply(
          body && typeof body === 'object'
            ? handler(body as Record<string, unknown>)
            : [400, { error: 'json' }],
        ),
      () => reply([400, { error: 'json' }]),
    );
  };
}

const editText: Handler = ({ from, to, all }) => {
  if (
    typeof from !== 'string' ||
    typeof to !== 'string' ||
    !from.trim() ||
    !to.trim() ||
    from.length > MAX_LENGTH ||
    to.length > MAX_LENGTH
  ) {
    return [400, { error: 'text' }];
  }
  const needle = literal(from);
  const replacement = literal(typographic(to));
  const hits = textFiles(SRC)
    .map((file) => {
      const source = readFileSync(file, 'utf8');
      return { file, source, count: source.split(needle).length - 1 };
    })
    .filter((hit) => hit.count > 0);
  const count = hits.reduce((sum, hit) => sum + hit.count, 0);
  if (count === 0) return [404, { error: 'not-found' }];
  if (count > 1 && all !== true) return [409, { error: 'several', count }];
  for (const hit of hits) {
    writeFileSync(hit.file, hit.source.split(needle).join(replacement), 'utf8');
  }
  return [200, { count, files: hits.map((hit) => relative('.', hit.file).replace(/\\/g, '/')) }];
};

const editStyle: Handler = ({ file, className, props }) => {
  if (typeof file !== 'string' || typeof className !== 'string') return [400, { error: 'args' }];
  // Le chemin vient de la page (data-vite-dev-id) : seulement un .module.css de src.
  const path = resolve(file.replace(/^\/@fs\//, ''));
  if (!path.startsWith(SRC + sep) || !path.endsWith('.module.css')) {
    return [403, { error: 'file' }];
  }
  if (!/^[A-Za-z][\w-]*$/.test(className)) return [400, { error: 'class' }];
  if (!props || typeof props !== 'object') return [400, { error: 'props' }];
  const entries = Object.entries(props as Record<string, unknown>);
  for (const [prop, value] of entries) {
    const rule = STYLE_PROPS[prop];
    if (!rule || (value !== null && (typeof value !== 'string' || !rule.test(value)))) {
      return [400, { error: 'value', prop }];
    }
  }
  const css = readFileSync(path, 'utf8');
  writeFileSync(path, writeRule(css, className, Object.fromEntries(entries) as never), 'utf8');
  return [200, { file: relative('.', path).replace(/\\/g, '/') }];
};

export function liveEdit(): Plugin {
  return {
    name: 'opem-live-edit',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__live-text', endpoint(editText));
      server.middlewares.use('/__live-style', endpoint(editStyle));
    },
  };
}
