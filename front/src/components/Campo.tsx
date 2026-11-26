import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { CircleAlert, Eye, EyeOff, type LucideIcon } from 'lucide-react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon: LucideIcon;
  error?: string;
  hint?: ReactNode;
}

/** Campo de formulario con icono, error visible y botón para ver la contraseña. */
const Campo = forwardRef<HTMLInputElement, Props>(function Campo(
  { id, label, icon: Icon, error, hint, type = 'text', ...rest },
  ref
) {
  const [visible, setVisible] = useState(false);
  const esPassword = type === 'password';
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="field__control">
        <Icon className="field__icon" aria-hidden="true" />
        <input
          ref={ref}
          id={id}
          type={esPassword && visible ? 'text' : type}
          className={`input ${esPassword ? 'input--trailing' : ''}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={[error ? errorId : '', hint ? hintId : ''].filter(Boolean).join(' ') || undefined}
          {...rest}
        />
        {esPassword && (
          <button
            type="button"
            className="field__trailing"
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={visible}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </button>
        )}
      </div>
      {hint && <div id={hintId}>{hint}</div>}
      {error && (
        <p className="field__error" id={errorId}>
          <CircleAlert aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
});

export default Campo;
