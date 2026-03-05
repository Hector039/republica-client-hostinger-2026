import { useForm } from "react-hook-form";
import { useUser } from "../context/dataContext";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "../../config/axiosConfig";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import { useState } from "react";

const MySwal = withReactContent(Swal);

const urlUserLogin = "users/login";
const urlUserRegister = "users/signin";
const urlAdminNotifications = "utils/notifications";
const urlNotifyAnnualDebtor = "annualpayments/notifydebtor/";
const urlNotifyMonthlyDebtor = "monthlypayments/notifydebtor/";
const urlNewExpenditure = "utils/expenditures/";
const urlNewIncome = "utils/income/";

export default function Users() {
	const navigate = useNavigate();
	const { user, setUser, isLoggedIn } = useUser();
	const [isElectronicExpenditure, setIsElectronicExpenditure] = useState(false);
	const [isElectronicIncome, setIsElectronicIncome] = useState(false);

	const handleChangeisElectronicIncome = (event) => {
		setIsElectronicIncome(event.target.checked);
	};
	const handleChangeisElectronicExpenditure = (event) => {
		setIsElectronicExpenditure(event.target.checked);
	};

	const { register, handleSubmit } = useForm({
		mode: "onBlur",
	});

	const {
		register: register4,
		handleSubmit: handleSubmit4,
		reset,
	} = useForm({
		mode: "onBlur",
	});

	const {
		register: register5,
		handleSubmit: handleSubmit5,
		reset: reset5,
	} = useForm({
		mode: "onBlur",
	});

	const { register: register2, handleSubmit: handleSubmit2 } = useForm({
		mode: "onBlur",
	});

	const login = (e) => {
		const date = new Date();
		const queryDte =
			date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0");
		axios
			.post(urlUserLogin, { dni: e.dni, password: e.password })
			.then((response) => {
				Swal.fire({
					icon: "success",
					title: "Login correcto!",
					showConfirmButton: false,
					timer: 1500,
				});
				if (response) {
					localStorage.setItem("token", JSON.stringify(response.data.token));
					setUser(response.data);
					console.log("User logued data: ", response.data);
					const uid = response.data.id_user;
					if (response.data.is_admin) {
						axios
							.get(urlAdminNotifications)
							.then((response) => {
								const merchReq = response.data.merchReq;
								const inscReq = response.data.inscReq;

								if (merchReq.merch > 0 || inscReq.insc > 0) {
									MySwal.fire({
										title: "Tienes nuevas notificaciones! Deseas verlas?",
										icon: "warning",
										showCancelButton: true,
										confirmButtonColor: "#3085d6",
										cancelButtonColor: "#d33",
										confirmButtonText: "Ir",
									}).then((result) => {
										if (result.isConfirmed) {
											navigate("/adminnotifications");
										}
									});
								}
							})
							.catch((error) => {
								if (error.response.data.message)
									return toast.error(error.response.data.message);
								toast.error("Ocurrió un error inesperado. Intenta de nuevo");
								console.log(error);
							});
					}

					if (date.getDate() > 16) {
						axios
							.get(urlNotifyMonthlyDebtor + uid + "/" + queryDte)
							.then(async (response) => {
								if (response.data != "") {
									await Swal.fire({
										icon: "warning",
										title: response.data,
										showConfirmButton: true,
									});
								}
								axios
									.get(urlNotifyAnnualDebtor + uid + "/" + queryDte)
									.then((response) => {
										if (response.data != "") {
											Swal.fire({
												icon: "warning",
												title: response.data,
												showConfirmButton: true,
											});
										}
									})
									.catch((error) => {
										console.log(error);
										if (error.response.data.message)
											return toast.error(error.response.data.message);
										toast.error("Ocurrió un error inesperado. Intenta de nuevo");
									});
							})
							.catch((error) => {
								console.log(error);
								if (error.response.data.message)
									return toast.error(error.response.data.message);
								toast.error("Ocurrió un error inesperado. Intenta de nuevo");
							});
					}
				}
			})
			.catch((error) => {
				console.log(error);
				if (error.response.data.error)
					return toast.error(error.response.data.error);
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
			});
	};

	const newRegister = (e) => {
		if (e.password !== e.repassword)
			return toast.error("Los passwords no coinciden. Intenta de nuevo");
		axios
			.post(urlUserRegister, {
				first_name: e.first_name,
				last_name: e.last_name,
				email: e.email,
				birth_date: e.birth_date,
				password: e.password,
				dni: e.dni,
				tel_contact: e.tel_contact,
			})
			.then((response) => {
				Swal.fire({
					icon: "success",
					title: `Bienvenida/o ${response.data.last_name}!`,
					showConfirmButton: true,
				}).then((resp) => {
					localStorage.setItem("token", JSON.stringify(response.data.token));
					setUser(response.data);
				});
			})
			.catch((error) => {
				console.log(error);
				if (error.response.data.message)
					return toast.error(error.response.data.message);
				if (
					error.response.statusText &&
					error.response.statusText === "Unauthorized"
				)
					return toast.error(error.response.data.error);
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
			});
	};

	function newExpenditure(e) {
		const date = new Date();
		const payDate =
			date.getFullYear() +
			"-" +
			String(date.getMonth() + 1).padStart(2, "0") +
			"-" +
			String(date.getDate()).padStart(2, "0");

		axios
			.post(urlNewExpenditure, {
				descr: e.descr,
				amount: e.amount,
				payDate: payDate,
				isElectronicExpenditure,
			})
			.then((response) => {
				toast.success("Se registró el egreso.");
				setIsElectronicExpenditure(false);
				reset();
			})
			.catch((error) => {
				console.log(error);
				toast.error("Ocurrió un error inesperado");
			});
	}

	function newIncome(e) {
		const date = new Date();
		const payDate =
			date.getFullYear() +
			"-" +
			String(date.getMonth() + 1).padStart(2, "0") +
			"-" +
			String(date.getDate()).padStart(2, "0");

		axios
			.post(urlNewIncome, {
				descr: e.descr,
				amount: e.amount,
				payDate: payDate,
				isElectronicIncome,
			})
			.then((response) => {
				toast.success("Se registró el ingreso.");
				setIsElectronicIncome(false);
				reset5();
			})
			.catch((error) => {
				console.log(error);
				toast.error("Ocurrió un error inesperado");
			});
	}

	return (
		<section className="cuenta-info">
			{!isLoggedIn ?
				<>
					<h1>
						* BIENVENIDOS a Gimnasia Deportiva de la Vecinal Republica del Oeste 🤸‍♀ *
					</h1>
					<h3>
						Por favor, regístrese creando una cuenta a nombre de su hijo/a gimnasta.
						Esto nos permitirá establecer una comunicación más fluida sobre pagos,
						eventos, encargues y otros temas referidos a la dinámica del gimnasio.
					</h3>
					<div className="cuenta-registrarse">
						<h4>Acceder usuario existente:</h4>
						<form className="login-form" onSubmit={handleSubmit(login)}>
							<input
								type="text"
								name="dni"
								placeholder="DNI *"
								inputMode="numeric"
								pattern="\d*"
								maxLength="8"
								minLength="8"
								title="Solo números. 8 dígitos."
								{...register("dni", { required: true })}
							/>
							<input
								type="password"
								id="login-password"
								name="password"
								placeholder="Contraseña *"
								maxLength="8"
								pattern="[A-Za-z0-9]{8,8}"
								{...register("password", { required: true })}
							/>
							<button type="submit" className="cuenta-button">
								Acceder
							</button>
						</form>
						<Link to={"/passrestoration"} className="boton-forgot">
							Olvidaste tu contraseña?
						</Link>
					</div>

					<div className="cuenta-registrarse">
						<h4>Registrar cuenta nueva:</h4>
						<form className="login-form" onSubmit={handleSubmit2(newRegister)}>
							<input
								type="text"
								id="first_name"
								name="first_name"
								placeholder="Nombre *"
								maxLength="30"
								pattern="^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{3,30}$"
								title="No uses símbolos ni números. Min 3, Max 30 carácteres."
								{...register2("first_name", { required: true })}
							/>
							<input
								type="text"
								id="last_name"
								name="last_name"
								placeholder="Apellido *"
								maxLength="30"
								pattern="^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{3,30}$"
								title="No uses símbolos ni números. Min 3, Max 30 carácteres."
								{...register2("last_name", { required: true })}
							/>
							<input
								type="email"
								id="email"
								name="email"
								placeholder="Correo Electrónico"
								{...register2("email")}
							/>

							<p className="info-text-register">
								Recuerda que tu contraseña debe tener 8 carácteres alfanuméricos SIN
								símbolos.
							</p>
							<input
								type="password"
								id="password"
								name="password"
								placeholder="Contraseña nueva *"
								maxLength="8"
								pattern="[A-Za-z0-9]{8,8}"
								{...register2("password", { required: true })}
							/>
							<input
								type="password"
								id="repassword"
								name="repassword"
								placeholder="Repite la contraseña nueva *"
								maxLength="8"
								pattern="[A-Za-z0-9]{8,8}"
								{...register2("repassword", { required: true })}
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
									{...register2("birth_date", { required: true })}
								/>
							</label>
							<input
								id="dni"
								name="dni"
								placeholder="DNI *"
								type="text"
								inputMode="numeric"
								pattern="\d*"
								maxLength="8"
								minLength="8"
								title="Solo números. 8 dígitos."
								{...register2("dni", { required: true })}
							/>
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
									{...register2("tel_contact", { required: true })}
								/>
							</label>

							<button type="submit" className="cuenta-button">
								Registrarse
							</button>
						</form>
					</div>
				</>
			:	<div className="user-info-container">
					<h1>Bienvenida/o {user.first_name}!</h1>

					<div className="user-info">
						<p>
							Nombre completo: {user.first_name} {user.last_name}
						</p>
						<p>E-Mail: {user.email ? user.email : "Sin dato"}</p>
						<p>Fecha de nacimiento: {user.birth_date}</p>
						<p>DNI: {user.dni}</p>
						<p>Teléfono de contacto: {user.tel_contact}</p>
						<p>
							Fecha de registro:{" "}
							{new Date(user.register_date).toLocaleDateString("en-GB", {
								timeZone: "UTC",
							})}
						</p>
					</div>
					<div className="user-info-buttons">
						<NavLink
							to={`/updateuser`}
							className="cuenta-button"
							style={({ isActive }) => {
								return { fontWeight: isActive ? "bold" : "" };
							}}
						>
							Mi cuenta
						</NavLink>
						<NavLink
							to={`/masinfo`}
							className="cuenta-button"
							style={({ isActive }) => {
								return { fontWeight: isActive ? "bold" : "" };
							}}
						>
							Más info
						</NavLink>
					</div>

					{user.is_admin === 1 && (
						<div className="user-info-container">
							<h2>Ingresos:</h2>
							<form onSubmit={handleSubmit5(newIncome)} className="checkout-form">
								<div className="checkbox-container">
									<input
										type="checkbox"
										checked={isElectronicIncome}
										onChange={handleChangeisElectronicIncome}
										id="miCheckbox"
										className="check_box"
									/>
									<label htmlFor="miCheckbox">Es por CVU</label>
								</div>
								<input
									type="text"
									name="descr"
									placeholder="Descripción o motivo"
									{...register5("descr", { required: true })}
								/>
								<input
									type="number"
									name="amount"
									min={"0"}
									defaultValue={0}
									placeholder="Monto"
									{...register5("amount", { required: true })}
								/>
								<button type="submit" className="cuenta-button-ingreso">
									Nuevo ingreso
								</button>
							</form>

							<h2>Egresos:</h2>
							<form onSubmit={handleSubmit4(newExpenditure)} className="checkout-form">
								<div className="checkbox-container">
									<input
										type="checkbox"
										checked={isElectronicExpenditure}
										onChange={handleChangeisElectronicExpenditure}
										id="miCheckbox"
										className="check_box"
									/>
									<label htmlFor="miCheckbox">Es por CVU</label>
								</div>
								<input
									type="text"
									name="descr"
									placeholder="Descripción o motivo"
									{...register4("descr", { required: true })}
								/>
								<input
									type="number"
									name="amount"
									min={"0"}
									defaultValue={0}
									placeholder="Monto"
									{...register4("amount", { required: true })}
								/>
								<button type="submit" className="cuenta-button-egreso">
									Nuevo egreso
								</button>
							</form>

							<NavLink to={`/daily`} className="get-debtors-button">
								Caja diaria
							</NavLink>
							<NavLink to={`/dailyelectronic`} className="get-debtors-button">
								Caja diaria PE
							</NavLink>
							<NavLink to={`/monthly`} className="get-debtors-button">
								Caja mensual
							</NavLink>
							<NavLink to={`/monthlyelectronic`} className="get-debtors-button">
								Caja mensual PE
							</NavLink>
							<NavLink to={`/administrationdebtors`} className="get-debtors-button">
								Consultar deudores activos
							</NavLink>
							<NavLink to={`/fees`} className="get-debtors-button">
								Tarifario de cuotas
							</NavLink>
							<NavLink to={`/productfees`} className="get-debtors-button">
								Tarifario de productos
							</NavLink>
							<NavLink to={`/`} className="info-button">
								Volver
							</NavLink>
						</div>
					)}
				</div>
			}
		</section>
	);
}
