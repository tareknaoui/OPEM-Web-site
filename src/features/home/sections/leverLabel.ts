/**
 * Nom d'un levier sur deux lignes, coupé à l'espace la plus proche du milieu (« Style de » /
 * « management »). Un nom d'un seul mot reste sur une ligne. Utilisé par les graphiques des
 * leviers (radar et carte), où la place est comptée.
 */
export function labelLines(label: string): string[] {
  const middle = label.length / 2;
  let cut = -1;
  for (let index = label.indexOf(' '); index !== -1; index = label.indexOf(' ', index + 1)) {
    if (cut === -1 || Math.abs(index - middle) < Math.abs(cut - middle)) cut = index;
  }
  return cut === -1 ? [label] : [label.slice(0, cut), label.slice(cut + 1)];
}
