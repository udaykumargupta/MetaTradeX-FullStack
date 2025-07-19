// action.js

import axios from "axios";
import {
  FETCH_COIN_DETAILS_REQUEST,
  FETCH_COIN_DETAILS_SUCCESS,
  FETCH_COIN_DETAILS_FAILURE,
} from "./ActionType";

// Action Creator for Fetching Coin Details
export const fetchCoinDetails = (prompt) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_COIN_DETAILS_REQUEST });
    const baseUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.post(`${baseUrl}/ai/chat`, { prompt });
      dispatch({
        type: FETCH_COIN_DETAILS_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: FETCH_COIN_DETAILS_FAILURE,
        payload: error.message,
      });
    }
  };
};
