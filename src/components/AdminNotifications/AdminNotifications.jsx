import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../config/axiosConfig";
import { toast } from 'react-toastify';

const date = new Date();

const urlInscriptionsNewRequests = "inscriptions/newrequests"
//const urlInscriptions = "inscriptions/"
const urlMerchNewRequests = "merchrequests/newrequests"
//const urlMerchRequests = "merchrequests/"
const urlMarkPaidMerchRequests = "merchrequests/updatepaymentstatus/"
const urlPartialPayMerchRequest = "merchrequests/addmerchpayment/"
const urlPartialPayInscription = "inscriptions/addinscpayment/"

export default function AdminNotifications() {
    const [inscrptionsNewReq, setinscrptionsNewReq] = useState([]);
    const [merchNewReq, setmerchNewReq] = useState([]);
    const [amounts, setAmounts] = useState({});
    const [inscAmounts, setInscAmounts] = useState({});

    function fetchNewInscr() {
        axios.get(urlInscriptionsNewRequests)
            .then(response => {
                setinscrptionsNewReq(response.data);
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    function fetchNewMerchs() {
        axios.get(urlMerchNewRequests)
            .then(response => {
                setmerchNewReq(response.data);
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    useEffect(() => {
        fetchNewInscr();
        fetchNewMerchs();
    }, [])

 /*    function deleteInscription(iid) {
        axios.delete(urlInscriptions + iid, { withCredentials: true })
            .then(response => {
                toast.success('Se eliminó la inscripción correctamente.');
                fetchNewInscr()
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }
 */
    function payPartialInscription(iid, inscPrice) {
        const payDate = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate())
        const amount = inscAmounts[iid] || inscPrice;

        if (!amount) {
            toast.error("Por favor, ingresa un monto.");
            return;
        }

        axios.post(urlPartialPayInscription, { iid: iid, payDate: payDate, amount: amount })
            .then(response => {
                toast.success('Se registró el pago.');
                fetchNewInscr();
                setInscAmounts(prev => ({ ...prev, [iid]: "" }));
            })
            .catch(error => {
                if (error.response.data.code === 5) return toast.error(error.response.data.message);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

/* 
    function deleteMerchRequest(mid) {
        axios.delete(urlMerchRequests + mid, { withCredentials: true })
            .then(response => {
                toast.success('Se eliminó la solicitud correctamente.');
                fetchNewMerchs()
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }
 */
    function markPaidMerchRequest(mid) {
        const payDate = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate())
        axios.put(urlMarkPaidMerchRequests, { mid: mid, payDate: payDate })
            .then(response => {
                toast.success('Se saldó la solicitud.');
                fetchNewMerchs()
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    function payPartialMerchRequest(mid) {
        const payDate = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate())
        const amount = amounts[mid] || "";

        if (!amount) {
            toast.error("Por favor, ingresa un monto.");
            return;
        }

        axios.post(urlPartialPayMerchRequest, { mid: mid, payDate: payDate, amount: amount })
            .then(response => {
                toast.success('Se registró el pago parcial.');
                fetchNewMerchs();
                setAmounts(prev => ({ ...prev, [mid]: "" }));
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    return (
        <div className="carrito">
            <h1>Ultimas solicitudes recibidas</h1>

            {inscrptionsNewReq.length != 0 &&
                <>
                    <h2>Solicitudes de inscripción nuevas:</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Teléfono de contacto</th>
                                <th>Nombre evento</th>
                                <th>Fecha evento</th>
                                <th>Precio</th>
                                <th>Fecha inscripción</th>
                                <th>Pagado</th>
                                <th>Entregó</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                inscrptionsNewReq.map((inscription) => (
                                    
                                    <tr key={inscription.id_inscription}>
                                        <th>{inscription.first_name}</th>
                                        <th>{inscription.last_name}</th>
                                        <th>{inscription.tel_contact}</th>
                                        <th>{inscription.event_name}</th>
                                        <th>{new Date(inscription.event_date).toLocaleDateString('en-GB', {timeZone: 'UTC'})}</th>
                                        <th>${inscription.inscription_price}</th>
                                        <th>{new Date(inscription.inscription_date).toLocaleDateString('en-GB', {timeZone: 'UTC'})}</th>
                                        <th>{inscription.pay_date ? "PAGÓ" : "PENDIENTE"}</th>
                                        <th>{inscription.pay_date ? "---" : "$"+inscription.total_amount}</th>
                                        {!inscription.pay_date ? (
                                        <th className="edit-event-buttons-container">
                                                <>
                                                <div className="merch-input-container">
                                                    <input
                                                        className="merch-input"
                                                        type="text"
                                                        name="amount"
                                                        placeholder="Monto *"
                                                        inputMode="numeric"
                                                        pattern="\d*"
                                                        title="Solo números."
                                                        value={inscAmounts[inscription.id_inscription] || inscription.inscription_price}
                                                        onChange={(e) =>
                                                            setInscAmounts(prev => ({
                                                                ...prev,
                                                                [inscription.id_inscription]: e.target.value
                                                            }))
                                                        }
                                                    />
                                                    <button type="button" className="merch-button" onClick={() => payPartialInscription(inscription.id_inscription, inscription.inscription_price)} > Registrar </button>
                                                </div>
                                            {/* <button type="button" className="merch-button" onClick={() => markPaidInscription(inscription.id_inscription)} > Saldar </button> */}
                                            </>
                                            </th>) : <th></th>}
                                            {/* <button className="delete-event-button" onClick={() => { deleteInscription(inscription.id_inscription) }}>Borrar</button> */}
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                </>
            }
            {merchNewReq.length != 0 &&
                <>
                    <h2>Solicitudes de encargues nuevas:</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Teléfono</th>
                                <th>Fecha Solicitud</th>
                                <th>Descripción</th>
                                <th>Estado</th>
                                <th>Entregó</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                merchNewReq.map((merchReq) => (
                                    <tr key={merchReq.id_request}>
                                        <th>{merchReq.first_name}</th>
                                        <th>{merchReq.last_name}</th>
                                        <th>{merchReq.tel_contact}</th>
                                        <th>{new Date(merchReq.req_date).toLocaleDateString('en-GB', {timeZone: 'UTC'})}</th>
                                        <th>{merchReq.req_description}</th>
                                        <th>{merchReq.pay_date ? "PAGÓ" : "PENDIENTE"}</th>
                                        <th>${merchReq.total_amount}</th>
                                            {!merchReq.pay_date ? (
                                        <th className="edit-event-buttons-container">
                                                <>
                                                <div className="merch-input-container">
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
                                                            setAmounts(prev => ({
                                                                ...prev,
                                                                [merchReq.id_request]: e.target.value
                                                            }))
                                                        }
                                                    />
                                                    <button type="button" className="merch-button" onClick={() => payPartialMerchRequest(merchReq.id_request)} > Registrar parcial </button>
                                                </div>
                                            <button type="button" className="merch-button" onClick={() => markPaidMerchRequest(merchReq.id_request)} > Saldar </button>
                                            </>
                                            </th>) : <th></th>}
                                            {/* <button className="delete-event-button" onClick={() => { deleteMerchRequest(merchReq.id_request) }}>Borrar</button> */}
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                </>
            }

            <div className="ticket-back-cart-buttons">
                <NavLink to={"/"} className="info-button" >Volver</NavLink>
            </div>

        </div>
    )
}
