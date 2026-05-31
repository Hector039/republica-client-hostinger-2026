import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import axios from "../../config/axiosConfig";
import { toast } from "react-toastify";

const urlGetLotteries = "lottery/";
const urlCloseLottery = "lottery/close-lottery";
const urlNewLottery = "lottery/create";
const urlGetSoldNumbers = "lottery/get-lottery-numbers";
const urlDaily = "lottery/get-daily/";

const date = new Date();

export default function Lottery() {
	const [lotteries, setLotteries] = useState([]);
	const [soldNumbers, setSoldNumbers] = useState([]);
	const [daily, setDaily] = useState([]);
	const [dailyAmount, setDailyAmount] = useState(null);

	const today =
		date.getFullYear() +
		"-" +
		String(date.getMonth() + 1).padStart(2, "0") +
		"-" +
		String(date.getDate()).padStart(2, "0");

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

	function fetchLotteries() {
		axios
			.get(urlGetLotteries)
			.then((response) => {
				setLotteries(response.data);
			})
			.catch((error) => {
				toast.error(error);
			});
	}
	function fetchSoldNumbers() {
		axios
			.get(urlGetSoldNumbers)
			.then((response) => {
				setSoldNumbers(response.data);
			})
			.catch((error) => {
				toast.error(error);
			});
	}

	useEffect(() => {
		fetchLotteries();
		fetchSoldNumbers();
	}, []);

	function getDaily(e) {
		axios
			.get(urlDaily + e.day)
			.then((response) => {
				setDaily(response.data.daily);
				setDailyAmount(response.data.amount.total_amount);
			})
			.catch((error) => {
				console.log(error);
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
			});
	}

	function closeLottery(lid) {
		axios
			.put(urlCloseLottery, { lid })
			.then((response) => {
				toast.success("Se cerró el sorteo.");
				fetchLotteries();
			})
			.catch((error) => {
				console.log(error);
				if (error.response.data.message)
					return toast.error(error.response.data.message);
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
			});
	}

	function newLottery(e) {
		axios
			.post(urlNewLottery, {
				title: e.title,
			})
			.then((response) => {
				toast.success("Se registró el sorteo.");
				reset();
				fetchLotteries();
			})
			.catch((error) => {
				console.log(error);
				if (error.response.data.message)
					return toast.error(error.response.data.message);
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
			});
	}

	return (
		<div className="sistema-container">
			<div className="create-lottery-container">
				<h1>Consulta y actualización de sorteos:</h1>
				<h2 className="lottery-create-title">Nuevo sorteo:</h2>
				<form onSubmit={handleSubmit4(newLottery)} className="checkout-form">
					<input
						type="text"
						name="title"
						placeholder="Nombre del sorteo"
						{...register4("title", { required: true })}
					/>
					<button type="submit" className="cuenta-button-egreso">
						Crear
					</button>
				</form>
			</div>
			<div className="bajas-modif-main">
				{lotteries.length == 0 ?
					<p>Aún no hay sorteos</p>
				:	<table>
						<thead>
							<tr>
								<th>Nombre</th>
								<th>Fecha</th>
								<th>Acumulado</th>
								<th>Estado</th>
							</tr>
						</thead>
						<tbody>
							{lotteries.map((lottery) => (
								<tr key={lottery.id_lottery}>
									<th>{lottery.title}</th>
									<th>
										{new Date(lottery.register_date).toLocaleDateString("en-GB", {
											timeZone: "UTC",
										})}
									</th>
									<th>{lottery.amount}</th>
									<th>
										{lottery.is_open ?
											<button
												className="boton-quitar-carrito"
												onClick={() => {
													closeLottery(lottery.id_lottery);
												}}
											>
												Cerrar
											</button>
										:	"Cerrado"}
									</th>
								</tr>
							))}
						</tbody>
					</table>
				}
			</div>
			{soldNumbers.length > 0 && (
				<div className="sold-numbers-container">
					<h3>Listado de números vendidos del sorteo abierto:</h3>
					<p className="sold-numbers-paragraph">{soldNumbers.toString()}</p>
				</div>
			)}
			<div className="daily-container">
				<h1>Consulta de caja diaria sorteo:</h1>
				<p className="daily-paragraph">(abierto o cerrado)</p>
				<form onSubmit={handleSubmit(getDaily)} className="checkout-form">
					<input
						type="date"
						id="day"
						name="day"
						defaultValue={today}
						{...register("day", { required: true })}
					/>
					<button type="submit" className="cuenta-button">
						Consultar
					</button>
				</form>

				{daily.length > 0 && (
					<table className="table_balance">
						<thead>
							<tr>
								<th>Apellido</th>
								<th>Nombre</th>
								<th>DNI</th>
								<th>Sorteo</th>
								<th>Número</th>
								<th>Monto</th>
								<th>Total</th>
							</tr>
						</thead>
						<tbody>
							{daily.map((payment) => (
								<tr key={payment.id_payment}>
									<th>{payment.last_name}</th>
									<th>{payment.first_name}</th>
									<th>{payment.dni}</th>
									<th>{payment.title}</th>
									<th>{payment.lottery_number}</th>
									<th>{payment.amount}</th>
								</tr>
							))}
							{dailyAmount != null && (
								<tr>
									<th></th>
									<th></th>
									<th></th>
									<th></th>
									<th></th>
									<th></th>
									<th>{dailyAmount}</th>
								</tr>
							)}
						</tbody>
					</table>
				)}
			</div>
			<NavLink to={"/"} className="info-button">
				Volver
			</NavLink>
		</div>
	);
}
