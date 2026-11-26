import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CircleAlert, LoaderCircle, Lock, Mail, User, UserPlus } from 'lucide-react';
import api from '../config/axios';
import AuthLayout from '../components/AuthLayout';
import Campo from '../components/Campo';
import { mensajeDeError } from '../lib/errores';
import '../styles/Register.css';

interface FormRegistro {
  nombre: string;
  email: string;
  password: string;
}

const MIN = 8; // el backend pide mínimo 8 caracteres

export default function Registro() {
  const navigate = useNavigate();
  const [errorServidor, setErrorServidor] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormRegistro>({ defaultValues: { nombre: '', email: '', password: '' } });

  const largo = watch('password')?.length ?? 0;
  const progreso = Math.min(100, (largo / MIN) * 100);

  const handleRegister = async (formData: FormRegistro) => {
    setErrorServidor('');
    try {
      await api.post('/auth/crear-cuenta', formData);
      navigate('/', { replace: true, state: { registrado: true } });
    } catch (error) {
      setErrorServidor(mensajeDeError(error, 'No se pudo crear la cuenta. Intenta de nuevo.'));
    }
  };

  return (
    <AuthLayout
      titulo="Crea tu cuenta"
      subtitulo="Con tu cuenta podrás ver lecturas, alertas y ajustar la alarma."
      pie={
        <p>
          ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
        </p>
      }
    >
      {errorServidor && (
        <p className="notice notice--danger" role="alert">
          <CircleAlert aria-hidden="true" />
          {errorServidor}
        </p>
      )}

      <form className="auth__form" onSubmit={handleSubmit(handleRegister)} noValidate>
        <Campo
          id="nombre"
          label="Nombre"
          icon={User}
          autoComplete="name"
          placeholder="Tu nombre"
          error={errors.nombre?.message}
          {...register('nombre', { required: 'Escribe tu nombre' })}
        />
        <Campo
          id="email"
          label="Correo"
          type="email"
          icon={Mail}
          autoComplete="email"
          inputMode="email"
          placeholder="tu@correo.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Escribe tu correo',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Ese correo no es válido' },
          })}
        />
        <Campo
          id="password"
          label="Contraseña"
          type="password"
          icon={Lock}
          autoComplete="new-password"
          error={errors.password?.message}
          hint={
            <div className={`pass-meter ${largo >= MIN ? 'is-ok' : ''}`}>
              <span className="pass-meter__bar" aria-hidden="true">
                <span style={{ transform: `scaleX(${progreso / 100})` }} />
              </span>
              <span className="pass-meter__text">
                {largo >= MIN ? 'Longitud correcta' : `Mínimo ${MIN} caracteres (${largo}/${MIN})`}
              </span>
            </div>
          }
          {...register('password', {
            required: 'Escribe una contraseña',
            minLength: { value: MIN, message: `Usa al menos ${MIN} caracteres` },
          })}
        />

        <button type="submit" className="btn btn--lg btn--block" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoaderCircle className="spin" aria-hidden="true" />
              Creando cuenta…
            </>
          ) : (
            <>
              <UserPlus aria-hidden="true" />
              Crear cuenta
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
