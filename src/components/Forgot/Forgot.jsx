import { useForm } from "react-hook-form";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "../../config/axiosConfig";
import Swal from "sweetalert2";
import { toast } from 'react-toastify';

const urlUserForgot = "users/changeorforgot"

export default function Forgot() {
    const navigate = useNavigate();
    const { uid } = useParams()

    const forgot = (e) => {
        if (e.password !== e.repassword) return toast.error('Los passwords no coinciden. Intenta de nuevo');
        axios.post(urlUserForgot, { uid: uid, password: e.password })
            .then(response => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Contraseña restaurada! Vuelve a loguearte con la nueva contraseña.",
                    showConfirmButton: false,
                    timer: 1500
                }).then(result => {
                    navigate("/");
                });
            })
            .catch(error => {
                if (error.response.data.code === 1) {
                    toast.error(error.response.data.message)
                    setTimeout(() => {
                        navigate("/passrestoration");
                    }, 2000)
                    return
                };
                if (error.response.data.code === 2) return toast.error(error.response.data.message)
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    const { register, handleSubmit } = useForm({ mode: "onBlur" });

    return (
        <div className="cuenta-registrarse">
            <h2 className="cuenta-title">Restaurar contraseña:</h2>
            <p className="info-text-register">Recuerda que tu contraseña debe tener 8 carácteres alfanuméricos SIN símbolos.</p>
            <form className="login-form" onSubmit={handleSubmit(forgot)}>
                <input type="text" id="id" name="id" value={uid} disabled {...register("id", { required: true })} />
                <input type="password" id="password" name="password" placeholder="Contraseña nueva *" maxLength="8" pattern="[A-Za-z0-9]{8,8}" {...register("password", { required: true })} />
                <input type="password" id="repassword" name="repassword" placeholder="Repite contraseña *" maxLength="8" pattern="[A-Za-z0-9]{8,8}" {...register("repassword", { required: true })} />
                <div className="forgot-buttons">
                    <button type="submit" className="cuenta-button" >Restaurar</button>
                    <Link to={"/"} className="cuenta-button">Volver</Link>
                </div>
            </form>
        </div>
    )
}
