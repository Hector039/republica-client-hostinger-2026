import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "./assets/logo.jpeg";
import { useUser } from "../context/dataContext";

export default function NavBar() {
	const navigate = useNavigate();
	const { user } = useUser();

	const logout = () => {
		navigate("/logout");
	};

	return (
		<nav className="navbar">
			<div className="navbar-brand">
				<Link to={"/"}>
					<img src={logo} alt="Logo Gimnasio Republica del oeste" />
				</Link>
			</div>

			<div className="navbar-menu">
				{user && user.is_admin === 1 ?
					<>
						<NavLink
							to={"/"}
							className="navbar-item"
							style={({ isActive }) => {
								return { fontWeight: isActive ? "bold" : "" };
							}}
						>
							Inicio
						</NavLink>
						<NavLink
							to={"/administrationusers"}
							className="navbar-item-sistema"
							style={({ isActive }) => {
								return { fontWeight: isActive ? "bold" : "" };
							}}
						>
							Usuarios
						</NavLink>
						<NavLink
							to={"/administrationpayments"}
							className="navbar-item-sistema"
							style={({ isActive }) => {
								return { fontWeight: isActive ? "bold" : "" };
							}}
						>
							Pagos
						</NavLink>
						<NavLink
							to={"/administrationevents"}
							className="navbar-item-sistema"
							style={({ isActive }) => {
								return { fontWeight: isActive ? "bold" : "" };
							}}
						>
							Eventos
						</NavLink>
						<NavLink
							to={"/administrationinscriptions"}
							className="navbar-item-sistema"
							style={({ isActive }) => {
								return { fontWeight: isActive ? "bold" : "" };
							}}
						>
							Inscripciones
						</NavLink>
						<NavLink
							to={"/administrationmerch"}
							className="navbar-item-sistema"
							style={({ isActive }) => {
								return { fontWeight: isActive ? "bold" : "" };
							}}
						>
							Encargues
						</NavLink>
					</>
				:	<>
						<NavLink
							to={"/"}
							className="navbar-item"
							style={({ isActive }) => {
								return { fontWeight: isActive ? "bold" : "" };
							}}
						>
							Inicio
						</NavLink>
					</>
				}
			</div>

			{user && (
				<div className="logout-container-navbar">
					<NavLink
						to={"/"}
						className="button-top-navbar"
						style={({ isActive }) => {
							return { fontWeight: isActive ? "bold" : "" };
						}}
					>
						{user.first_name} {user.last_name}
					</NavLink>
					<button onClick={logout}>Cerrar sesión</button>
				</div>
			)}
		</nav>
	);
}
