import { useEffect, useState } from "react";
import { useUser } from "../context/dataContext";
import axios from "../../config/axiosConfig";
import { toast } from "react-toastify";

const urlMonthlyHistory = "monthlypayments/";
const urlUserAnnualHistory = "annualpayments/";
const urlUser = "users/";

export default function UserPaymentsHistory() {
	const { user } = useUser();
	const [monthlyPaymentsHistory, setMonthlyPaymentsHistory] = useState([]);
	const [annualPaymentsHistory, setAnnualPaymentsHistory] = useState([]);
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

	useEffect(() => {
		function axiosData() {
			axios
				.get(urlMonthlyHistory + user.id_user)
				.then((response) => {
					setMonthlyPaymentsHistory(response.data);
				})
				.catch((error) => {
					console.log(error);
					toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				});
			axios
				.get(urlUserAnnualHistory + user.id_user)
				.then((response) => {
					setAnnualPaymentsHistory(response.data);
				})
				.catch((error) => {
					console.log(error);
					toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				});
		}
		axiosData();
	}, []);

	return (
		<div className="cuenta-main">
			<h1>Historial de pagos:</h1>

			<section className="cuenta-info">
				<h2>Cuota mensual:</h2>
				{!monthlyPaymentsHistory.length ?
					<p className="info-text-register">Sin datos</p>
				:	<table>
						<thead>
							<tr>
								<th>Fecha del registro</th>
								<th>Mes</th>
								<th>Año</th>
							</tr>
						</thead>
						<tbody>
							{monthlyPaymentsHistory.map((payment) => (
								<tr key={payment.id_payment}>
									<th>
										{new Date(payment.pay_date).toLocaleDateString("en-GB", {
											timeZone: "UTC",
										})}
									</th>
									<th>{meses[payment.month_paid]}</th>
									<th>{payment.year_paid}</th>
								</tr>
							))}
						</tbody>
					</table>
				}
				<h2>Matrícula anual:</h2>
				{!annualPaymentsHistory.length ?
					<p className="info-text-register">Sin datos</p>
				:	<table>
						<thead>
							<tr>
								<th>Fecha del registro</th>
								<th>Año</th>
							</tr>
						</thead>
						<tbody>
							{annualPaymentsHistory.map((payment) => (
								<tr key={payment.id_payment}>
									<th>
										{new Date(payment.pay_date).toLocaleDateString("en-GB", {
											timeZone: "UTC",
										})}
									</th>
									<th>{payment.year_paid}</th>
								</tr>
							))}
						</tbody>
					</table>
				}
			</section>
		</div>
	);
}
