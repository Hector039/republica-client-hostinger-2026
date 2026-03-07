import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import axios from "../../config/axiosConfig";
import { toast } from "react-toastify";

const urlEvents = "events/";

export default function UpdateEvent() {
	const navigate = useNavigate();
	const { eid } = useParams();
	const [event, setEvent] = useState([]);

	const { register, handleSubmit, setValue } = useForm({
		mode: "onBlur",
	});

	useEffect(() => {
		function axiosData() {
			axios
				.get(urlEvents + eid)
				.then((response) => {
					setEvent(response.data);

					const groupListArray = response.data.group_list.split(",");
					groupListArray.forEach((g) => {
						g == "mañana" ? setValue("maniana", g) : setValue(g.replace(" ", "_"), g);
					});

					setValue("id_event", response.data.id_event);
					setValue("publication_date", response.data.publication_date.slice(0, -14));
					setValue("event_date", response.data.event_date.slice(0, -14));
					setValue("event_name", response.data.event_name);
					setValue("event_description", response.data.event_description);
					setValue("inscription_price", response.data.inscription_price);
				})
				.catch((error) => {
					toast.error(error);
				});
		}
		axiosData();
	}, []);

	const updateEvent = (e) => {
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
			.put(urlEvents + e.id_event, {
				event_date: e.event_date,
				event_name: e.event_name,
				event_description: e.event_description,
				inscription_price: e.inscription_price,
				group_list: groupsCleaned,
			})
			.then((response) => {
				toast.success("Se actualizó el evento correctamente.");
				navigate(`/administrationevents`);
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
		<>
			<div className="sistema-container">
				<h1>Actualizar evento:</h1>

				<div key={event.id_event}>
					<form onSubmit={handleSubmit(updateEvent)} className="checkout-form">
						<p>ID:</p>
						<input type="text" name="id_event" disabled {...register("id_event")} />
						<input
							type="date"
							name="event_date"
							{...register("event_date", { required: true })}
						/>
						<input
							type="text"
							name="event_name"
							{...register("event_name", { required: true })}
						/>
						<input
							type="text"
							name="event_description"
							{...register("event_description", { required: true })}
						/>
						<input
							type="number"
							name="inscription_price"
							min={"0"}
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
							<button type="submit" className="delete-event-button">
								Modificar
							</button>
						</div>
					</form>
				</div>
				<NavLink to={`/administrationevents`} className="info-button">
					Volver
				</NavLink>
			</div>
		</>
	);
}
