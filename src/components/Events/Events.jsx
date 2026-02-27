import { useEffect, useState } from "react";
import { useUser } from "../context/dataContext";
import axios from "../../config/axiosConfig";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";

const urlEvents = "events/"
const urlInscriptions = "inscriptions/alluserinscriptions/"
const urlDeleteInscriptions = "inscriptions/"
const urlSendInscriptions = "inscriptions/"
const urlMerchRequests = "merchrequests/allusermerch/"
const urlSendMerchRequests = "merchrequests/"
const urlDeleteMerchRequests = "merchrequests/"

export default function Events() {
    const [events, setEvents] = useState([])
    const [userInscriptions, setUserInscriptions] = useState([])
    const [merchRequests, setMerchRequests] = useState([])
    const { user } = useUser();

    function fecthMerch() {
        if (user) {
            axios.get(urlMerchRequests + user.id_user, { withCredentials: true })
                .then(response => {
                    setMerchRequests(response.data);
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                })
        }
    }
    function fetchInscr() {
        if (user) {

            axios.get(urlInscriptions + user.id_user, { withCredentials: true })
                .then(response => {
                    setUserInscriptions(response.data);
                })
                .catch(error => {
                    console.log(error);
                    toast.error(error);
                })
        }
    }

    function fetchEvents() {
        axios.get(urlEvents, { withCredentials: true })
            .then(response => {
                setEvents(response.data);
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    useEffect(() => {
        fetchEvents();
        fetchInscr();
        fecthMerch();
    }, [])

    const {
        register,
        handleSubmit
    } = useForm({
        mode: "onBlur",
    });


    const sendMerchRequest = (e) => {
        axios.post(urlSendMerchRequests + user.id_user, {
            size: e.size,
            quantity: e.quantity,
            req_description: e.req_description
        }, { withCredentials: true })
            .then(response => {
                Swal.fire({
                    icon: "success",
                    title: "Se envió tu solicitud correctamente.",
                    showConfirmButton: true
                }).then(response => { fecthMerch(); })
            })
            .catch(error => {
                if (error.response.statusText && error.response.statusText === "Unauthorized") return toast.error(error.response.data.error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    function deleteEvent(eid) {
        axios.delete(urlEvents + eid, { withCredentials: true })
            .then(response => {
                toast.success('Se eliminó el evento correctamente.');
                fetchEvents();
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    function deleteInscription(iid) {
        axios.delete(urlDeleteInscriptions + iid, { withCredentials: true })
            .then(response => {
                toast.success('Se eliminó la inscripción correctamente.');
                fetchInscr();
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }
    function sendInscription(eid, uid) {
        axios.post(urlSendInscriptions + eid + "/" + uid, { withCredentials: true })
            .then(response => {
                toast.success('Se envió la solicitud de inscripción correctamente.');
                fetchInscr();
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    function deleteUserMerchReq(mid) {
        axios.delete(urlDeleteMerchRequests + mid, { withCredentials: true })
            .then(response => {
                toast.success('Se eliminó la solcitud de encargue correctamente.');
                fecthMerch();
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    return (
        <>
            <div className="welcome-container">
                {!user ? <><h1>Bienvenido Invitado!</h1><p>Loguéate para poder gestionar tu información</p></> : <h1>Bienvenida/o {user.first_name}!</h1>}
            </div>

            {userInscriptions.length != 0 &&
                <div className="table_container">
                    <h2>Mis inscripciones</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha de publicación</th>
                                <th>Fecha del evento</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio inscripción</th>
                                <th>Estado</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                userInscriptions.map((event) => (
                                    <tr key={event.id_inscription}>
                                        <th>{event.publication_date.slice(0, -14)}</th>
                                        <th>{event.event_date.slice(0, -14)}</th>
                                        <th>{event.event_name}</th>
                                        <th>{event.event_description}</th>
                                        <th>${event.inscription_price}</th>
                                        <th>{event.pay_date ? "PAGADA" : "PENDIENTE"}</th>
                                        <th><button className="boton-quitar-carrito" onClick={() => { deleteInscription(event.id_inscription) }}>Borrar</button></th>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table></div>}

            {merchRequests.length != 0 &&
                <div className="table_container">
                    <h2>Mis solicitudes</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Talle</th>
                                <th>Fecha de la solicitud</th>
                                <th>Cantidad</th>
                                <th>Descripción</th>
                                <th>Estado</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                merchRequests.map((request) => (
                                    <tr key={request.id_request}>
                                        <th>{request.size}</th>
                                        <th>{request.req_date.slice(0, -14)}</th>
                                        <th>{request.quantity}</th>
                                        <th>{request.req_description}</th>
                                        <th>{request.pay_date ? "PAGADA" : "PENDIENTE"}</th>
                                        <th ><div className="table-buttons-container">{user != null && !user.is_admin && <>
                                            <NavLink to={`/updatemerchrequest/${request.id_request}`} className="table-buttons">Editar</NavLink>
                                            <button className="table-buttons" onClick={() => { deleteUserMerchReq(request.id_request) }}>Borrar</button></>}</div></th>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table></div>}

            {user &&
                <div><h2>Enviar solicitud</h2>
                    <form onSubmit={handleSubmit(sendMerchRequest)}>
                        <div className="merch-inputs">
                            <label>Medida:</label>
                            <select {...register("size")}>
                                <option value="xs">XS</option>
                                <option value="s">S</option>
                                <option value="m" defaultChecked>M</option>
                                <option value="l">L</option>
                                <option value="xl">XL</option>
                            </select>
                            <label >Cantidad:</label>
                            <input type="number" id="quantity" name="quantity" min={1} defaultValue={1} placeholder="Cantidad *" {...register("quantity")} />
                        </div>
                        <input type="text" id="req_description" name="req_description" placeholder="Breve descripción del pedido" {...register("req_description", { required: true })} />

                        <button type="submit" className="cuenta-button" >Enviar solicitud</button>
                    </form></div>}

            <div className="products-container">
                {events.length != 0 &&
                    <div className="table_container">
                        <h2>Eventos</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Fecha de publicación</th>
                                    <th>Fecha del evento</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Precio inscripción</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    events.map((event) => (
                                        <tr key={event.id_event}>
                                            <th>{event.publication_date.slice(0, -14)}</th>
                                            <th>{event.event_date.slice(0, -14)}</th>
                                            <th>{event.event_name}</th>
                                            <th>{event.event_description}</th>
                                            <th>${event.inscription_price}</th>
                                            <th>{user != null && user.is_admin && <button className="boton-quitar-carrito" onClick={() => { deleteEvent(event.id_event) }}>Borrar</button>}</th>
                                            <th>{user != null && <button className="boton-quitar-carrito" onClick={() => { sendInscription(event.id_event, user.id_user) }}>Inscribirme</button>}</th>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table></div>
                }
            </div>
        </>
    )
}