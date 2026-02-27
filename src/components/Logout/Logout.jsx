import { useNavigate } from "react-router-dom";
import { useUser } from "../context/dataContext";

export default function Logout() {
	const { setUser } = useUser();

	const navigate = useNavigate();

	function backToHome() {
		setUser(null);
		navigate("/");
	}

	setTimeout(backToHome, 1000);

	return (
		<div className="logout-container">
			<h2>Te esperamos pronto!</h2>
		</div>
	);
}
