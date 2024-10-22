// reducer.js

import {
    FETCH_COIN_DETAILS_REQUEST,
    FETCH_COIN_DETAILS_SUCCESS,
    FETCH_COIN_DETAILS_FAILURE,
  } from "./ActionType";
  
  // Initial state
  const initialState = {
    loading: false,
    response: null,
    error: null,
  };
  
  // Reducer function
  export const chatboxReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_COIN_DETAILS_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case FETCH_COIN_DETAILS_SUCCESS:
        return {
          ...state,
          loading: false,
          response: action.payload,
          error: null,
        };
      case FETCH_COIN_DETAILS_FAILURE:
        return {
          ...state,
          loading: false,
          response: null,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  export default chatboxReducer;
  