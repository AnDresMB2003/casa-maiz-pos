import {
  useState,
} from "react";

import axios from "axios";

import {
  AuthContext,
} from "./authContext";

function AuthProvider({
  children,
}) {

  const [token, setToken] =
    useState(() => {

      return localStorage.getItem(
        "token"
      );

    });

  const [user, setUser] =
    useState(() => {

      const savedUser =
        localStorage.getItem(
          "user"
        );

      if (!savedUser) return null;

      try {
        return JSON.parse(
          savedUser
        );
      } catch (error) {
        console.error(
          "Error parsing user from localStorage:",
          error
        );
        localStorage.removeItem(
          "user"
        );
        return null;
      }

    });

  async function login(
    email,
    password
  ) {

    try {

      const response =
        await axios.post(
          "http://localhost:4000/api/auth/login",
          {
            email,
            password,
          }
        );

      const data =
        response.data;

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          data.user
        )
      );

      setToken(
        data.token
      );

      setUser(
        data.user
      );

      return {
        success: true,
      };

    } catch (error) {

      return {
        success: false,
        message:
          error.response?.data
            ?.error ||
          "Error al iniciar sesión",
      };
    }
  }

  function logout() {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    setToken(null);

    setUser(null);
  }

  return (

    <AuthContext.Provider
      value={{

        user,
        token,
        login,
        logout,

      }}
    >

      {children}

    </AuthContext.Provider>
  );
}

export {
  AuthProvider,
};