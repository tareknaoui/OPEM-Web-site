import { useEffect, useEffectEvent, useRef, useState } from 'react';
import styles from './LiveEditor.module.css';

/* ==========================================================================
   Éditeur en direct (développement seulement : chargé par RootLayout quand
   import.meta.env.DEV ; enregistré par le serveur de dev, voir vite.liveEdit.ts).
   - « Modifier la page » active le mode ; liens et boutons ne réagissent plus.
   - Clic : sélectionne un bloc (cadre plein). Le panneau règle sa taille de texte, ses
     espaces au-dessus et en dessous, sa position (glisser l'élément, ou flèches du clavier,
     Maj = 10 px) et son alignement. Aperçu immédiat sur tous les éléments du même style ;
     « Enregistrer » l'écrit dans le fichier .module.css, « Annuler » (ou Échap) revient.
   - Double-clic sur un texte : on l'écrit dans la page ; Entrée enregistre dans le fichier
     de contenu, Échap annule.
   Retrouver le fichier : en développement, Vite nomme les classes _nom_empreinte_ligne et
   injecte chaque feuille dans une balise <style data-vite-dev-id="chemin">.
   ========================================================================== */

type Message = { tone: 'ok' | 'error'; text: string };
type Align = 'start' | 'center' | 'end';
type Values = {
  fontSize: number;
  marginTop: number;
  marginBottom: number;
  x: number;
  y: number;
  align: Align;
};
type Selection = {
  element: HTMLElement;
  /** Classe générée (_kicker_1bfa7_89), nom dans le fichier (kicker), chemin du fichier. */
  className: string;
  local: string;
  file: string;
  /** Position modifiable seulement pour un élément non positionné (ou déjà relatif). */
  movable: boolean;
  count: number;
  initial: Values;
};

const MODULE_CLASS = /^_([A-Za-z][\w-]*)_[0-9a-z]{5}_\d+$/;
const PREVIEW_PROPS = [
  'font-size',
  'margin-top',
  'margin-bottom',
  'position',
  'top',
  'left',
  'text-align',
];
const ALIGN_LABELS: Record<Align, string> = { start: 'Début', center: 'Centre', end: 'Fin' };

const round = (value: number) => Math.round(value * 10) / 10;
const wait = (ms: number) => new Promise((done) => window.setTimeout(done, ms));
// L'éditeur lui-même et les autres outils de développement (comparateur de maquettes).
const isEditorUi = (target: EventTarget | null) =>
  target instanceof Element && !!target.closest('[data-live-editor], [data-dev-tool]');

/** Classe de module CSS de l'élément et fichier qui la définit. */
function sourceOf(element: HTMLElement) {
  const sheets = Array.from(document.querySelectorAll<HTMLStyleElement>('style[data-vite-dev-id]'));
  for (const className of Array.from(element.classList)) {
    const match = MODULE_CLASS.exec(className);
    if (!match) continue;
    const sheet = sheets.find((style) => style.textContent?.includes(`.${className}`));
    if (sheet?.dataset.viteDevId) {
      return { className, local: match[1]!, file: sheet.dataset.viteDevId };
    }
  }
  return null;
}

/** Bloc sélectionnable : l'élément cliqué ou le plus proche parent qui a son propre style. */
function selectableFrom(target: EventTarget | null) {
  let element = target instanceof HTMLElement ? target : null;
  while (element && element !== document.body) {
    if (sourceOf(element)) return element;
    element = element.parentElement;
  }
  return null;
}

/** Élément qui ne contient que du texte : il correspond à une chaîne des fichiers de contenu. */
function textFrom(target: EventTarget | null) {
  let element = target instanceof HTMLElement ? target : null;
  while (element && element !== document.body) {
    const onlyText = Array.from(element.childNodes).every(
      (node) => node.nodeType === Node.TEXT_NODE,
    );
    if (onlyText && element.textContent?.trim()) return element;
    if (element.children.length > 0) return null;
    element = element.parentElement;
  }
  return null;
}

function readValues(element: HTMLElement): Values {
  const style = getComputedStyle(element);
  const relative = style.position === 'relative';
  const rtl = style.direction === 'rtl';
  const align = style.textAlign;
  return {
    fontSize: round(parseFloat(style.fontSize) || 16),
    marginTop: round(parseFloat(style.marginTop) || 0),
    marginBottom: round(parseFloat(style.marginBottom) || 0),
    x: relative ? round(parseFloat(style.left) || 0) : 0,
    y: relative ? round(parseFloat(style.top) || 0) : 0,
    align:
      align === 'center'
        ? 'center'
        : align === 'end' || align === (rtl ? 'left' : 'right')
          ? 'end'
          : 'start',
  };
}

