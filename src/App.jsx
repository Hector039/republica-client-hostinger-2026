import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./components/context/dataContext";
import MasInfo from "./components/MasInfo/MasInfo";
import Forgot from "./components/Forgot/Forgot";
import Logout from "./components/Logout/Logout";
import NavBar from "./components/NavBar/NavBar";
import UpdateUser from "./components/UpdateUser/UpdateUser";
import { ToastContainer } from "react-toastify";
import PassRestoration from "./components/Forgot/PassRestoration";
import Users from "./components/Users/Users";
import UpdateMerchRequest from "./components/UpdateMerchRequest/UpdateMerchRequest";
import AdminNotifications from "./components/AdminNotifications/AdminNotifications";
import SystemUsers from "./components/SystemUsers/SystemUsers";
import SystemEvents from "./components/System/SystemEvents";
import SystemInscriptions from "./components/System/SystemInscriptions";
import SystemMerch from "./components/System/SystemMerch";
import UpdateEvent from "./components/System/UpdateEvent";
import SystemPayments from "./components/System/SystemPayments";
import SystemDebtors from "./components/System/SystemDebtors";
import UserPaymentsHistory from "./components/System/UserPaymentsHistory";
import Footer from "./components/Footer/Footer";
import Fees from "./components/Fees/Fees";
import Daily from "./components/Daily/Daily";
import DebtorPaymentsHistory from "./components/System/DebtorPaymentsHistory";
import Monthly from "./components/Monthly/Monthly";
import DailyElectronic from "./components/Daily/DailyElectronic";
import MonthlyElectronic from "./components/Monthly/MonthlyElectronic";
import ProductFees from "./components/Fees/ProductFees";

export default function App() {
	return (
		<UserProvider>
			<BrowserRouter basename="/">
				<NavBar />
				<Routes>
					<Route exact path={"/"} element={<Users />} />
					<Route exact path={"/masinfo"} element={<MasInfo />} />
					<Route
						exact
						path={"/updatemerchrequest/:mid"}
						element={<UpdateMerchRequest />}
					/>
					<Route exact path={"/updateuser"} element={<UpdateUser />} />
					<Route exact path={"/forgot/:uid"} element={<Forgot />} />
					<Route exact path={"/passrestoration"} element={<PassRestoration />} />
					<Route exact path={"/logout"} element={<Logout />} />

					<Route exact path={"/administrationusers"} element={<SystemUsers />} />
					<Route exact path={"/administrationevents"} element={<SystemEvents />} />
					<Route exact path={"/updateevent/:eid"} element={<UpdateEvent />} />
					<Route exact path={"/fees"} element={<Fees />} />
					<Route exact path={"/productfees"} element={<ProductFees />} />
					<Route
						exact
						path={"/administrationinscriptions"}
						element={<SystemInscriptions />}
					/>
					<Route exact path={"/administrationmerch"} element={<SystemMerch />} />
					<Route
						exact
						path={"/administrationpayments"}
						element={<SystemPayments />}
					/>
					<Route exact path={"/daily"} element={<Daily />} />
					<Route exact path={"/dailyelectronic"} element={<DailyElectronic />} />
					<Route exact path={"/monthly"} element={<Monthly />} />
					<Route exact path={"/monthlyelectronic"} element={<MonthlyElectronic />} />
					<Route exact path={"/administrationdebtors"} element={<SystemDebtors />} />
					<Route
						exact
						path={"/userpaymentshistory"}
						element={<UserPaymentsHistory />}
					/>
					<Route
						exact
						path={"/debtorpaymentshistory/:uid"}
						element={<DebtorPaymentsHistory />}
					/>

					<Route
						exact
						path={"/adminnotifications"}
						element={<AdminNotifications />}
					/>
				</Routes>
				<Footer />
			</BrowserRouter>

			<ToastContainer
				position="bottom-center"
				autoClose={1500}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover={false}
				theme="colored"
			/>
		</UserProvider>
	);
}
