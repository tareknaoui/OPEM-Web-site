/** Place le curseur sur le premier champ en erreur, dans l'ordre de la page. */
export function focusFirstError(form: HTMLFormElement | null, names: string[]) {
  if (!form) return;
  const fields = Array.from(form.querySelectorAll<HTMLElement>('[data-field]'));
  const first = fields.find((field) => names.includes(field.dataset.field ?? ''));
  first?.focus();
  first?.scrollIntoView({ block: 'center', behavior: 'smooth' });
}
