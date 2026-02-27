import { useState } from "react";
import { useEffect } from "react";
import axios from "../../config/axiosConfig";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { downloadExcel } from "react-export-table-to-excel";
import { useForm } from "react-hook-form";

//const urlMarkPaidMerchRequests = "merchrequests/updatepaymentstatus/";
const urlMerchRequests = "merchrequests/";
const urlPartialPayMerchRequest = "merchrequests/addmerchpayment/";
const urlUpdateNewMerchRequests = "merchrequests/updatenewrequests";
const urlGetFeaturesPositions = "utils/openclosefeatures";
const urlUpdateFeaturesPositions = "utils/openclosefeatures/";

export default function SystemMerch() {
	const [merchRequests, setMerchReq] = useState([]);
	const [amounts, setAmounts] = useState({});
	const [checkBoxes, setCheckBoxes] = useState({});
	const [featurePosition, setFeaturePosition] = useState(0);
	const [userSearch, setUserSearch] = useState(false);

	const { register, handleSubmit, setValue } = useForm({
		mode: "onBlur",
	});

	function openCloseFeatures(fid, position) {
		const pos = position ? 0 : 1;
		axios
			.put(urlUpdateFeaturesPositions + fid + "/" + pos)
			.then((response) => {
				setFeaturePosition(pos);
			})
			.catch((error) => {
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				console.log(error);
			});
	}

	function getMerchUsers(e) {
		sessionStorage.setItem("value", e.value);
		sessionStorage.setItem("search", e.search);
		axios
			.post(urlMerchRequests, { search: e.search, value: e.value })
			.then((response) => {
				console.log("merch users in getmerchUsers: ", response.data);

				setMerchReq(response.data);
			})
			.catch((error) => {
				console.log(error);
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
			});
	}

	function fetchPositions() {
		axios
			.get(urlGetFeaturesPositions)
			.then((response) => {
				setFeaturePosition(response.data[0].feature);
			})
			.catch((error) => {
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				console.log(error);
			});
	}

	const handleCheckBoxes = (event, uid) => {
		setCheckBoxes((prevState) => ({
			...prevState,
			[uid]: event.target.checked,
		}));
	};

	useEffect(() => {
		fetchPositions();
	}, []);

	useEffect(() => {
		function axiosData() {
			axios.get(urlUpdateNewMerchRequests).catch((error) => {
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				console.log(error);
			});
		}
		axiosData();
	}, []);

	function deleteMerchRequest(mid) {
		axios
			.delete(urlMerchRequests + mid)
			.then((response) => {
				toast.success("Se eliminó la solicitud correctamente.");
				if (sessionStorage.getItem("search")) {
					const valuesFromStorage = {
						search: sessionStorage.getItem("search"),
						value: sessionStorage.getItem("value"),
					};
					getMerchUsers(valuesFromStorage);
				}
			})
			.catch((error) => {
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				console.log(error);
			});
	}

	function payPartialMerchRequest(mid, productPrice, wasElectronic, userAmount) {
		const date = new Date();
		const payDate =
			date.getFullYear() +
			"-" +
			String(date.getMonth() + 1).padStart(2, "0") +
			"-" +
			String(date.getDate());
		const amount = amounts[mid] || "";
		const isElectronic = checkBoxes[mid] || false;

		if (!amount) {
			toast.error("Por favor, ingresa un monto.");
			return;
		}

		if (
			(wasElectronic === 1 && isElectronic === false) ||
			(wasElectronic === 0 && isElectronic === true)
		) {
			toast.error(
				`Los métodos de pago no coinciden. Anterior: ${wasElectronic ? "Electrónico" : "Efectivo"} Actual: ${isElectronic ? "Electrónico" : "Efectivo"}`,
			);
			return;
		}

		axios
			.post(urlPartialPayMerchRequest, {
				mid: mid,
				payDate: payDate,
				amount: amount,
				isElectronic,
				productPrice,
				userAmount,
			})
			.then((response) => {
				toast.success("Se registró el pago.");

				if (sessionStorage.getItem("search")) {
					const valuesFromStorage = {
						search: sessionStorage.getItem("search"),
						value: sessionStorage.getItem("value"),
					};
					getMerchUsers(valuesFromStorage);
				}

				setAmounts((prev) => ({ ...prev, [mid]: "" }));
			})
			.catch((error) => {
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				console.log(error);
			});
	}
	/* 
	function markPaidMerchRequest(mid) {
		const payDate =
			date.getFullYear() +
			"-" +
			String(date.getMonth() + 1).padStart(2, "0") +
			"-" +
			String(date.getDate());
		axios
			.put(urlMarkPaidMerchRequests, { mid: mid, payDate: payDate })
			.then((response) => {
				toast.success("Se saldó la solicitud.");

				if (sessionStorage.getItem("search")) {
					const valuesFromStorage = {
						search: sessionStorage.getItem("search"),
						value: sessionStorage.getItem("value"),
					};
					getMerchUsers(valuesFromStorage);
				}
			})
			.catch((error) => {
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				console.log(error);
			});
	}
 */
	function handleDownloadExcel() {
		const header = [
			"ID usuario",
			"Apellido",
			"Nombre",
			"Teléfono",
			"ID Solic",
			"Fecha Solicitud",
			"Descripcion",
			"Fecha pago",
			"Es electrónico",
			"Entregó",
			"Producto",
			"Precio",
		];
		downloadExcel({
			fileName: "Solicitudes",
			sheet: "Solicitudes",
			tablePayload: {
				header,
				body: merchRequests,
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
			{featurePosition ?
				<button
					className="is_open"
					onClick={() => {
						openCloseFeatures(1, featurePosition);
					}}
				>
					Solicitudes habilitadas
				</button>
			:	<button
					className="is_closed"
					onClick={() => {
						openCloseFeatures(1, featurePosition);
					}}
				>
					Solicitudes deshabilitadas
				</button>
			}

			<h1>Historial de solicitudes de encargues:</h1>

			<form onSubmit={handleSubmit(getMerchUsers)} className="checkout-form">
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
						{/* <option value="req_description">Descripción</option> */}
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

			{merchRequests.length != 0 && (
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
								<th>Fecha Solicitud</th>
								<th>Nombre</th>
								<th>Precio</th>
								<th>Entregó</th>
								<th>Debe</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{merchRequests.map((merchReq) => (
								<tr key={merchReq.id_request}>
									<th>
										<button
											className="delete-event-button"
											onClick={() => {
												deleteMerchRequest(merchReq.id_request);
											}}
										>
											X
										</button>
									</th>
									<th>{merchReq.first_name}</th>
									<th>{merchReq.last_name}</th>
									<th>{merchReq.tel_contact}</th>
									<th>
										{new Date(merchReq.req_date).toLocaleDateString("en-GB", {
											timeZone: "UTC",
										})}
									</th>
									<th>{merchReq.title}</th>
									<th>{merchReq.price}</th>
									<th>{merchReq.amount}</th>
									<th>{merchReq.price - merchReq.amount}</th>
									{!merchReq.pay_date ?
										<th className="edit-event-buttons-container">
											<div className="merch-input-container">
												<div className="checkbox-container">
													<input
														type="checkbox"
														checked={checkBoxes[merchReq.id_request] || false}
														onChange={(e) => handleCheckBoxes(e, merchReq.id_request)}
														id="miCheckbox"
														className="check_box"
													/>
													<label htmlFor="miCheckbox">Pago electrónico</label>
												</div>
												<input
													className="merch-input"
													type="text"
													name="amount"
													placeholder="Monto *"
													inputMode="numeric"
													pattern="\d*"
													title="Solo números."
													value={amounts[merchReq.id_request] || ""}
													onChange={(e) =>
														setAmounts((prev) => ({
															...prev,
															[merchReq.id_request]: e.target.value,
														}))
													}
												/>
												<button
													type="button"
													className="merch-button"
													onClick={() =>
														payPartialMerchRequest(
															merchReq.id_request,
															merchReq.price,
															merchReq.is_electronic,
															merchReq.amount,
														)
													}
												>
													{" "}
													Registrar{" "}
												</button>
											</div>
											{/* <button
												type="button"
												className="merch-button"
												onClick={() => markPaidMerchRequest(merchReq.id_request)}
											>
												{" "}
												Saldar{" "}
											</button> */}
										</th>
									:	<th></th>}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			<NavLink to={"/"} className="info-button">
				Volver
			</NavLink>
		</div>
	);
}
