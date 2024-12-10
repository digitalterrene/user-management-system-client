"use client";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Rings } from "react-loader-spinner";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });
  let localStorage;
  let _user_;
  if (typeof window !== "undefined") {
    localStorage = window.localStorage;
    _user_ = JSON.parse(localStorage.getItem("user"));
  }

  useEffect(() => {
    if (_user_) {
      dispatch({ type: "LOGIN", payload: _user_ });
    }
  }, [loading === true]);
  return (
    <div className={` ${loading ? "bg-gray-200 w-screen h-screen" : ""} `}>
      <AuthContext.Provider value={{ ...state, dispatch }}>
        {loading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Rings
              visible={true}
              height="80"
              className="mt-[50%] "
              width="80"
              color="#0D99FF"
              ariaLabel="rings-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            <img className="w-32" src="/branding/logo.png" />
          </div>
        ) : (
          <>{children}</>
        )}
      </AuthContext.Provider>
    </div>
  );
};

export const useAuthContext = () => useContext(AuthContext);
