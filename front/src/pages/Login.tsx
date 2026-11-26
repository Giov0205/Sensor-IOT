import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CircleAlert, CircleCheck, LoaderCircle, Lock, LogIn, Mail } from 'lucide-react';
import api from '../config/axios';
import AuthLayout from '../components/AuthLayout';
import Campo from '../components/Campo';
import { guardarToken } from '../lib/sesion';
import { mensajeDeError } from '../lib/errores';

interface FormLogin {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const recienRegistrado = Boolean((location.state as { registrado?: boolean } | null)?.registrado);
  const [errorServidor, setErrorServidor] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormLogin>({ defaultValues: { email: '', password: '' } });

  const handleLogin = async (formData: FormLogin) => {
    setErrorServidor('');
    try {
      const { data } = await api.post('/auth/login', formData);
      guardarToken(typeof data === 'string' ? data : String(data?.token ?? data));
      navigate('/home', { replace: true });
    } catch (error) {
      setErrorServidor(mensajeDeError(error, 'No se pudo iniciar sesión. Intenta de nuevo.'));
    }
  };

  return (
    <AuthLayout
      titulo="Inicia sesión"
      subtitulo="Entra para ver la calidad del aire en tiempo real."
      pie={
        <p>
          ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
        </p>
      }
    >
      {recienRegistrado && !errorServidor && (
        <p className="notice notice--success" role="status">
          <CircleCheck aria-hidden="true" />
          Cuenta creada. Ahora inicia sesión con tu correo.
        </p>
      )}
      {errorServidor && (
        <p className="notice notice--danger" role="alert">
          <CircleAlert aria-hidden="true" />
          {errorServidor}
        </p>
      )}

      <form className="auth__form" onSubmit={handleSubmit(handleLogin)} noValidate>
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
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password', { required: 'Escribe tu contraseña' })}
        />

        <button type="submit" className="btn btn--lg btn--block" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoaderCircle className="spin" aria-hidden="true" />
              Entrando…
            </>
          ) : (
            <>
              <LogIn aria-hidden="true" />
              Entrar
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
