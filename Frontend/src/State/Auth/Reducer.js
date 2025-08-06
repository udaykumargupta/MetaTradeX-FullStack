import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  GET_USER_REQUEST,
  LOGIN_FAILURE,
  GET_USER_FAILURE,
  LOGIN_SUCCESS,
  GET_USER_SUCCESS,
  LOGOUT,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAILURE,
  DISABLE_TWO_FACTOR_AUTH_REQUEST,
  DISABLE_TWO_FACTOR_AUTH_SUCCESS,
  LOGIN_SUCCESS_2FA,
} from "./ActionTypes";

const initialState = {
  user: null,
  loading: false,
  error: null,
  jwt: null,
  isAuthenticated: false,
  otpEnabled: false,
  sessionId: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case GET_USER_REQUEST:
    case VERIFY_OTP_REQUEST:
    case DISABLE_TWO_FACTOR_AUTH_REQUEST:
      return { ...state, loading: true, error: null };

    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        jwt: action.payload.jwt,
        otpEnabled: false,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        jwt: action.payload.jwt,
        isAuthenticated: true,
        // otpEnabled should be set based on user data if available
        // but for a successful non-2FA login, it should be false
        otpEnabled: false,
        sessionId: null, // Ensure session ID is cleared
      };

    case LOGIN_SUCCESS_2FA: // New case for handling 2FA login
      return {
        ...state,
        loading: false,
        error: null,
        otpEnabled: true,
        sessionId: action.payload.session, // Store the session ID from the backend
      };

    case GET_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        user: action.payload,
        isAuthenticated: true,
        // The user object from the backend should contain `isTwoFactorEnabled`
        otpEnabled: action.payload.isTwoFactorEnabled,
      };

    case VERIFY_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        jwt: action.payload.jwt,
        otpEnabled: false, // 2FA is now verified, no longer 'pending'
        sessionId: null, // Clear the temporary session ID
        error: null,
      };

    case DISABLE_TWO_FACTOR_AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        otpEnabled: false,
        error: null,
      };

    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
    case GET_USER_FAILURE:
    case VERIFY_OTP_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
};

export default authReducer;
