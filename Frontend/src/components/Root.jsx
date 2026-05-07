import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../store/authStore";
function Root() {
  const checkAuth = useAuth((state) => state.checkAuth);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <div>
      <Header />
      <div className="min-h-screen mx-32">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Root;