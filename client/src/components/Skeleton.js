// other imports
import { useEffect, useState } from "react";
import { Outlet } from "react-router";

// Custom Component Import
import Footer from "./Footer";
import Header from "./Header";

// helper/utils import
import browserActions from "../utils/browserActions";
import auth from "../utils/auth";

const Skeleton = () => {
  // store/fetch token from local storage
  const [token, setToken] = useState(
    () => browserActions.getLocalStorage("token") || null
  );
  const [user, setUser] = useState(null);

  useEffect(() => {
    /**
     * Code to implement remember me functionality
     * If there is expiry key in localStoarage
     * then check if the difference between current time
     * and time when we last login is negative or not.
     * [-ve] : logout()
     * [+ve] : do nothing
     */
    const expiry = browserActions.getLocalStorage("expiry");
    if (expiry) {
      const current = new Date();
      const old = new Date(Number(expiry));
      if (
        (current.getDate() === old.getDate() &&
          current.getHours() > old.getHours()) ||
        current.getDate() > old.getDate()
      ) {
        logout();
      }
    }

    /**
     * at each render check if token is present
     * if present then check if user is present
     * if not present then authenticate user using token and set user
     */
    if (!user && token) {
      const params = {
        token: token,
      };
      auth
        .post("/api/v1/auth", params)
        .then((res) => {
          const { userId, name } = res.data;
          setUser({ userId, name });
        })
        .catch((err) => {
          logout();
        });
    }
  });

  /**
   * @description - at login setToken to the token received from server
   */
  const login = (token) => {
    setToken(token);
  };

  /**
   * @description - at logout remove token from localStorage, set user to null
   */
  const logout = () => {
    browserActions.removeLocalStorage("token");
    browserActions.removeLocalStorage("type");
    setToken(null);
    setUser(null);
  };

  return (
    <>
      <Header context={[user, login, logout]} />
      {/* USING Outlet component and useOutletContext from react-router hook to 
                send and receive data in child components of skeleton, 
                as we are using nested routes here*/}
      <Outlet context={[token, user, login, logout]} />
      <Footer />
    </>
  );
};

export default Skeleton;
