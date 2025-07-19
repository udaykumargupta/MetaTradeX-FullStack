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
      return { ...state, loading: true, error: null };

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        jwt: action.payload.jwt,

        otpEnabled: action.payload.isTwoFactorEnabled,
      };

    case GET_USER_SUCCESS:
      return { ...state, loading: false, error: null, user: action.payload ,isAuthenticated: true};

    case VERIFY_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        jwt: action.payload.jwt,
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
