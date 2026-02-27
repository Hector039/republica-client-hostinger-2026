import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useUser } from "../context/dataContext";
import axios from "../../config/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const urlUser = "users/";
const urlUpdateUser = "users/updateuser";
const urlPassChanger = "users/changeorforgot";

export default function UpdateUser() {
	const navigate = useNavigate();
	const { user, setUser } = useUser();

	const { register, handleSubmit, setValue } = useForm({
		mode: "onBlur",
	});

	const { register: register2, handleSubmit: handleSubmit2 } = useForm({
		mode: "onBlur",
	});

	useEffect(() => {
		setValue("first_name", user.first_name);
		setValue("last_name", user.last_name);
		setValue("email", user.email);
		setValue("birth_date", user.birth_date);
		setValue("dni", user.dni);
		setValue("tel_contact", user.tel_contact);
	}, []);

	function fetchUpdatedUser() {
		axios
			.get(urlUser)
			.then((response) => {
				setUser(response.data);
			})
			.catch((error) => {
				if (error.response.data.message)
					return toast.error(error.response.data.message);
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				console.log(error);
			});
	}

	const updateUser = (e) => {
		axios
			.put(urlUpdateUser, {
				first_name: e.first_name,
				last_name: e.last_name,
				email: e.email,
				birth_date: e.birth_date,
				dni: e.dni,
				tel_contact: e.tel_contact,
			})
			.then((response) => {
				fetchUpdatedUser();
				Swal.fire({
					icon: "success",
					title: response.data,
					showConfirmButton: true,
				}).then((result) => {
					if (result.isConfirmed) {
						navigate(`/`);
					}
				});
			})
			.catch((error) => {
				if (error.response.data.message)
					return toast.error(error.response.data.message);
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				console.log(error);
			});
	};

	const updateUserPassword = (e) => {
		if (e.password !== e.repassword)
			return toast.error("Los passwords no coinciden. Intenta de nuevo");
		axios
			.post(urlPassChanger, { uid: user.id_user, password: e.password })
			.then((response) => {
				Swal.fire({
					icon: "success",
					title: response.data,
					showConfirmButton: true,
				}).then((result) => {
					if (result.isConfirmed) {
						navigate(`/`);
					}
				});
			})
			.catch((error) => {
				if (error.status === 400) return toast.error(error.response.data.message);
				toast.error(error.response.data.message);
			});
	};

	return (
		<div className="update_user_container">
			<form onSubmit={handleSubmit(updateUser)} className="checkout-form">
				<input type="number" name="dni" {...register("dni", { required: true })} />
				<input
					type="text"
					name="first_name"
					maxLength="30"
					pattern="^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{3,30}$"
					title="No uses símbolos ni números. Min 3, Max 30 carácteres."
					{...register("first_name", { required: true })}
				/>
				<input
					type="text"
					name="last_name"
					maxLength="30"
					pattern="^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{3,30}$"
					title="No uses símbolos ni números. Min 3, Max 30 carácteres."
					{...register("last_name", { required: true })}
				/>
				<input
					type="email"
					name="email"
					placeholder="Email "
					{...register("email")}
				/>
				<label className="label_birthdate">
					Fecha de nacimiento:
					<p className="info-text-register">Ejemplo: 12/03/2024 o 2024/03/12</p>
					<input
						type="text"
						id="birth_date"
						name="birth_date"
						pattern="^(?:\d{2}/\d{2}/\d{4}|\d{4}/\d{2}/\d{2})$"
						title="Formato válido: DD/MM/AAAA o AAAA/MM/DD (Ej: 12/03/2024 o 2024/03/12)."
						placeholder="dd/mm/aaaa *"
						{...register("birth_date", { required: true })}
					/>
				</label>
				<label className="label_birthdate">
					Teléfono:
					<p className="info-text-register">Ejemplo: 3425123456</p>
					<input
						type="text"
						id="tel_contact"
						name="tel_contact"
						placeholder="Teléfono *"
						inputMode="numeric"
						pattern="\d*"
						title="Solo números."
						{...register("tel_contact", { required: true })}
					/>
				</label>

				<div className="sistema-bajas-modif-botones">
					<button type="submit" className="boton-quitar-carrito">
						Actualizar datos
					</button>
				</div>
			</form>

			<form onSubmit={handleSubmit2(updateUserPassword)} className="checkout-form">
				<input
					type="password"
					name="password"
					placeholder="Ingresa un nuevo password"
					maxLength="8"
					pattern="[A-Za-z0-9]{8,8}"
					{...register2("password", { required: true })}
				/>
				<input
					type="password"
					name="repassword"
					placeholder="Repite el nuevo password"
					maxLength="8"
					pattern="[A-Za-z0-9]{8,8}"
					{...register2("repassword", { required: true })}
				/>

				<div className="sistema-bajas-modif-botones">
					<button type="submit" className="boton-quitar-carrito">
						Actualizar password
					</button>
				</div>
			</form>
			<Link to={"/"} className="info-button">
				Volver
			</Link>
		</div>
	);
}
