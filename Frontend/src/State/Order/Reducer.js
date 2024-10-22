import * as types from "./ActionType";

const initialState = {
  order: null,
  orders: [],
  loading: false,
  error: null,
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.PAY_ORDER_REQUEST:
    case types.GET_ORDER_REQUEST:
    case types.GET_ALL_ORDER_REQUEST:
      return { ...state, loading: true, error: null };

    case types.PAY_ORDER_SUCCESS:
    case types.GET_ORDER_SUCCESS:
      return {
        ...state,
        order: action.payload,
        loading: false,
        error: null,
      };
    case types.GET_ALL_ORDER_SUCCESS:
      return {
        ...state,
        orders: action.payload,
        loading: false,
        error: null,
      };
    case types.PAY_ORDER_FAILURE:
    case types.GET_ORDER_FAILURE:
    case types.GET_ALL_ORDER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default orderReducer;
