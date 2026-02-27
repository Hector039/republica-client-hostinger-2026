import { useState, useEffect } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import axios from "../../config/axiosConfig";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';

const urlMerchRequests = "merchrequests/merchrequestbyid/"
const urlUpdateMerchRequests = "merchrequests/"

export default function UpdateMerchRequest() {
    const navigate = useNavigate();
    const { mid } = useParams();
    const [merchRequest, setMerchRequest] = useState([])

    const {
        register,
        handleSubmit,
        setValue,
    } = useForm({
        mode: "onBlur",
    });

    useEffect(() => {
        function axiosData() {
        axios.get(urlMerchRequests + mid, { withCredentials: true })
            .then(response => {
                setMerchRequest(response.data);
                setValue("id_request", response.data.id_request);
                setValue("size", response.data.size);
                setValue("quantity", response.data.quantity);
                setValue("req_description", response.data.req_description);
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
        }
        axiosData();
    }, [])


    const updateMerchRequest = (e) => {
        axios.put(urlUpdateMerchRequests + e.id_request, {
            size: e.size,
            quantity: e.quantity,
            req_description: e.req_description
        }, { withCredentials: true })
            .then(response => {
                navigate(`/updatemerchrequest/${e.id_request}`);
                toast.success('Se actualizó la solicitud correctamente.');
            })
            .catch(error => {
                if (error.response.statusText && error.response.statusText === "Unauthorized") return toast.error(error.response.data.error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }


    return (
        <div key={merchRequest.id_request}  className="sistema-container">
            <form onSubmit={handleSubmit(updateMerchRequest)} className="checkout-form">
                <p>ID de la solicitud:</p>
                <input type="text" name="id_request" disabled {...register("id_request")} />
                <select name="size" id="size" {...register("size")}>
                    <option value="xs">XS</option>
                    <option value="s">S</option>
                    <option value="m">M</option>
                    <option value="l">L</option>
                    <option value="xl">XL</option>
                </select>
                <input type="number" name="quantity" defaultValue={"1"} min={"1"} {...register("quantity", { required: true })} />
                <input type="text" name="req_description" {...register("req_description", { required: true })} />
                
                <div className="sistema-bajas-modif-botones">
                    <button type="submit" className="boton-quitar-carrito">Modificar solicitud</button>
                </div>

            </form>
            <NavLink to={`/`} className="info-button">Volver</NavLink>
        </div>
    )
}