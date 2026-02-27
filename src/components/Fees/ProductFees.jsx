import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import axios from "../../config/axiosConfig";
import { toast } from "react-toastify";

const urlUpdatePrice = "utils/updateprice/";
const urlGetProducts = "utils/getproducts/";
const urlNewProduct = "utils/newproduct/";
const urlDeleteProduct = "utils/deleteproduct/";

export default function ProductFees() {
	const [products, setProducts] = useState([]);

	const { register } = useForm({
		mode: "onBlur",
	});

	const {
		register: register4,
		handleSubmit: handleSubmit4,
		reset,
	} = useForm({
		mode: "onBlur",
	});

	function fetchProducts() {
		axios
			.get(urlGetProducts)
			.then((response) => {
				setProducts(response.data[0]);
			})
			.catch((error) => {
				toast.error(error);
			});
	}

	useEffect(() => {
		fetchProducts();
	}, []);

	function updatePrice(e, pid) {
		e.preventDefault();
		const newPrice = e.target[`amount_${pid}`].value;
		axios
			.post(urlUpdatePrice, { pid: pid, newPrice: parseInt(newPrice) })
			.then((response) => {
				toast.success("Se cambió el precio.");
				fetchProducts();
			})
			.catch((error) => {
				console.log(error);
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
			});
	}

	const handleSubmit2 = (e, pid) => {
		e.preventDefault();
		const newPrice = e.target[`amount_${pid}`].value;
		updatePrice(newPrice, pid);
	};

	function deleteProduct(pid) {
		axios
			.delete(urlDeleteProduct + pid)
			.then((response) => {
				toast.success("Se eliminó el producto.");
				fetchProducts();
			})
			.catch((error) => {
				console.log(error);
				toast.error("Ocurrió un error inesperado. Intenta de nuevo");
			});
	}

	function newProduct(e) {
		axios
			.post(urlNewProduct, {
				title: e.title,
				price: e.amount,
			})
			.then((response) => {
				toast.success("Se registró el producto.");
				reset();
				fetchProducts();
			})
			.catch((error) => {
				console.log(error);
				toast.error("Ocurrió un error inesperado");
			});
	}

	return (
		<div className="sistema-container">
			<h1>Consulta y actualización de productos:</h1>
			<h2>Nuevo producto:</h2>
			<form onSubmit={handleSubmit4(newProduct)} className="checkout-form">
				<input
					type="text"
					name="title"
					placeholder="Nombre del producto"
					{...register4("title", { required: true })}
				/>
				<input
					type="number"
					name="amount"
					min={"0"}
					defaultValue={0}
					placeholder="Monto"
					{...register4("amount", { required: true })}
				/>
				<button type="submit" className="cuenta-button-egreso">
					Crear
				</button>
			</form>

			<div className="bajas-modif-main">
				{products.length < 0 ?
					<p>Aún no hay productos</p>
				:	<div>
						{products.map((product) => (
							<form
								className="product_form"
								key={product.id_product}
								onSubmit={(e) => updatePrice(e, product.id_product)}
							>
								<h5>{product.title}</h5>
								<input
									type="number"
									name={`amount_${product.id_product}`}
									min={"0"}
									defaultValue={product.price}
								/>
								<button type="submit" className="delete-event-button">
									Modificar
								</button>

								<button
									type="button"
									className="delete-event-button"
									onClick={() => {
										deleteProduct(product.id_product);
									}}
								>
									Borrar
								</button>
							</form>
						))}
					</div>
				}
			</div>
			<NavLink to={"/"} className="info-button">
				Volver
			</NavLink>
		</div>
	);
}
