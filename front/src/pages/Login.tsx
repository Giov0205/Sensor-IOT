import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../config/axios";
import { isAxiosError } from "axios";
import '../styles/Login.css';

export default function Login() {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const handleLogin = async (formData: any) => {
    try {
      const { data } = await api.post(`/auth/login`, formData);
      localStorage.setItem('TOKEN', data);
      console.log('Iniciando sesión...');

      setTimeout(() => {
        navigate('/home');
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        console.log(error.response.data.error);
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1>Iniciar Sesión</h1>

        <form onSubmit={handleSubmit(handleLogin)}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="email"
                id="email"
                {...register('email', {
                  required: 'El correo es obligatorio',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Correo inválido'
                  }
                })}
              />
            </div>
            {errors.email && <span>{errors.email.message}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type="password"
                id="password"
                {...register('password', {
                  required: 'La contraseña es obligatoria'
                })}
              />
            </div>
            {errors.password && <span>{errors.password.message}</span>}
          </div>

          <button type="submit">Entrar</button>
        </form>

        <div className="register-link">
          <p>¿No tienes cuenta? <a href="/registro">Regístrate ahora</a></p>
        </div>
      </div>
    </div>
  );
}
