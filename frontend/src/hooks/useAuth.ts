import { useNavigate } from "react-router-dom";


export const useAuth = () => {

  const navigate =
    useNavigate();


  const login = (

    accessToken: string,

    refreshToken: string
  ) => {

    // SAVE TOKENS

    localStorage.setItem(

      "access_token",

      accessToken
    );

    localStorage.setItem(

      "refresh_token",

      refreshToken
    );
  };


  const logout = () => {

    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "refresh_token"
    );

    navigate("/login");
  };


  const isAuthenticated =
    () => {

      return !!localStorage.getItem(
        "access_token"
      );
    };


  return {

    login,

    logout,

    isAuthenticated,
  };
};