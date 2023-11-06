import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import OnBoarding from "./pages/OnBoarding";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useCookies } from "react-cookie";
import EditProfile from "./pages/EditProfile";
import AdminPage from "./pages/AdminPanel";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const authToken = cookies.AuthToken;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {authToken && <Route path="/dashboard" element={<Dashboard />} />}
        {authToken && <Route path="/onboarding" element={<OnBoarding />} />}
        {authToken && <Route path="/edit-profile" element={<EditProfile />} />}
        {authToken && <Route path="/admin" element={<AdminPage />} />}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
