import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAssetDetails } from "@/State/Asset/Action";
import { payOrder } from "@/State/Order/Action";
import { getUserWallet } from "@/State/Wallet/Action";
import { DotIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const TradingForm = () => {
  const [orderType, setOrderType] = useState("BUY");
  const [amount,setAmount]=useState(0);
  const [quantity,setQuantity]=useState(0);
  const {coin,wallet,asset}=useSelector(store=>store);
  const dispatch=useDispatch();
  const handleChange = (e) => {
    const amount=e.target.value;
    setAmount(amount)
    const volume=calculateBuyCost(amount,coin.coinDetails.market_data.current_price.usd);
    setQuantity(volume);
  };
  const calculateBuyCost = (amount, price) => {
    let volume=amount/price 

    let decimalPlaces=Math.max(2,price.toString().split(".")[0].length)
    return volume.toFixed(decimalPlaces);
  }

  useEffect(()=>{
    dispatch(getUserWallet(localStorage.getItem("jwt")));
    dispatch(getAssetDetails({coinId:coin.coinDetails.id,jwt:localStorage.getItem("jwt"),

    }))
  },[])
  const handleBuyCrypto=()=>{
    dispatch(
      payOrder({jwt:localStorage.getItem("jwt"),
        amount,
        orderData:{
          coinId:coin.coinDetails?.id,
          quantity,
          orderType
        }
      })
    )
  }
  return (
    <div className="space-y-10 p5">
      <div>
        <div className="flex gap-4 items-center justify-between">
          <Input
            className="py-7 focus:outline-none"
            placeholder="Enter Amount...."
            onChange={handleChange}
            type="number"
            name="amount"
          ></Input>
          <div>
            <p className="border text-2xl justify-center items-center w-36 h-14 rounded-md">
              {quantity}
            </p>
          </div>
        </div>
        {false && (
          <h1 className="text-red-600 text-center pt-4">
            Insufficient wallet balance to buy
          </h1>
        )}
      </div>

      <div className="flex gap-5 items-center">
        <div>
          <Avatar>
            <AvatarImage
              src={
                "https://cdn.pixabay.com/photo/2021/05/24/09/15/ethereum-logo-6278329_960_720.png"
              }
            ></AvatarImage>
          </Avatar>
        </div>
        <div>
          <div className="flex  items-center gap-2">
            <p>BTC</p>
            <DotIcon className="text-gray-400"></DotIcon>
            <p className="text-gray-400">Bitcoin</p>
          </div>
          <div className="flex  items-end gap-2">
            <p className="text-xl font-bold">${coin.coinDetails?.market_data.current_price.usd}</p>
            <p className="text-red-600">
              <span>-131342425.434</span>
              <span>(-0.423443%)</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p>Order Type</p>
        <p>Market Order</p>
      </div>
      <div className="flex items-center justify-between">
        <p>{orderType == "BUY" ? "Available Cashe" : "Available Quantity"}</p>
        <p>{orderType == "BUY" ? "$"+ wallet.userWallet?.balance : asset.assetDetails?.quantity || 0}</p>
      </div>

      <div>
        <Button onClick={handleBuyCrypto}
          className={`w-full py-6 ${
            orderType == "SELL" ? "bg-red-600 text-white" : ""
          }`}
        >
          {orderType}
        </Button>
        <Button
          variant="links"
          className="w-full mt-5 text-xl "
          onClick={() => setOrderType(orderType == "BUY" ? "SELL" : "BUY")}
        >
          {orderType == "BUY" ? "Or Sell" : "Or Buy"}
        </Button>
      </div>
    </div>
  );
};

export default TradingForm;
