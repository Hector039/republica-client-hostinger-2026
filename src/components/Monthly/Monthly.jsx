import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../config/axiosConfig";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";

const date = new Date();

const urlMonthlyCLubInfo = "utils/monthlyclub/"
const urlMonthlyMonthlyInfo = "utils/monthly/"
const urlMonthlyAnnualInfo = "utils/monthlyannual/"
const urlMonthlyInscriptionsInfo = "utils/monthlyinscriptions/"
const urlMonthlyRequestsInfo = "utils/monthlyrequests/"
const urlMonthlyExpendituresInfo = "utils/monthlyexpenditures/"
const urlMonthlyIncomeInfo = "utils/monthlyincome/"
const urlInfo = "utils/getmonthgridinfo/"

export default function Monthly() {

    const today = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0");

    const [totalExpenditures, setTotalExpenditures] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalMonth, setTotalMonth] = useState(0)

    const [clubInfo, setClubInfo] = useState([])
    //const [monthlyInfo, setMonthlyInfo] = useState([])
    const [annualInfo, setAnnualInfo] = useState([])
    const [inscriptionInfo, setInscriptionInfo] = useState([])
    const [requestsInfo, setRequestsInfo] = useState([])
    const [expendituresInfo, setExpendituresInfo] = useState([])
    const [incomeInfo, setIncomeInfo] = useState([])
    
    const [info, setInfo] = useState([])

    const {
        register,
        handleSubmit
    } = useForm({
        mode: "onBlur",
    });

    function getInfo(month) {
        axios.get(urlInfo + month)
            .then(response => {
                setInfo(response.data);
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    function getClubInfo(month) {
        axios.get(urlMonthlyCLubInfo + month)
            .then(response => {
                setClubInfo(response.data);
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    function getMonthlyInfo(month) {
        axios.get(urlMonthlyMonthlyInfo + month)
            .then(response => {
                //setMonthlyInfo(response.data);
                updateTotal(response.data)
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    function getAnnualInfo(month) {
        axios.get(urlMonthlyAnnualInfo + month)
            .then(response => {
                setAnnualInfo(response.data);
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    function getInscriptionInfo(month) {
        axios.get(urlMonthlyInscriptionsInfo + month)
            .then(response => {
                setInscriptionInfo(response.data);
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    function getRequestsInfo(month) {
        axios.get(urlMonthlyRequestsInfo + month)
            .then(response => {
                setRequestsInfo(response.data);
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    function getExpendituresInfo(month) {
        axios.get(urlMonthlyExpendituresInfo + month)
            .then(response => {
                setExpendituresInfo(response.data);
                const total = response.data.reduce((acc, item) => acc + parseInt(item.amount), 0);
                setTotalExpenditures(total)
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    
    function getIncomeInfo(month) {
        axios.get(urlMonthlyIncomeInfo + month)
            .then(response => {
                setIncomeInfo(response.data);
                const total = response.data.reduce((acc, item) => acc + parseInt(item.amount), 0);
                setTotalIncome(total)
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    function updateTotal(data) {
        const total = data.reduce((acc, item) => acc + parseInt(item.total), 0);
        setTotalMonth(prev => prev + total);
    }

    function getMonthTotalInfo(e) {
        setTotalMonth(0);

        getClubInfo(e.month);
        getMonthlyInfo(e.month);
        getAnnualInfo(e.month);
        getInscriptionInfo(e.month);
        getRequestsInfo(e.month);
        getExpendituresInfo(e.month);
	getIncomeInfo(e.month);

        getInfo(e.month);
    }

    return (
        <div className="cuenta-main">

            <h1>Consulta de caja mensual:</h1>
            <form onSubmit={handleSubmit(getMonthTotalInfo)} className="checkout-form">
                <input type="month" id="month" name="month" defaultValue={today} {...register("month", { required: true })} />
                <button type="submit" className="cuenta-button" >Consultar</button>
            </form>

            {totalMonth > 0 &&
                <table className="table_balance">
                    <thead>
                        <tr>
                            <th>Total cuotas</th>
                            <th>Ingresos</th>
                            <th>Egresos</th>
                            <th>Balance del Mes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr >
                            <th>{totalMonth}</th>
			    <th>{totalIncome}</th>
                            <th>{totalExpenditures}</th>
                            <th>{totalMonth + totalIncome - totalExpenditures}</th>
                        </tr>
                    </tbody>
                </table>}

            <h2>Club República:</h2>
            {
                clubInfo.length === 0 ? <p className="info-text-register">Sin datos</p> :
                    <table>
                        <thead>
                            <tr>
                                <th>Registros</th>
                                <th>Tarifa</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr >
                                <th>{clubInfo[0].cantidad}</th>
                                <th>{clubInfo[0].tarifa}</th>
                                <th>{clubInfo[0].total}</th>
                            </tr>
                        </tbody>

                    </table>
            }
            <section className="cuenta-info">

                <h2>Matrícula anual:</h2>
                {annualInfo.length === 0 ? <p className="info-text-register">Sin datos</p> :

		<table>
                        <thead>
                            <tr>
                                <th>Registros</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr >
                                <th>{annualInfo[0].cantidad}</th>
                                <th>{annualInfo[0].total}</th>
                            </tr>
                        </tbody>
                    </table>}

                <h2>Inscripciones a eventos:</h2>
                {inscriptionInfo.length === 0 ? <p className="info-text-register">Sin datos</p> :
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                inscriptionInfo.map((insc) => (
                                    <tr key={insc.registros}>
                                        <th>{new Date(insc.pay_date).toLocaleDateString('en-GB', {timeZone: 'UTC'})}</th>
                                        <th>{insc.total}</th>
                                        <th></th>
                                    </tr>
                                ))
                            }

                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th></th>
                                <th>${(inscriptionInfo.reduce((acumulador, item) => acumulador + item.total, 0))}</th>
                            </tr>
                        </tfoot>
                    </table>}
                <h2>Solicitudes de indumentaria:</h2>
                {requestsInfo.length === 0 ? <p className="info-text-register">Sin datos</p> :
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                requestsInfo.map((merch) => (
                                    <tr key={merch.registros}>
                                        <th>{new Date(merch.pay_date).toLocaleDateString('en-GB', {timeZone: 'UTC'})}</th>
                                        <th>{merch.total}</th>
                                        <th></th>
                                    </tr>
                                ))
                            }

                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th></th>
                                <th>${(requestsInfo.reduce((acumulador, item) => acumulador + item.total, 0))}</th>
                            </tr>
                        </tfoot>
                    </table>}
                <h2>Egresos:</h2>
                {expendituresInfo.length === 0 ? <p className="info-text-register">Sin datos</p> :
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Descripción</th>
                                <th>Monto</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                expendituresInfo.map((exp) => (
                                    <tr key={exp.id_exp}>
                                        <th>{new Date(exp.pay_date).toLocaleDateString('en-GB', {timeZone: 'UTC'})}</th>
                                        <th>{exp.descr}</th>
                                        <th>{exp.amount}</th>
                                        <th></th>
                                    </tr>
                                ))
                            }

                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>${(expendituresInfo.reduce((acumulador, item) => acumulador + item.amount, 0))}</th>
                            </tr>
                        </tfoot>
                    </table>}

		    
                    <h2>Ingresos:</h2>
                {incomeInfo.length === 0 ? <p className="info-text-register">Sin datos</p> :
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Descripción</th>
                                <th>Monto</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                incomeInfo.map((inc) => (
                                    <tr key={inc.id_inc}>
                                        <th>{new Date(inc.pay_date).toLocaleDateString('en-GB')}</th>
                                        <th>{inc.descr}</th>
                                        <th>{inc.amount}</th>
                                        <th></th>
                                    </tr>
                                ))
                            }

                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>${(incomeInfo.reduce((acumulador, item) => acumulador + item.amount, 0))}</th>
                            </tr>
                        </tfoot>
                    </table>}

                    <h2>Grilla por días:</h2>
                    {info.length === 0 ? <p className="info-text-register">Sin datos</p> :
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Ingresó</th>
                                <th>Egresó</th>
                                <th>Balance</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                info.map((grid) => (
                                    <tr key={grid.id}>
                                        <th>{new Date(grid.day).toLocaleDateString('en-GB', {timeZone: 'UTC'})}</th>
                                        <th>{grid.totalIn}</th>
                                        <th>{grid.totalOut}</th>
                                        <th>{grid.total}</th>
                                        <th></th>
                                    </tr>
                                ))
                            }

                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>${(info.reduce((acumulador, item) => acumulador + item.total, 0))}</th>
                            </tr>
                        </tfoot>
                    </table>}
            </section>
            <Link to={"/"} className="info-button">Volver</Link>
        </div>
    )
}
