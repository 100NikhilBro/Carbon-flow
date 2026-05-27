import {
  createContext,
  useState,
  ReactNode,
} from "react";

interface AuthContextType {

  isAuthenticated: boolean;

  login: (
    access: string,
    refresh: string
  ) => void;

  logout: () => void;
}

export const AuthContext =
  createContext<AuthContextType | null>(
    null
  );

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: Props) => {

  const [
    isAuthenticated,

    setIsAuthenticated

  ] = useState(

    !!localStorage.getItem(
      "access_token"
    )
  );

  const login = (
    access: string,
    refresh: string
  ) => {

    localStorage.setItem(
      "access_token",
      access
    );

    localStorage.setItem(
      "refresh_token",
      refresh
    );

    setIsAuthenticated(true);
  };

  const logout = () => {

    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "refresh_token"
    );

    setIsAuthenticated(false);
  };

  return (

    <AuthContext.Provider
      value={{

        isAuthenticated,

        login,

        logout,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
};