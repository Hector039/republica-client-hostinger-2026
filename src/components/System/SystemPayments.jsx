import axios from "../../config/axiosConfig";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

const urlUsers = "users/";
const urlAddMonthPayment = "monthlypayments/";
const urlAddAnnualPayment = "annualpayments/";
const urlAddLinkedMonthPayment = "monthlypayments/linkedpayment/";
const globalDate = new Date();

export default function SystemPayments() {
	const [users, setUsers] = useState([]);
	const [userDates, setUserDates] = useState({});
	const [monthAmounts, setMonthAmounts] = useState({});
	const [annualAmounts, setAnnualAmounts] = useState({});
	const [checkBoxes, setCheckBoxes] = useState({});
	const [userSearch, setUserSearch] = useState(false);

	const today =
		globalDate.getFullYear() +
		"-" +
		String(globalDate.getMonth() + 1).padStart(2, "0");

	const { register, handleSubmit, setValue } = useForm({
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

	function addPayment(e, uid, buttonType, feeMonth, feeAnnual, isElectronic) {
		const date = new Date();
		const payDate =
			date.getFullYear() +
			"-" +
			String(date.getMonth() + 1).padStart(2, "0") +
			"-" +
			String(date.getDate()).padStart(2, "0");
		const dateArray = e.split("-");

		if (buttonType === "month") {
			const amount = monthAmounts[uid] || feeMonth;
			if (!amount) {
				toast.error("Por favor, ingresa un monto.");
				return;
			}
			axios
				.post(urlAddMonthPayment, {
					uid: uid,
					month: dateArray[1],
					year: dateArray[0],
					payDate: payDate,
					amount: amount,
					isElectronic,
				})
				.then((response) => {
					if (response.data !== "") return toast.success(response.data);
					toast.success("Se registró el pago mensual.");
					setMonthAmounts((prev) => ({ ...prev, [uid]: "" }));
				})
				.catch((error) => {
					if (error.response.data.code === 5)
						return toast.error(error.response.data.message);
					console.log(error);
					toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				});
		} else if (buttonType === "linked") {
			axios
				.post(urlAddLinkedMonthPayment, {
					uid: uid,
					month: dateArray[1],
					year: dateArray[0],
					payDate: payDate,
					isLinked: 1,
					isElectronic,
				})
				.then((response) => {
					toast.success("Se registró el pago por vínculo.");
					setMonthAmounts((prev) => ({ ...prev, [uid]: "" }));
				})
				.catch((error) => {
					if (error.response.data.code === 5)
						return toast.error(error.response.data.message);
					console.log(error);
					toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				});
		} else if (buttonType === "year") {
			const amount = annualAmounts[uid] || feeAnnual;

			if (!amount) {
				toast.error("Por favor, ingresa un monto.");
				return;
			}

			axios
				.post(urlAddAnnualPayment, {
					uid: uid,
					year: dateArray[0],
					payDate: payDate,
					amount: amount,
					isElectronic,
				})
				.then((response) => {
					if (response.data !== "") return toast.success(response.data);
					toast.success("Se registró el pago anual.");
					setAnnualAmounts((prev) => ({ ...prev, [uid]: "" }));
				})
				.catch((error) => {
					if (error.response.data.code === 5)
						return toast.error(error.response.data.message);
					console.log(error);
					toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				});
		}
	}

	const handleSubmit2 = (e, uid, feeMonth, feeAnnual) => {
		const date = new Date();
		const today =
			date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0");
		e.preventDefault();
		const buttonType = e.nativeEvent.submitter.name;
		const selectedDate = userDates[uid] || today;
		const isElectronic = checkBoxes[uid] || false;
		addPayment(selectedDate, uid, buttonType, feeMonth, feeAnnual, isElectronic);
	};

	const handleChange2 = (event, uid) => {
		setUserDates((prevState) => ({
			...prevState,
			[uid]: event.target.value,
		}));
	};

	const handleCheckBoxes = (event, uid) => {
		setCheckBoxes((prevState) => ({
			...prevState,
			[uid]: event.target.checked,
		}));
	};

	useEffect(() => {
		if (sessionStorage.getItem("search")) {
			const valuesFromStorage = {
				search: sessionStorage.getItem("search"),
				value: sessionStorage.getItem("value"),
			};
			getUsers(valuesFromStorage);
		}
	}, []);

	function changeUserSearch(value) {
		const date = new Date();
		if (value === "monthly_pay_date" || value === "annual_pay_date") {
			console.log(value);
			setUserSearch(true);
			setValue(
				"value",
				date.getFullYear() +
					"-" +
					String(date.getMonth() + 1).padStart(2, "0") +
					"-" +
					String(date.getDate()).padStart(2, "0"),
			);
		} else {
			setUserSearch(false);
			setValue("value", "");
		}
	}

	return (
		<div className="carrito">
			<h1>Gestión de pagos:</h1>

			<form onSubmit={handleSubmit(getUsers)} className="checkout-form">
				<label>
					Buscar usuario por:
					<select
						{...register("search")}
						onChange={(e) => {
							changeUserSearch(e.target.value);
						}}
					>
						<option value="last_name" defaultChecked>
							Apellido
						</option>
						<option value="first_name">Nombre</option>
						<option value="dni">DNI</option>
						<option value="user_group">Grupo</option>
						<option value="user_status">Estado (0 o 1)</option>
						<option value="monthly_pay_date">Fecha de pago cuota</option>
						<option value="annual_pay_date">Fecha de pago matrícula</option>
						<option value="TODO">Todo</option>
					</select>
				</label>

				{userSearch ?
					<input type="date" name="value" {...register("value")} />
				:	<label>
						Comienza con:
						<input
							type="text"
							name="value"
							placeholder="Ingresa tu búsqueda..."
							{...register("value")}
						/>
					</label>
				}

				<button type="submit" className="cuenta-button">
					Buscar
				</button>
			</form>

			{users.length > 0 && (
				<div className="table_container">
					<table>
						<thead>
							<tr>
								<th>Historial</th>
								<th>Nombre</th>
								<th>Apellido</th>
								<th>DNI</th>
								<th>Registrado</th>
								<th>Estado</th>
								<th>Tarifa</th>
								<th>Última impaga</th>
								<th>Entregó</th>
								<th>Fecha a registrar</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr key={user.id_user}>
									<th>
										<NavLink
											to={`/debtorpaymentshistory/${user.id_user}`}
											className="info-button"
										>
											Ir
										</NavLink>
									</th>
									<th>{user.first_name}</th>
									<th>{user.last_name}</th>
									<th>{user.dni}</th>
									<th>
										{new Date(user.register_date).toLocaleDateString("en-GB", {
											timeZone: "UTC",
										})}
									</th>
									<th>{user.user_status ? "ACTIVO" : "INACTIVO"}</th>
									<th>{user.fee_descr}</th>

									<th>
										{userSearch ?
											"Sin datos"
										:	<div className="unpaid_container">
												<p>
													{user.last_unpaid_month ? user.last_unpaid_month : "---"}/
													{user.last_unpaid_month_year ? user.last_unpaid_month_year : "---"}
												</p>
												<p>{user.last_unpaid_year ? user.last_unpaid_year : "---"}</p>
											</div>
										}
									</th>

									<th>
										{userSearch ?
											"Sin datos"
										:	<div className="unpaid_container">
												<p>
													{user.last_unpaid_month_amount ?
														"$" + user.last_unpaid_month_amount
													:	"---"}
												</p>
												<p>
													{user.last_unpaid_amount ? "$" + user.last_unpaid_amount : "---"}
												</p>
											</div>
										}
									</th>

									<th>
										<form
											onSubmit={(e) =>
												handleSubmit2(e, user.id_user, user.fee_month, user.fee_annual)
											}
										>
											<div className="checkbox-container">
												<input
													type="checkbox"
													checked={checkBoxes[user.id_user] || false}
													onChange={(e) => handleCheckBoxes(e, user.id_user)}
													id="miCheckbox"
													className="check_box"
												/>
												<label htmlFor="miCheckbox">Pago electrónico</label>
											</div>
											<input
												type="month"
												id="month_paid"
												name="month_paid"
												value={userDates[user.id_user] || today}
												onChange={(e) => handleChange2(e, user.id_user)}
												required
											/>
											<div className="payment_buttons_container">
												<button className="payments-buttons" type="submit" name="month">
													Registrar
												</button>
												<input
													className="merch-input"
													type="text"
													name="amount"
													placeholder="Monto *"
													inputMode="numeric"
													pattern="\d*"
													title="Solo números."
													value={monthAmounts[user.id_user] || user.fee_month}
													onChange={(e) =>
														setMonthAmounts((prev) => ({
															...prev,
															[user.id_user]: e.target.value,
														}))
													}
												/>
												<button className="payments-buttons" type="submit" name="linked">
													Registrar por vínculo
												</button>
											</div>

											<div className="payment_buttons_container">
												<button className="payments-buttons" type="submit" name="year">
													Registrar Matricula
												</button>
												<input
													className="merch-input"
													type="text"
													name="amount"
													placeholder="Monto *"
													inputMode="numeric"
													pattern="\d*"
													title="Solo números."
													value={annualAmounts[user.id_user] || user.fee_annual}
													onChange={(e) =>
														setAnnualAmounts((prev) => ({
															...prev,
															[user.id_user]: e.target.value,
														}))
													}
												/>
											</div>
										</form>
									</th>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
