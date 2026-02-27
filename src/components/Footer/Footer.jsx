import { Link } from "react-router-dom";
import PhoneIcon from "./assets/icon-phone.svg";
import LocationIcon from "./assets/icon-location.svg";
import LogoFooter from "../NavBar/assets/logo.jpeg";
import FacebookIcon from "./assets/facebook-icon.jpg";
import InstagramIcon from "./assets/instagram-icon.jpg";
import WhatsappIcon from "./assets/WhatsApp.svg.png";

export default function Footer() {
    return (
        <footer className="footer-bar">
            <div className="footer-main">

                <div className="contacto-footer">
                    <div className="contacto">
                        <div className="iconos_footer">
                            <img src={PhoneIcon} alt="icono teléfono" />
                        </div>
                        <div>
                            <p className="text-title">Teléfono:</p>
                            <p className="text-white">3425462491</p>
                        </div>
                    </div>
                    <div className="contacto">
                        <div className="iconos_footer">
                            <img src={LocationIcon} alt="icono Ubicación" />
                        </div>
                        <div>
                            <p className="text-title">Club República del Oeste:</p>
                            <p className="text-white">Avenida freyre 2765, Santa Fe Capital</p>
                        </div>
                    </div>
                    <div className="footer-networks">
                        <Link to={"https://www.instagram.com/gym_republicadeloeste/"} target="_blank" rel="noreferrer" className="network-icon">
                            <img src={InstagramIcon} alt="Instagram Icono" />
                        </Link>
                        <Link to={"https://wa.me/5493425462491"} target="_blank" rel="noreferrer" className="network-icon">
                            <img src={WhatsappIcon} alt="Whatsapp Icono" />
                        </Link>

                    </div>
                </div>

                
                <div className="footer-brand">
                    <Link to={"/"}>
                        <img src={LogoFooter} alt="Tienda Logo" />
                    </Link>

                </div>


                
            </div>

            <div className="footer-rights">
                <p>2025 / Desarrollado por HM</p>
            </div>

        </footer>
    )
}