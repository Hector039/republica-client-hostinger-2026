import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import axios from "../../config/axiosConfig";
import { toast } from "react-toastify";

const urlEvents = "events/";
const urlGetFeaturesPositions = "utils/openclosefeatures";
const urlUpdateFeaturesPositions = "utils/openclosefeatures/";

export default function SystemEvents() {
	const [events, setEvents] = useState([]);
	const [featurePosition, setFeaturePosition] = useState(0);

	const { register, handleSubmit, reset } = useForm({
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

	function fetchPositions() {
		axios
			.get(urlGetFeaturesPositions)
			.then((response) => {
				setFeaturePosition(response.data[1].feature);
			})
			.catch((error) => {
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				console.log(error);
			});
	}

	function fetchEvents() {
		axios
			.get(urlEvents)
			.then((response) => {
				setEvents(response.data);
			})
			.catch((error) => {
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				console.log(error);
			});
	}

	useEffect(() => {
		fetchEvents();
		fetchPositions();
	}, []);

	function deleteEvent(eid) {
		axios
			.delete(urlEvents + eid, { withCredentials: true })
			.then((response) => {
				toast.success("Se eliminó el evento correctamente.");
				fetchEvents();
			})
			.catch((error) => {
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				console.log(error);
			});
	}

	const newEvent = (e) => {
		const groupArray = [
			e.peques_1,
			e.peques_2,
			e.peques_3,
			e.gimnasia_1,
			e.gimnasia_2,
			e.gimnasia_3,
			e.gimnasia_4,
			e.gimnasia_5,
			e.entrenamiento_1,
			e.entrenamiento_2,
			e.maniana,
			e.baile,
		];
		const groupsCleaned = groupArray.filter((group) => group !== false);

		axios
			.post(urlEvents, {
				event_date: e.event_date,
				event_name: e.event_name,
				event_description: e.event_description,
				inscription_price: e.inscription_price,
				group_list: groupsCleaned,
			})
			.then((response) => {
				toast.success("Se creó el evento correctamente.");
				fetchEvents();
			})
			.catch((error) => {
				if (
					error.response.statusText &&
					error.response.statusText === "Unauthorized"
				)
					return toast.error(error.response.data.error);
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
				console.log(error);
			});
	};

	return (
		<div className="sistema-container">
			{featurePosition ?
				<button
					className="is_open"
					onClick={() => {
						openCloseFeatures(2, featurePosition);
					}}
				>
					Eventos habilitados
				</button>
			:	<button
					className="is_closed"
					onClick={() => {
						openCloseFeatures(2, featurePosition);
					}}
				>
					Eventos deshabilitados
				</button>
			}

			<h1>Crear eventos:</h1>

			<div className="altas">
				<form onSubmit={handleSubmit(newEvent)} className="checkout-form">
					<input
						type="date"
						name="event_date"
						placeholder="Fecha del evento *"
						{...register("event_date", { required: true })}
					/>
					<input
						type="text"
						name="event_name"
						placeholder="Nombre del evento *"
						{...register("event_name", { required: true })}
					/>
					<input
						type="text"
						name="event_description"
						placeholder="Descripción *"
						{...register("event_description", { required: true })}
					/>
					<input
						type="number"
						name="inscription_price"
						placeholder="Precio de inscripción *"
						min={"0"}
						defaultValue={"0"}
						{...register("inscription_price")}
					/>

					<div className="group_list_container">
						<div className="group_list">
							<input
								type="checkbox"
								id="peques1"
								name="peques 1"
								value="peques 1"
								{...register("peques_1")}
							/>
							<label htmlFor="peques1">peques 1</label>
						</div>
						<div className="group_list">
							<input
								type="checkbox"
								id="peques2"
								name="peques 2"
								value="peques 2"
								{...register("peques_2")}
							/>
							<label htmlFor="peques2">peques 2</label>
						</div>
						<div className="group_list">
							<input
								type="checkbox"
								id="peques3"
								name="peques 3"
								value="peques 3"
								{...register("peques_3")}
							/>
							<label htmlFor="peques3">peques 3</label>
						</div>
						<div className="group_list">
							<input
								type="checkbox"
								id="gimnasia1"
								name="gimnasia 1"
								value="gimnasia 1"
								{...register("gimnasia_1")}
							/>
							<label htmlFor="gimnasia1">gimnasia 1</label>
						</div>
						<div className="group_list">
							<input
								type="checkbox"
								id="gimnasia2"
								name="gimnasia 2"
								value="gimnasia 2"
								{...register("gimnasia_2")}
							/>
							<label htmlFor="gimnasia2">gimnasia 2</label>
						</div>
						<div className="group_list">
							<input
								type="checkbox"
								id="gimnasia3"
								name="gimnasia 3"
								value="gimnasia 3"
								{...register("gimnasia_3")}
							/>
							<label htmlFor="gimnasia3">gimnasia 3</label>
						</div>
						<div className="group_list">
							<input
								type="checkbox"
								id="gimnasia4"
								name="gimnasia 4"
								value="gimnasia 4"
								{...register("gimnasia_4")}
							/>
							<label htmlFor="gimnasia4">gimnasia 4</label>
						</div>
						<div className="group_list">
							<input
								type="checkbox"
								id="gimnasia5"
								name="gimnasia 5"
								value="gimnasia 5"
								{...register("gimnasia_5")}
							/>
							<label htmlFor="gimnasia5">gimnasia 5</label>
						</div>
						<div className="group_list">
							<input
								type="checkbox"
								id="entrenamiento1"
								name="entrenamiento 1"
								value="entrenamiento 1"
								{...register("entrenamiento_1")}
							/>
							<label htmlFor="entrenamiento1">entrenamiento 1</label>
						</div>
						<div className="group_list">
							<input
								type="checkbox"
								id="entrenamiento2"
								name="entrenamiento 2"
								value="entrenamiento 2"
								{...register("entrenamiento_2")}
							/>
							<label htmlFor="entrenamiento2">entrenamiento 2</label>
						</div>
						<div className="group_list">
							<input
								type="checkbox"
								id="maniana"
								name="mañana"
								value="mañana"
								{...register("maniana")}
							/>
							<label htmlFor="maniana">mañana</label>
						</div>
						<div className="group_list">
							<input
								type="checkbox"
								id="baile"
								name="baile"
								value="baile"
								{...register("baile")}
							/>
							<label htmlFor="baile">baile</label>
						</div>
					</div>

					<div className="sistema-bajas-modif-botones">
						<button type="submit" className="cuenta-button">
							Registrar evento
						</button>
						<button type="reset" className="boton-quitar-carrito" onClick={reset}>
							Reset
						</button>
					</div>
				</form>
			</div>

			<div className="bajas-modif-main">
				{!events.length ?
					<p className="text-info">No se encontraron eventos</p>
				:	<>
						<h2>Listado de eventos:</h2>
						<table>
							<thead>
								<tr>
									<th>Fecha publicación</th>
									<th>Fecha Evento</th>
									<th>Nombre</th>
									<th>Decripción</th>
									<th>Grupos</th>
									<th>Precio</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{events.map((event) => (
									<tr key={event.id_event}>
										<th>
											{new Date(event.publication_date).toLocaleDateString("en-GB", {
												timeZone: "UTC",
											})}
										</th>
										<th>
											{new Date(event.event_date).toLocaleDateString("en-GB", {
												timeZone: "UTC",
											})}
										</th>
										<th>{event.event_name}</th>
										<th>{event.event_description}</th>
										<th>{event.group_list}</th>
										<th>{event.inscription_price}</th>
										<th className="edit-event-buttons-container">
											<button
												className="delete-event-button"
												onClick={() => deleteEvent(event.id_event)}
											>
												Borrar
											</button>
											<NavLink
												to={`/updateevent/${event.id_event}`}
												className="edit-event-button"
											>
												Editar
											</NavLink>
										</th>
									</tr>
								))}
							</tbody>
						</table>
					</>
				}
			</div>
			<NavLink to={"/"} className="info-button">
				Volver
			</NavLink>
		</div>
	);
}