/** Propriétés CSS qui diffèrent de l'état de départ. */
function changes(selection: Selection, values: Values) {
  const { initial } = selection;
  const props: Record<string, string> = {};
  if (values.fontSize !== initial.fontSize) props['font-size'] = `${values.fontSize}px`;
  if (values.marginTop !== initial.marginTop) props['margin-top'] = `${values.marginTop}px`;
  if (values.marginBottom !== initial.marginBottom) {
    props['margin-bottom'] = `${values.marginBottom}px`;
  }
  if (selection.movable && (values.x !== initial.x || values.y !== initial.y)) {
    props.position = 'relative';
    props.left = `${values.x}px`;
    props.top = `${values.y}px`;
  }
  if (values.align !== initial.align) props['text-align'] = values.align;
  return props;
}

function clearPreview(selection: Selection) {
  document.querySelectorAll<HTMLElement>(`.${selection.className}`).forEach((element) => {
    PREVIEW_PROPS.forEach((prop) => element.style.removeProperty(prop));
  });
}

function preview(selection: Selection, props: Record<string, string>) {
  clearPreview(selection);
  document.querySelectorAll<HTMLElement>(`.${selection.className}`).forEach((element) => {
    Object.entries(props).forEach(([prop, value]) => element.style.setProperty(prop, value));
  });
}

async function post(url: string, body: object) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: response.status, body: (await response.json()) as Record<string, unknown> };
}

type FieldProps = {
  label: string;
  value: number;
  step?: number;
  min?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
};

function Field({ label, value, step = 1, min, disabled, onChange }: FieldProps) {
  const set = (next: number) => onChange(round(min === undefined ? next : Math.max(min, next)));
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <span className={styles.stepper}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => set(value - step)}
          aria-label={`${label} : moins`}
        >
          −
        </button>
        <input
          type="number"
          value={value}
          step={step}
          disabled={disabled}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (Number.isFinite(next)) set(next);
          }}
        />
        <span className={styles.unit}>px</span>
        <button
          type="button"
          disabled={disabled}
          onClick={() => set(value + step)}
          aria-label={`${label} : plus`}
        >
          +
        </button>
      </span>
    </label>
  );
}

