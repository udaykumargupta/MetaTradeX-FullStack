import axios from "axios";
import {
  DISABLE_TWO_FACTOR_AUTH_FAILURE,
  DISABLE_TWO_FACTOR_AUTH_REQUEST,
  DISABLE_TWO_FACTOR_AUTH_SUCCESS,
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  VERIFY_OTP_FAILURE,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
} from "./ActionTypes";

export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });

  const baseUrl = import.meta.env.VITE_API_URL;

  try {
    const response = await axios.post(`${baseUrl}/auth/signup`, userData);

    const user = response.data;
    console.log(user);

    dispatch({ type: REGISTER_SUCCESS, payload: user.jwt });
    localStorage.setItem("jwt", user.jwt);
  } catch (error) {
    dispatch({ type: REGISTER_FAILURE, payload: error.message });
    console.log(error);
  }
};

export const login = (userData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  const baseUrl = import.meta.env.VITE_API_URL;

  try {
    const response = await axios.post(`${baseUrl}/auth/signin`, userData.data);
    const user = response.data;
    console.log(user);

    dispatch({ type: LOGIN_SUCCESS, payload: user.jwt });
    localStorage.setItem("jwt", user.jwt);
    userData.navigate("/");
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: error.message });
    console.log(error);
  }
};

export const getUser = (jwt) => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });

  const baseUrl = import.meta.env.VITE_API_URL;

  try {
    const response = await axios.get(`${baseUrl}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const user = response.data;
    console.log(user);

    dispatch({ type: GET_USER_SUCCESS, payload: user });
  } catch (error) {
    dispatch({ type: GET_USER_FAILURE, payload: error.message });
    console.log(error);
  }
};

// Verify OTP for two-factor authentication
export const verifyOtp = (otp, id) => async (dispatch) => {
  dispatch({ type: VERIFY_OTP_REQUEST });
  const baseUrl = import.meta.env.VITE_API_URL;
  try {
    const response = await axios.post(
      `${baseUrl}/auth/two-factor/otp/${otp}?id=${id}`
    );
    dispatch({ type: VERIFY_OTP_SUCCESS, payload: response.data });
    localStorage.setItem("token", response.data.jwt); // Save JWT to localStorage after successful OTP verification
  } catch (error) {
    dispatch({
      type: VERIFY_OTP_FAILURE,
      payload: error.response.data.message,
    });
  }
};

export const disableTwoFactorAuth = (jwt) => async (dispatch) => {
  dispatch({ type: DISABLE_TWO_FACTOR_AUTH_REQUEST });

  const baseUrl = import.meta.env.VITE_API_URL;

  try {
    const response = await axios.patch(
      `${baseUrl}/api/users/disable-two-factor`,
      {}, // Empty body for this PATCH request
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    // Dispatch success action. The payload can be the success message from the server.
    dispatch({ type: DISABLE_TWO_FACTOR_AUTH_SUCCESS, payload: response.data });
  } catch (error) {
    // Dispatch failure action with the error message.
    dispatch({
      type: DISABLE_TWO_FACTOR_AUTH_FAILURE,
      payload: error.message,
    });
    console.error("Error disabling 2FA:", error);
  }
};

export const logout = () => (dispatch) => {
  localStorage.clear();
  dispatch({ type: LOGOUT });
};
