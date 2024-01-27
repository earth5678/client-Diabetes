import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Singup";
import Login from "./components/Login";


function App() {

	const isLoggedIn = localStorage.getItem('user:token') !== null || false;

	return (
		<Routes>
			{isLoggedIn && <Route path="/"/>}
			<Route path="/Main" exact element={<Main />} />
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/" element={<Navigate replace to="/" />} />
		</Routes>
	);
}

export default App;
