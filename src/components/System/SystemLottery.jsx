import { NavLink } from "react-router-dom";
import axios from "../../config/axiosConfig";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import { toast } from "react-toastify";

const urlUsers = "lottery/get-users";
const urlAddPayment = "lottery/add-payment";
const urlAsignNumber = "lottery/asign-lottery-number";
const urlDeletePayment = "lottery/delete-payment/";

export default function SystemLottery() {
	const [users, setUsers] = useState([]);
	const [amounts, setAmounts] = useState({});
	const [numbers, setNumbers] = useState({});

	const { register, handleSubmit } = useForm({
		mode: "onBlur",
	});

	function getUsers(e) {
		sessionStorage.setItem("value", e.value);
		sessionStorage.setItem("search", e.search);
		axios
			.post(urlUsers, { search: e.search, value: e.value })
			.then((response) => {
				setUsers(response.data);
			})
			.catch((error) => {
				console.log(error);
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
			});
	}

	const handleAddPayment = (e, pid, lid, userKey) => {
		e.preventDefault();
		const date = new Date();
		const payDate =
			date.getFullYear() +
			"-" +
			String(date.getMonth() + 1).padStart(2, "0") +
			"-" +
			String(date.getDate()).padStart(2, "0");
		const amount = amounts[userKey] ?? 5000;

		if (!amount) return toast.error("Por favor, ingresa un monto.");
		axios
			.post(urlAddPayment, {
				pid,
				amount,
				payDate,
				lid,
			})
			.then((response) => {
				toast.success("Se registró el pago.");
				if (sessionStorage.getItem("search")) {
					const valuesFromStorage = {
						search: sessionStorage.getItem("search"),
						value: sessionStorage.getItem("value"),
					};
					getUsers(valuesFromStorage);
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
			});
	};

	const handleAsignNumber = (e, uid, lid, userKey) => {
		e.preventDefault();
		const number = numbers[userKey];
		if (!number || parseInt(number) == 0)
			return toast.error("Por favor, ingresa un número.");

		axios
			.post(urlAsignNumber, {
				uid,
				lid,
				number,
			})
			.then((response) => {
				toast.success("Se asignó el número.");
				if (sessionStorage.getItem("search")) {
					const valuesFromStorage = {
						search: sessionStorage.getItem("search"),
						value: sessionStorage.getItem("value"),
					};
					getUsers(valuesFromStorage);
				}
			})
			.catch((error) => {
				console.log(error);
				if (error.response.data.message)
					return toast.error(error.response.data.message);
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
			});
	};

	function deletePayment(pid) {
		axios
			.delete(urlDeletePayment + pid)
			.then((response) => {
				toast.success("Se eliminó el usuario correctamente.");
				if (sessionStorage.getItem("search")) {
					const valuesFromStorage = {
						search: sessionStorage.getItem("search"),
						value: sessionStorage.getItem("value"),
					};
					getUsers(valuesFromStorage);
				}
			})
			.catch((error) => {
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				console.log(error);
			});
	}

	function handleDownloadExcel() {
		const sortedUsers = users
			.filter((user) => user.id_payment !== null)
			.toSorted((a, b) => a.last_name.localeCompare(b.last_name))
			.map((user) => ({
				lastName: user.last_name,
				firstName: user.first_name,
				dni: user.dni,
				lotteryTitle: user.title,
				lotteryNumber: user.lottery_number,
				amount: user.amount,
			}));
		const header = ["Apellido", "Nombre", "DNI", "Sorteo", "Número", "Monto"];
		downloadExcel({
			fileName: "Usuarios Sorteos",
			sheet: "Usuarios",
			tablePayload: {
				header,
				body: sortedUsers,
			},
		});
	}

	return (
		<div className="carrito">
			<h1>Sorteos</h1>

			<form onSubmit={handleSubmit(getUsers)} className="checkout-form">
				<label>
					Buscar por:
					<select {...register("search")}>
						<option value="last_name" defaultChecked>
							Apellido
						</option>
						<option value="first_name">Nombre</option>
						<option value="dni">DNI</option>
						<option value="user_group">Grupo</option>
						<option value="user_status">Estado (0 o 1)</option>
						<option value="TODO">Todo</option>
					</select>
				</label>
				<label>
					Comienza con:
					<input
						type="text"
						name="value"
						placeholder="Ingresa tu búsqueda..."
						{...register("value")}
					/>
				</label>
				<button type="submit" className="cuenta-button">
					Buscar
				</button>
			</form>

			{users.length != 0 && (
				<div className="table_container">
					<button className="boton-quitar-carrito" onClick={handleDownloadExcel}>
						Exportar
					</button>
					<table>
						<thead>
							<tr>
								<th>Eliminar</th>
								<th>Apellido</th>
								<th>Nombre</th>
								<th>DNI</th>
								<th>Sorteo</th>
								<th>Número</th>
								<th>Monto</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr key={user.key}>
									<th>
										{user.id_payment !== null ?
											<button
												className="delete-event-button"
												onClick={() => {
													deletePayment(user.id_payment);
												}}
											>
												X
											</button>
										:	"-"}
									</th>
									<th>{user.last_name}</th>
									<th>{user.first_name}</th>
									<th>{user.dni}</th>
									<th>{user.title !== null ? user.title : "-"}</th>
									<th>
										{user.id_payment !== null ?
											user.lottery_number
										:	<form
												onSubmit={(e) =>
													handleAsignNumber(e, user.id_user, user.id_lottery, user.key)
												}
												className="asign_form_container"
											>
												<div className="asign_buttons_container">
													<input
														className="lottery-number-input"
														type="text"
														name="number"
														placeholder="Num"
														inputMode="numeric"
														pattern="\d*"
														title="Solo números."
														value={numbers[user.key] || ""}
														onChange={(e) =>
															setNumbers((prev) => ({
																...prev,
																[user.key]: e.target.value,
															}))
														}
													/>
													<button className="payments-buttons" type="submit" name="year">
														Asignar
													</button>
												</div>
											</form>
										}
									</th>
									<th>
										{user.amount === 0 && user.lottery_number !== null ?
											<div className="payment_buttons_container">
												<form
													onSubmit={(e) =>
														handleAddPayment(e, user.id_payment, user.id_lottery, user.key)
													}
													className="asign_form_container"
												>
													<div className="asign_buttons_container">
														<input
															className="lottery-number-input"
															type="text"
															name="amount"
															placeholder="Monto *"
															inputMode="numeric"
															pattern="\d*"
															title="Solo números."
															value={amounts[user.key] ?? 5000}
															onChange={(e) =>
																setAmounts((prev) => ({
																	...prev,
																	[user.key]: e.target.value,
																}))
															}
														/>
														<button className="payments-buttons" type="submit" name="year">
															Pagar
														</button>
													</div>
												</form>
											</div>
										:	user.amount}
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
