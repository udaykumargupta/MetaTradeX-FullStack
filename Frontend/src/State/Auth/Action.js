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
  LOGIN_SUCCESS_2FA,
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
    console.log("Login response:", user);

    // This is the new logic to handle 2FA
    if (user.twoFactorAuthEnabled) {
      dispatch({ type: LOGIN_SUCCESS_2FA, payload: user.session });
      // Store the session ID in sessionStorage
      sessionStorage.setItem("sessionId", user.session);
      userData.navigate("/two-factor-auth");
    } else {
      // If 2FA is disabled, proceed with normal login
      dispatch({ type: LOGIN_SUCCESS, payload: user.jwt });
      localStorage.setItem("jwt", user.jwt);
      userData.navigate("/");
    }
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
export const verifyOtp = (userData) => async (dispatch) => {
  dispatch({ type: VERIFY_OTP_REQUEST });
  const baseUrl = import.meta.env.VITE_API_URL;

  try {
    // Retrieve the session ID from Redux state or sessionStorage
    const sessionId = userData.id || sessionStorage.getItem("sessionId");
    console.log("Session ID retrieved:", sessionId);
    if (!sessionId) {
      throw new Error("Session ID is missing. Please log in again.");
    }

    const response = await axios.post(
      `${baseUrl}/auth/two-factor/otp/${userData.otp}?id=${sessionId}`
    );

    const user = response.data;

    dispatch({ type: VERIFY_OTP_SUCCESS, payload: user });
    localStorage.setItem("jwt", user.jwt);
    sessionStorage.removeItem("sessionId");
    userData.navigate("/");
  } catch (error) {
    dispatch({
      type: VERIFY_OTP_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
    console.log(error);
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
  sessionStorage.clear();
  dispatch({ type: LOGOUT });
};
