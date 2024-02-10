import {
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  SIGNOUT,
  SIGNUP_SUCCESS,
  SIGNUP_ERROR,
} from "./actionTypes";
import Axios from "axios";

function decodeJWT(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

function getRoleFromToken(token) {
  const decodedToken = decodeJWT(token);
  const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  return role || null;
}


export const signIn = (email, password) => {

  return async (dispatch) => {
    try {
      const response = await Axios.post("http://localhost:5054/api/v1/authenticate/login", {
        email: email,
        password: password
      });

      
      console.log("Login Response:", response);

      if (response && response.data && response.data.accessToken) {
        const token = response.data.accessToken;
        const role = getRoleFromToken(token);
        console.log('Uloga iz tokena:', role);
        localStorage.setItem("userRole", role);
        console.log(token);
        console.log(response.data.userId)
        localStorage.setItem("jwtToken", token);

        localStorage.setItem("currentUser", response.data.userId)

        dispatch({ type: LOGIN_SUCCESS, payload: token });
      } else {
        dispatch({ type: LOGIN_ERROR, error: 'Token not found in response data' });
      }
    } catch (error) {
      dispatch({ type: LOGIN_ERROR, error: error.message });
    }
  };
};







export const signUp = (credentials) => {
  return async (dispatch) => {
    try {
    
      const { email, username, fullName, password, confirmPassword } = credentials;
      console.log(email);
      console.log(username)
     
      const result = await Axios.post("http://localhost:5054/api/v1/authenticate/register", {
        email,
        username,
        fullName,
        password,
        confirmPassword,
      });

     
      dispatch({ type: SIGNUP_SUCCESS, payload: result.data });
    } catch (error) {
      dispatch({ type: SIGNUP_SUCCESS, error });
    }
  };
};

export const signOut = () => {

  localStorage.setItem("userRole", "user");
 

  return (dispatch) => {
    dispatch({ type: SIGNOUT });
  };
};
