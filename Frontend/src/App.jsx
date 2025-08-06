import { Route, Routes } from "react-router-dom";
import Home from "./page/home/Home";
import Navbar from "./page/Navbar/Navbar";
import Portfolio from "./page/Portfolio/Portfolio";
import Wallet from "./page/Wallet/Wallet";
import Withdrawal from "./page/Withdrawal/Withdrawal";
import PaymentDetails from "./page/PaymentDetails/PaymentDetails";
import Watchlist from "./page/Watchlist/Watchlist";
import StockDetails from "./page/StockDetails/StockDetails";
import Profile from "./page/Profile/Profile";
import SearchCoin from "./page/Search/SearchCoin";
import NotFound from "./page/NotFound/NotFound";
import Activity from "./page/Activity/Activity";
import Auth from "./page/Auth/Auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./State/Auth/Action";
import ForgotPasswordForm from "./page/Auth/ForgotPasswordForm";
import ResetPasswordForm from "./page/Auth/ResetPasswordForm";
import TwoFactorAuthForm from "./page/Profile/TwoFactorAuthForm";


function App() {
  const { auth } = useSelector(store => store);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser(auth.jwt || localStorage.getItem("jwt")));
  }, [auth.jwt]);

  return (
    <>
      {auth.user ? (
        // --- PROTECTED ROUTES ---
        // These pages are only for logged-in users.
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/withdrawal" element={<Withdrawal />} />
            <Route path="/payment-details" element={<PaymentDetails />} />
            <Route path="/market/:id" element={<StockDetails />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<SearchCoin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      ) : (
        // --- PUBLIC ROUTES ---
        // These pages are for users who are NOT logged in.
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="/two-factor-auth" element={<TwoFactorAuthForm />} />
          {/* If a non-logged-in user tries any other URL, show the Auth page */}
          <Route path="*" element={<Auth />} />
        </Routes>
      )}
    </>
  );
}

export default App;
