import { NavLink } from "react-router-dom";
import axios from "../../config/axiosConfig";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const urlGetDebtors = "monthlypayments/";
const urlGetAnnualDebtors = "annualpayments/debtorshistory/";
const urlChangeStatus = "users/changeuserstatus";
const urlGetInscriptionDebtors = "inscriptions/getdebtorshistory/";
const urlGetMerchDebtors = "merchrequests/getdebtorshistory/";

const date = new Date();

export default function SystemDebtors() {
	const [debtorsUsers, setDebtorsUsers] = useState([]);
	const [dateChanger, setDateChanger] = useState(
		date.getFullYear() +
			"-" +
			String(date.getMonth() + 1).padStart(2, "0") +
			"-" +
			String(date.getDate()).padStart(2, "0"),
	);

	const { register, handleSubmit } = useForm({
		mode: "onBlur",
	});

	const { register: register2 } = useForm({
		mode: "onBlur",
	});

	function getDebtorsUsers(e) {
		sessionStorage.setItem("selector", e.selector);
		sessionStorage.setItem("day", e.day);
		sessionStorage.setItem("group", e.group);

		if (e.selector === "monthly_payments") {
			axios
				.get(
					urlGetDebtors +
						e.day.slice(5, -3) +
						"/" +
						e.day.slice(0, -6) +
						"/" +
						e.group,
				)
				.then((response) => {
					setDebtorsUsers(response.data);
				})
				.catch((error) => {
					console.log(error);
					toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				});
		} else if (e.selector === "annual_payments") {
			axios
				.get(urlGetAnnualDebtors + e.day.slice(0, -6) + "/" + e.group)
				.then((response) => {
					setDebtorsUsers(response.data);
				})
				.catch((error) => {
					console.log(error);
					toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				});
		} else if (e.selector === "merch_requests") {
			axios
				.get(urlGetMerchDebtors + e.day + "/" + e.group)
				.then((response) => {
					setDebtorsUsers(response.data);
				})
				.catch((error) => {
					console.log(error);
					toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				});
		} else if (e.selector === "inscription_requests") {
			axios
				.get(urlGetInscriptionDebtors + e.day + "/" + e.group)
				.then((response) => {
					setDebtorsUsers(response.data);
				})
				.catch((error) => {
					console.log(error);
					toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				});
		}
	}

	useEffect(() => {
		if (sessionStorage.getItem("selector")) {
			const valuesFromStorage = {
				selector: sessionStorage.getItem("selector"),
				day: sessionStorage.getItem("day"),
				group: sessionStorage.getItem("group"),
			};
			getDebtorsUsers(valuesFromStorage);
		}
	}, []);

	function changeUserStatus(e, uid) {
		const newStatus = parseInt(e);
		axios
			.post(urlChangeStatus, { uid: uid, userStatus: newStatus })
			.then((response) => {
				toast.success("Se cambió el estado del usuario.");
				setDebtorsUsers((prevUsers) =>
					prevUsers.map((user) =>
						user.id_user === uid ? { ...user, user_status: newStatus } : user,
					),
				);
			})
			.catch((error) => {
				console.log(error);
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
			});
	}

	const handleChange = (event) => {
		setDateChanger(event.target.value);
	};

	return (
		<div className="carrito">
			<h1>Consulta de deudores activos:</h1>
			<form onSubmit={handleSubmit(getDebtorsUsers)}>
				<select {...register("selector")}>
					<option value="monthly_payments" defaultChecked>
						Cuota
					</option>
					<option value="annual_payments">Matrícula anual</option>
					<option value="merch_requests">Solicitudes de indumentaria</option>
					<option value="inscription_requests">Inscripciones a eventos</option>
				</select>
				<select {...register("group")}>
					<option value="todo">Todos</option>
					<option value="peques 1">peques 1</option>
					<option value="peques 2">peques 2</option>
					<option value="gimnasia 1">gimnasia 1</option>
					<option value="gimnasia 2">gimnasia 2</option>
					<option value="gimnasia 3">gimnasia 3</option>
					<option value="gimnasia 4">gimnasia 4</option>
					<option value="gimnasia 5">gimnasia 5</option>
					<option value="entrenamiento 1">entrenamiento 1</option>
					<option value="entrenamiento 2">entrenamiento 2</option>
					<option value="mañana">mañana</option>
				</select>
				<input
					type="date"
					id="day"
					name="day"
					value={dateChanger}
					{...register("day", { required: true })}
					onChange={handleChange}
				/>
				<button type="submit" className="cuenta-button">
					Consultar
				</button>
			</form>

			{debtorsUsers.length != 0 && (
				<div className="table_container">
					<table>
						<thead>
							<tr>
								<th>Nombre</th>
								<th>Apellido</th>
								<th>Teléfono</th>
								<th>Estado</th>
								<th>Historial pagos</th>
							</tr>
						</thead>
						<tbody>
							{debtorsUsers.map((user) => (
								<tr key={user.id_user}>
									<th>{user.first_name}</th>
									<th>{user.last_name}</th>
									<th>{user.tel_contact}</th>
									<th>
										<select
											{...register2(`status_${user.id_user}`)}
											value={user.user_status.toString()}
											onChange={(e) => {
												changeUserStatus(e.target.value, user.id_user);
											}}
										>
											<option value="1">Activo</option>
											<option value="0">Inactivo</option>
										</select>
									</th>
									<th>
										<NavLink
											to={`/debtorpaymentshistory/${user.id_user}`}
											className="info-button"
										>
											Ver
										</NavLink>
									</th>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			<NavLink to={`/`} className="info-button">
				Volver
			</NavLink>
		</div>
	);
}
