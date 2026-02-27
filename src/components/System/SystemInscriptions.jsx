import { useState } from "react";
import { useEffect } from "react";
import axios from "../../config/axiosConfig";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { downloadExcel } from "react-export-table-to-excel";
import { useForm } from "react-hook-form";

const urlInscriptions = "inscriptions/";
const urlUpdateNewInscriptionsNewRequests = "inscriptions/updatenewrequests";
const urlPartialPayInscription = "inscriptions/addinscpayment/";

export default function SystemInscriptions() {
	const [inscriptionsReq, setinscriptionsReq] = useState([]);
	const [amounts, setAmounts] = useState({});
	const [userSearch, setUserSearch] = useState(false);

	const { register, handleSubmit, setValue } = useForm({
		mode: "onBlur",
	});

	function getInscriptionsUsers(e) {
		sessionStorage.setItem("value", e.value);
		sessionStorage.setItem("search", e.search);
		axios
			.post(urlInscriptions, { search: e.search, value: e.value })
			.then((response) => {
				setinscriptionsReq(response.data);
			})
			.catch((error) => {
				console.log(error);
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
			});
	}

	useEffect(() => {
		function axiosData() {
			axios.get(urlUpdateNewInscriptionsNewRequests).catch((error) => {
				console.log(error);
			});
		}
		axiosData();
	}, []);

	function deleteInscription(iid) {
		axios
			.delete(urlInscriptions + iid)
			.then((response) => {
				toast.success("Se eliminó la inscripción correctamente.");

				if (sessionStorage.getItem("search")) {
					const valuesFromStorage = {
						search: sessionStorage.getItem("search"),
						value: sessionStorage.getItem("value"),
					};
					getInscriptionsUsers(valuesFromStorage);
				}
			})
			.catch((error) => {
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				console.log(error);
			});
	}

	function payPartialInscription(iid, inscriptionPrice) {
		const date = new Date();
		const payDate =
			date.getFullYear() +
			"-" +
			String(date.getMonth() + 1).padStart(2, "0") +
			"-" +
			String(date.getDate());
		const amount = amounts[iid] || inscriptionPrice;

		if (!amount) {
			toast.error("Por favor, ingresa un monto.");
			return;
		}

		axios
			.post(urlPartialPayInscription, {
				iid: iid,
				payDate: payDate,
				amount: amount,
			})
			.then((response) => {
				toast.success("Se registró el pago.");
				if (sessionStorage.getItem("search")) {
					const valuesFromStorage = {
						search: sessionStorage.getItem("search"),
						value: sessionStorage.getItem("value"),
					};
					getInscriptionsUsers(valuesFromStorage);
				}
				setAmounts((prev) => ({ ...prev, [iid]: "" }));
			})
			.catch((error) => {
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				console.log(error);
			});
	}

	function handleDownloadExcel() {
		const header = [
			"Apellido",
			"Nombre",
			"Teléfono",
			"Evento",
			"Fecha",
			"Precio",
			"Fecha Inscrp",
			"Fecha Pago",
			"ID Insc",
			"Entregó",
		];
		downloadExcel({
			fileName: "Inscripciones",
			sheet: "Inscripciones",
			tablePayload: {
				header,
				body: inscriptionsReq,
			},
		});
	}

	function changeUserSearch(value) {
		const date = new Date();
		if (value === "pay_date") {
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
		<div className="system_incs_container">
			<h1>Gestión solicitudes de inscripción:</h1>

			<form
				onSubmit={handleSubmit(getInscriptionsUsers)}
				className="checkout-form"
			>
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
						<option value="event_name">Nombre evento</option>
						<option value="pay_date">Fecha de pago</option>
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

			{inscriptionsReq.length != 0 ?
				<div className="table_container">
					<button className="boton-quitar-carrito" onClick={handleDownloadExcel}>
						Exportar
					</button>
					<table>
						<thead>
							<tr>
								<th>Borrar</th>
								<th>Nombre</th>
								<th>Apellido</th>
								<th>Teléfono</th>
								<th>Nombre evento</th>
								<th>Fecha evento</th>
								<th>Precio inscripción</th>
								<th>Fecha inscripción</th>
								<th>Pagado</th>
								<th>Entregó</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{inscriptionsReq.map((inscription) => (
								<tr key={inscription.id_inscription}>
									<th>
										<button
											className="delete-event-button"
											onClick={() => {
												deleteInscription(inscription.id_inscription);
											}}
										>
											X
										</button>
									</th>
									<th>{inscription.first_name}</th>
									<th>{inscription.last_name}</th>
									<th>{inscription.tel_contact}</th>
									<th>{inscription.event_name}</th>
									<th>
										{new Date(inscription.event_date).toLocaleDateString("en-GB", {
											timeZone: "UTC",
										})}
									</th>
									<th>${inscription.inscription_price}</th>
									<th>
										{new Date(inscription.inscription_date).toLocaleDateString("en-GB", {
											timeZone: "UTC",
										})}
									</th>
									<th>{inscription.pay_date ? "PAGÓ" : "PENDIENTE"}</th>
									<th>{inscription.pay_date ? "---" : inscription.total_amount}</th>
									{!inscription.pay_date ?
										<th className="edit-event-buttons-container">
											<div className="merch-input-container">
												<input
													className="merch-input"
													type="text"
													name="amount"
													placeholder="Monto *"
													inputMode="numeric"
													pattern="\d*"
													title="Solo números."
													value={
														amounts[inscription.id_inscription] ||
														inscription.inscription_price
													}
													onChange={(e) =>
														setAmounts((prev) => ({
															...prev,
															[inscription.id_inscription]: e.target.value,
														}))
													}
												/>
												<button
													type="button"
													className="merch-button"
													onClick={() =>
														payPartialInscription(
															inscription.id_inscription,
															inscription.inscription_price,
														)
													}
												>
													{" "}
													Registrar{" "}
												</button>
											</div>
										</th>
									:	<th></th>}
								</tr>
							))}
						</tbody>
					</table>{" "}
				</div>
			:	<p>No se encontraron inscripciones a eventos.</p>}
			<NavLink to={"/"} className="info-button">
				Volver
			</NavLink>
		</div>
	);
}
