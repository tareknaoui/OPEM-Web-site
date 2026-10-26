import type { ComponentProps } from 'react';
import styles from './Button.module.css';

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary';
};

// Composant réutilisable : il accepte toutes les props natives d'un <button>.
// `type="button"` par défaut évite les envois de formulaire involontaires.
export function Button({ variant = 'primary', className, type = 'button', ...props }: ButtonProps) {
  const classes = [styles.button, styles[variant], className].filter(Boolean).join(' ');
  return <button type={type} className={classes} {...props} />;
}