export default function LiveEditor() {
  const [active, setActive] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [values, setValues] = useState<Values | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [saving, setSaving] = useState(false);
  const hovered = useRef<HTMLElement | null>(null);
  const editingText = useRef(false);
  const drag = useRef<{ x: number; y: number; base: Values; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  const pending = selection && values ? changes(selection, values) : {};
  const dirty = Object.keys(pending).length > 0;

  // Message qui s'efface tout seul.
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), 6000);
    return () => window.clearTimeout(timer);
  }, [message]);

  // Aperçu immédiat sur tous les éléments du même style ; cadre sur le bloc choisi.
  useEffect(() => {
    if (!selection || !values) return;
    preview(selection, changes(selection, values));
    selection.element.setAttribute('data-live-selected', '');
    return () => selection.element.removeAttribute('data-live-selected');
  }, [selection, values]);

  const select = (element: HTMLElement) => {
    const source = sourceOf(element);
    if (!source) return;
    if (selection) clearPreview(selection);
    const style = getComputedStyle(element);
    const initial = readValues(element);
    setSelection({
      element,
      ...source,
      movable: style.position === 'static' || style.position === 'relative',
      count: document.querySelectorAll(`.${source.className}`).length,
      initial,
    });
    setValues(initial);
  };

  const cancel = () => {
    if (selection) clearPreview(selection);
    setSelection(null);
    setValues(null);
  };

  const save = async () => {
    if (!selection || !values || !dirty) return;
    setSaving(true);
    try {
      const result = await post('/__live-style', {
        file: selection.file,
        className: selection.local,
        props: pending,
      });
      if (result.status !== 200) throw new Error(String(result.body.error));
      // Le temps que Vite recharge la feuille (les classes peuvent changer de nom).
      await wait(900);
      clearPreview(selection);
      const source = sourceOf(selection.element);
      const now = readValues(selection.element);
      const overridden = (Object.keys(values) as (keyof Values)[]).some(
        (key) => values[key] !== selection.initial[key] && values[key] !== now[key],
      );
      if (source) {
        setSelection({ ...selection, ...source, initial: now });
        setValues(now);
      } else {
        setSelection(null);
        setValues(null);
      }
      setMessage(
        overridden
          ? {
              tone: 'error',
              text: `Enregistré dans ${String(result.body.file)}, mais une règle propre à cet écran (mobile, arabe…) l’emporte ici : à modifier dans le fichier.`,
            }
          : { tone: 'ok', text: `Enregistré dans ${String(result.body.file)}` },
      );
    } catch {
      setMessage({ tone: 'error', text: 'Enregistrement impossible.' });
    } finally {
      setSaving(false);
    }
  };

  const editText = (element: HTMLElement) => {
    const original = element.textContent ?? '';
    editingText.current = true;
    element.contentEditable = 'plaintext-only';
    element.focus();
    window.getSelection()?.selectAllChildren(element);

    const finish = async (commit: boolean) => {
      element.removeEventListener('keydown', onKey);
      element.removeEventListener('blur', onBlur);
      element.removeAttribute('contenteditable');
      editingText.current = false;
      const next = (element.textContent ?? '').replace(/\s*\n\s*/g, ' ').trim();
      if (!commit || !next || next === original.trim()) {
        element.textContent = original;
        return;
      }
      try {
        let result = await post('/__live-text', { from: original, to: next });
        if (result.status === 409) {
          const count = Number(result.body.count);
          if (
            !window.confirm(`Ce texte apparaît ${count} fois sur le site. Le remplacer partout ?`)
          ) {
            element.textContent = original;
            return;
          }
          result = await post('/__live-text', { from: original, to: next, all: true });
        }
        if (result.status === 200) {
          setMessage({
            tone: 'ok',
            text: `Texte enregistré dans ${(result.body.files as string[]).join(', ')}`,
          });
          return;
        }
        element.textContent = original;
        setMessage({
          tone: 'error',
          text:
            result.status === 404
              ? 'Texte introuvable tel quel : il est calculé ou composé de plusieurs morceaux. À modifier dans le fichier.'
              : 'Enregistrement impossible.',
        });
      } catch {
        element.textContent = original;
        setMessage({ tone: 'error', text: 'Serveur de développement injoignable.' });
      }
    };
    const onKey = (event: KeyboardEvent) => {
      event.stopPropagation();
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        element.blur();
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        void finish(false);
      }
    };
    const onBlur = () => void finish(true);
    element.addEventListener('keydown', onKey);
    element.addEventListener('blur', onBlur);
  };

  // ---------- Gestionnaires globaux (lisent toujours l'état à jour) ----------

  const onOver = useEffectEvent((event: MouseEvent) => {
    if (isEditorUi(event.target) || editingText.current || drag.current) return;
    hovered.current?.removeAttribute('data-live-target');
    hovered.current = selectableFrom(event.target);
    hovered.current?.setAttribute('data-live-target', '');
  });

  const onClick = useEffectEvent((event: MouseEvent) => {
    if (isEditorUi(event.target) || (event.target as HTMLElement).isContentEditable) return;
    event.preventDefault();
    event.stopPropagation();
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    const element = selectableFrom(event.target);
    if (element && element !== selection?.element) select(element);
  });

  const onDoubleClick = useEffectEvent((event: MouseEvent) => {
    if (isEditorUi(event.target)) return;
    event.preventDefault();
    const element = textFrom(event.target);
    if (element) editText(element);
    else
      setMessage({
        tone: 'error',
        text: 'Ce bloc mélange plusieurs éléments : double-cliquez directement sur un texte.',
      });
  });

  const onPointerDown = useEffectEvent((event: PointerEvent) => {
    if (!selection?.movable || !values || event.button !== 0 || editingText.current) return;
    if (!selection.element.contains(event.target as Node)) return;
    drag.current = { x: event.clientX, y: event.clientY, base: values, moved: false };
  });

  const onPointerMove = useEffectEvent((event: PointerEvent) => {
    const current = drag.current;
    if (!current) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    if (!current.moved && Math.hypot(dx, dy) < 4) return;
    current.moved = true;
    document.documentElement.dataset.liveDragging = '';
    setValues({
      ...current.base,
      x: Math.round(current.base.x + dx),
      y: Math.round(current.base.y + dy),
    });
  });

  const onPointerUp = useEffectEvent(() => {
    if (drag.current?.moved) suppressClick.current = true;
    drag.current = null;
    delete document.documentElement.dataset.liveDragging;
  });

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (editingText.current || !selection || !values) return;
    if (event.target instanceof HTMLInputElement) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      cancel();
      return;
    }
    const step = event.shiftKey ? 10 : 1;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const move = moves[event.key];
    if (!move || !selection.movable) return;
    event.preventDefault();
    setValues({ ...values, x: values.x + move[0], y: values.y + move[1] });
  });

  const onDragStart = useEffectEvent((event: DragEvent) => {
    if (!isEditorUi(event.target)) event.preventDefault();
  });

  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    root.dataset.liveEdit = '';
    const listeners: [string, EventListener][] = [
      ['mouseover', onOver as EventListener],
      ['click', onClick as EventListener],
      ['dblclick', onDoubleClick as EventListener],
      ['pointerdown', onPointerDown as EventListener],
      ['pointermove', onPointerMove as EventListener],
      ['pointerup', onPointerUp as EventListener],
      ['keydown', onKeyDown as EventListener],
      ['dragstart', onDragStart as EventListener],
    ];
    listeners.forEach(([type, listener]) => document.addEventListener(type, listener, true));
    return () => {
      delete root.dataset.liveEdit;
      hovered.current?.removeAttribute('data-live-target');
      listeners.forEach(([type, listener]) => document.removeEventListener(type, listener, true));
    };
  }, [active]);

  const toggle = () => {
    if (active) cancel();
    setActive(!active);
  };

  const fileName = selection?.file.split('/').pop();

  return (
    <div className={styles.editor} data-live-editor>
      {selection && values && (
        <section className={styles.panel} aria-label="Réglages du bloc sélectionné">
          <header className={styles.panelHead}>
            <div>
              <p className={styles.name}>.{selection.local}</p>
              <p className={styles.file}>
                {fileName}
                {selection.count > 1 && ` · ${selection.count} éléments`}
              </p>
            </div>
            <button type="button" className={styles.close} onClick={cancel} aria-label="Fermer">
              ×
            </button>
          </header>

          <Field
            label="Taille du texte"
            value={values.fontSize}
            min={1}
            onChange={(fontSize) => setValues({ ...values, fontSize })}
          />
          <Field
            label="Espace au-dessus"
            value={values.marginTop}
            onChange={(marginTop) => setValues({ ...values, marginTop })}
          />
          <Field
            label="Espace en dessous"
            value={values.marginBottom}
            onChange={(marginBottom) => setValues({ ...values, marginBottom })}
          />
          <Field
            label="Décalage horizontal"
            value={values.x}
            disabled={!selection.movable}
            onChange={(x) => setValues({ ...values, x })}
          />
          <Field
            label="Décalage vertical"
            value={values.y}
            disabled={!selection.movable}
            onChange={(y) => setValues({ ...values, y })}
          />
          <p className={styles.hint}>
            {selection.movable
              ? 'Glissez le bloc, ou flèches du clavier (Maj : 10 px).'
              : 'Bloc positionné par la mise en page : décalage désactivé.'}
          </p>

          <div className={styles.field}>
            <span className={styles.label}>Alignement</span>
            <span className={styles.segmented}>
              {(Object.keys(ALIGN_LABELS) as Align[]).map((align) => (
                <button
                  key={align}
                  type="button"
                  aria-pressed={values.align === align}
                  onClick={() => setValues({ ...values, align })}
                >
                  {ALIGN_LABELS[align]}
                </button>
              ))}
            </span>
          </div>

          <footer className={styles.actions}>
            <button
              type="button"
              className={styles.secondary}
              disabled={!dirty || saving}
              onClick={() => setValues(selection.initial)}
            >
              Annuler
            </button>
            <button
              type="button"
              className={styles.primary}
              disabled={!dirty || saving}
              onClick={() => void save()}
            >
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </footer>
        </section>
      )}

      {message && (
        <p className={styles.message} data-tone={message.tone} role="status">
          {message.text}
        </p>
      )}
      {active && !selection && (
        <p className={styles.hint}>
          Clic : choisir un bloc · Double-clic : écrire le texte · Échap : annuler
        </p>
      )}
      <button type="button" className={styles.toggle} aria-pressed={active} onClick={toggle}>
        {active ? 'Terminer' : 'Modifier la page'}
      </button>
    </div>
  );
}
