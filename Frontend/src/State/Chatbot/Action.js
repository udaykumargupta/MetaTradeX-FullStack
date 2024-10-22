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

    try {
      const response = await axios.post("http://localhost:5454/ai/chat", { prompt });
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
