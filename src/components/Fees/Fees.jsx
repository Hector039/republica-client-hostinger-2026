import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import axios from "../../config/axiosConfig";
import { toast } from 'react-toastify';

const urlUpdateFees = "utils/updatefees"
const urlFees = "utils/fees"

export default function Fees() {
    const [fees, setFees] = useState([]);

    const {
        register,
    } = useForm({
        mode: "onBlur",
    });

    function fetchFees() {
        axios.get(urlFees)
            .then(response => {
                setFees(response.data[0]);
            })
            .catch(error => {
                toast.error(error);
            })
    }

    useEffect(() => {
        fetchFees();
    }, []);

    function updateFee(newFee, fid) {        
        axios.post(urlUpdateFees, { fid: fid, newFee: parseInt(newFee) })
            .then(response => {
                toast.success('Se cambió la tarifa.');
                setFees(prevFees =>
                    prevFees.map(fee =>
                        fee.id_fee === fid ? { ...fee, amount: newFee } : fee
                    )
                );
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    const handleSubmit2 = (e, fid) => {
        e.preventDefault();
        const newFee = e.target[`amount_${fid}`].value;
        updateFee(newFee, fid);
    };

    return (
            <div className="sistema-container">
                <h1>Consulta y actualización de tarifas:</h1>

                <div className="bajas-modif-main">

                    {
                        fees.length != 0 &&
                        <>

                            {
                                fees.map((fee) => (
                                    <form className="fees_form" key={fee.id_fee} onSubmit={e => handleSubmit2(e, fee.id_fee)}>

                                        <h5>{fee.fee_descr}</h5>
                                        <input type="number" name={`amount_${fee.id_fee}`} min={"0"} defaultValue={fee.amount} {...register(`amount_${fee.id_fee}`)} />
                                        <button type="submit" className="delete-event-button">Modificar</button>

                                    </form>
                                ))
                            }

                        </>
                    }
                </div>
            <NavLink to={"/"} className="info-button" >Volver</NavLink>
            </div>
    )
}