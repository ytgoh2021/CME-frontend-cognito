import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const HomePage = () => {
  const { accessToken: token } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (token === null) {
      navigate("/login");
    } else {
      navigate("/products");
    }
  }, [token]);

  return <></>;
};

export default HomePage;
