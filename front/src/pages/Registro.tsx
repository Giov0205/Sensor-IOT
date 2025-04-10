import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../config/axios";
import { isAxiosError } from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'; // Iconos de nombre, email y contraseña
import '../styles/Register.css'; 

export default function Registro() {

    const navigate = useNavigate();

    const initialValues = {
        nombre: '',
        email: '',
        password: ''
    }

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues });

    const handleRegister = async (formData: any) => {
        try {
            const { data } = await api.post(`/auth/crear-cuenta`, formData);
            console.log(data);
            setTimeout(() => {
                // Redirigir al login (ruta "/") después de registrarse
                navigate('/');
            }, 1000);
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                console.log(error.response.data.error);
            }
        }
    }

    return (
        <div className="login-container">
            <h1>Registro</h1>
            <form onSubmit={handleSubmit(handleRegister)}>
                <div className="input-group">
                    <label htmlFor="nombre">Nombre</label>
                    <div className="input-with-icon">
                        <FontAwesomeIcon icon={faUser} className="input-icon" />
                        <input
                            type="text"
                            id="nombre"
                            {...register('nombre', {
                                required: 'El nombre es requerido'
                            })}
                        />
                    </div>
                    {errors.nombre && <span>{errors.nombre.message}</span>}
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <div className="input-with-icon">
                        <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                        <input
                            type="email"
                            id="email"
                            {...register('email', {
                                required: 'El email es requerido',
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: 'Email inválido'
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
                                required: 'La contraseña es requerida',
                            })}
                        />
                    </div>
                    {errors.password && <span>{errors.password.message}</span>}
                </div>
                <div>
                    <button type="submit">Registrarse</button>
                </div>
            </form>

            <div className="login-link">
                <p>¿Ya tienes cuenta? <a href="/">Inicia sesión</a></p>
            </div>
        </div>
    )
}
