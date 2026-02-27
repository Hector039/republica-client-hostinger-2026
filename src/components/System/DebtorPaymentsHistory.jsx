import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import axios from "../../config/axiosConfig";
import { toast } from "react-toastify";

const urlFullMonthlyHistory = "monthlypayments/fullmonthlyhistory/";
const urlDelMonthlyPayment = "monthlypayments/delmonthlypayment/";
const urlFullAnnualHistory = "annualpayments/fullannualhistory/";
const urlDelAnnualPayment = "annualpayments/delannualpayment/";
const urlUserInscriptionHistory = "inscriptions/";
const urlUserMerchHistory = "merchrequests/";

export default function DebtorPaymentsHistory() {
	const { uid } = useParams();
	const [monthlyPaymentsHistory, setMonthlyPaymentsHistory] = useState([]);
	const [annualPaymentsHistory, setAnnualPaymentsHistory] = useState([]);
	const [merchHistory, setMerchHistory] = useState([]);
	const [inscriptionHistory, setInscriptionHistory] = useState([]);
	const meses = [
		" ",
		"Enero",
		"Febrero",
		"Marzo",
		"Abril",
		"Mayo",
		"Junio",
		"Julio",
		"Agosto",
		"Setiembre",
		"Octubre",
		"Noviembre",
		"Diciembre",
	];

	function fetchMonthlyHistory(uid) {
		axios
			.get(urlFullMonthlyHistory + uid)
			.then((response) => {
				setMonthlyPaymentsHistory(response.data);
			})
			.catch((error) => {
				console.log(error);
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
			});
	}

	function fetchAnnualHistory(uid) {
		axios
			.get(urlFullAnnualHistory + uid)
			.then((response) => {
				setAnnualPaymentsHistory(response.data);
			})
			.catch((error) => {
				console.log(error);
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
			});
	}

	function fetchInscriptionHistory(uid) {
		axios
			.get(urlUserInscriptionHistory + uid)
			.then((response) => {
				setInscriptionHistory(response.data);
			})
			.catch((error) => {
				console.log(error);
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
			});
	}

	function fetchMerchHistory(uid) {
		axios
			.get(urlUserMerchHistory + uid)
			.then((response) => {
				setMerchHistory(response.data);
			})
			.catch((error) => {
				console.log(error);
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
			});
	}

	function deleteMonthlyPayment(mid, payDate) {
		axios
			.delete(urlDelMonthlyPayment + mid + "/" + payDate)
			.then((response) => {
				fetchMonthlyHistory(uid);
			})
			.catch((error) => {
				console.log(error);
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
			});
	}

	function deleteAnnualPayment(aid) {
		axios
			.delete(urlDelAnnualPayment + aid)
			.then((response) => {
				fetchAnnualHistory(uid);
			})
			.catch((error) => {
				console.log(error);
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
			});
	}

	useEffect(() => {
		fetchMonthlyHistory(uid);
		fetchAnnualHistory(uid);
		fetchInscriptionHistory(uid);
		fetchMerchHistory(uid);
	}, []);

	return (
		<div className="cuenta-main">
			<h1>Historial de pagos:</h1>

			<section className="cuenta-info">
				<h2>Cuotas:</h2>
				{!monthlyPaymentsHistory.length ?
					<p className="info-text-register">Sin datos</p>
				:	<table>
						<thead>
							<tr>
								<th>Borrar</th>
								<th>Fecha del registro</th>
								<th>Mes</th>
								<th>Año</th>
								<th>Método</th>
							</tr>
						</thead>
						<tbody>
							{monthlyPaymentsHistory.map((payment) => (
								<tr key={payment.id_payment}>
									<th>
										<button
											className="delete-event-button"
											onClick={() => {
												deleteMonthlyPayment(payment.id_payment, payment.pay_date);
											}}
										>
											X
										</button>
									</th>
									<th>
										{new Date(payment.pay_date).toLocaleDateString("en-GB", {
											timeZone: "UTC",
										})}
									</th>
									<th>{meses[payment.month_paid]}</th>
									<th>{payment.year_paid}</th>
									<th>{payment.is_electronic ? "Electrónico" : "Efectivo"}</th>
								</tr>
							))}
						</tbody>
					</table>
				}
				<h2>Matrícula anual:</h2>
				{!annualPaymentsHistory.length ?
					<p className="info-text-register">Sin datos</p>
				:	<table>
						<thead>
							<tr>
								<th>Borrar</th>
								<th>Fecha del registro</th>
								<th>Año</th>
								<th>Método</th>
							</tr>
						</thead>
						<tbody>
							{annualPaymentsHistory.map((payment) => (
								<tr key={payment.id_payment}>
									<th>
										<button
											className="delete-event-button"
											onClick={() => {
												deleteAnnualPayment(payment.id_payment);
											}}
										>
											X
										</button>
									</th>
									<th>
										{new Date(payment.pay_date).toLocaleDateString("en-GB", {
											timeZone: "UTC",
										})}
									</th>
									<th>{payment.year_paid}</th>
									<th>{payment.is_electronic ? "Electrónico" : "Efectivo"}</th>
								</tr>
							))}
						</tbody>
					</table>
				}
				<h2>Inscripciones a torneos:</h2>
				{!inscriptionHistory.length ?
					<p className="info-text-register">Sin datos</p>
				:	<table>
						<thead>
							<tr>
								<th>Fecha evento</th>
								<th>Nombre evento</th>
								<th>Fecha del pago</th>
							</tr>
						</thead>
						<tbody>
							{inscriptionHistory.map((insc) => (
								<tr key={insc.id_inscription}>
									<th>
										{new Date(insc.event_date).toLocaleDateString("en-GB", {
											timeZone: "UTC",
										})}
									</th>
									<th>{insc.event_name}</th>
									<th>
										{new Date(insc.pay_date).toLocaleDateString("en-GB", {
											timeZone: "UTC",
										})}
									</th>
								</tr>
							))}
						</tbody>
					</table>
				}
				<h2>Solicitudes de indumentaria:</h2>
				{!merchHistory.length ?
					<p className="info-text-register">Sin datos</p>
				:	<table>
						<thead>
							<tr>
								<th>Fecha solicitud</th>
								<th>Descripción</th>
								<th>Fecha del pago</th>
								<th>Método</th>
							</tr>
						</thead>
						<tbody>
							{merchHistory.map((merch) => (
								<tr key={merch.id_request}>
									<th>
										{new Date(merch.req_date).toLocaleDateString("en-GB", {
											timeZone: "UTC",
										})}
									</th>
									<th>{merch.req_description}</th>
									<th>
										{new Date(merch.pay_date).toLocaleDateString("en-GB", {
											timeZone: "UTC",
										})}
									</th>
									<th>{merch.is_electronic ? "Electrónico" : "Efectivo"}</th>
								</tr>
							))}
						</tbody>
					</table>
				}
			</section>

			<NavLink to={`/administrationpayments`} className="info-button">
				Volver a pagos
			</NavLink>
			<NavLink to={`/administrationdebtors`} className="info-button">
				Volver a deudores
			</NavLink>
		</div>
	);
}
