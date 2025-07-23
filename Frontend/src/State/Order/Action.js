import api from "@/config/api";
import * as types from "./ActionType";

export const payOrder =
  ({ jwt, orderData, amount, handleClose }) =>
  async (dispatch) => {
    dispatch({ type: types.PAY_ORDER_REQUEST });

    try {
      const response = await api.post("/api/orders/pay", orderData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      dispatch({
        type: types.PAY_ORDER_SUCCESS,
        payload: response.data,
        amount,
      });

      // Call handleClose only after the API call is successful
      if (handleClose) {
        handleClose();
      }

      console.log("order success", response.data);
    } catch (error) {
      console.log("error", error);
      dispatch({
        type: types.PAY_ORDER_FAILURE,
        error: error.message,
      });
    }
  };

// export const getOrderById=({jwt,orderData,amount})=>async(dispatch)=>{
//     dispatch({type:types.PAY_ORDER_REQUEST});

//     try {
//         const response=await api.post('/api/orders/pay',orderData,{
//             headers:{
//                 Authorization:`Bearer ${jwt}`
//             },
//         });

//         dispatch({
//             type:types.PAY_ORDER_SUCCESS,
//             payload:response.data,
//             amount
//         });
//         console.log("order success",response.data)

//     }catch(error){
//         console.log("error",error)
//         dispatch({
//             type:types.PAY_ORDER_FAILURE,
//             error:error.message,
//         });
//     }
// };

export const getAllOrdersForUser =
  ({ jwt, orderType, assetSymbol }) =>
  async (dispatch) => {
    dispatch({ type: types.GET_ALL_ORDER_REQUEST });

    try {
      const response = await api.get("/api/orders", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        params: {
          order_type: orderType,
          asset_symbol: assetSymbol,
        },
      });

      dispatch({
        type: types.GET_ALL_ORDER_SUCCESS,
        payload: response.data,
      });
      console.log("order success", response.data);
    } catch (error) {
      console.log("error", error);
      dispatch({
        type: types.GET_ALL_ORDER_FAILURE,
        error: error.message,
      });
    }
  };
