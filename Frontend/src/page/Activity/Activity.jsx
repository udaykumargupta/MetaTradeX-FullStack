import React, { useEffect } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForUser } from "@/State/Order/Action";
import { calculateProfit } from "@/utils/calculateProfit";
import { date } from "zod";
const Activity = () => {
  const dispatch = useDispatch();
  const { order } = useSelector((store) => store);
  useEffect(() => {
    dispatch(getAllOrdersForUser({ jwt: localStorage.getItem("jwt") }));
  }, []);
  return (
    <div className="px-5 lg:px-20">
      <h1 className="font-bold text-3xl pb-5">Activity</h1>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="py-5">DATE & TIME</TableHead>
            <TableHead>TRADING pair</TableHead>
            <TableHead>BUY PRICE</TableHead>
            <TableHead>SELLING PRICE</TableHead>
            <TableHead>ORDER TYPE</TableHead>
            <TableHead className="">PROFIT/LOSS</TableHead>
            <TableHead className="text-right">VALUE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.orders.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <p>{item.timestamp.split("T")[0]}</p>

                <p className="text-gray-400">
                  <p>{item.timestamp.split("T")[1].split(".")[0]}</p>
                </p>
              </TableCell>
              <TableCell className="font-medium flex items-center gap-2">
                <Avatar className="-z-50">
                  <AvatarImage src={item.orderItem.coin.image} />
                </Avatar>
                <span>{item.orderItem.coin.name}</span>
              </TableCell>

              <TableCell>${item.orderItem.buyPrice}</TableCell>
              <TableCell>{item.orderItem.sellPrice}</TableCell>
              <TableCell>{item.orderType}</TableCell>
              <TableCell className="">{calculateProfit(item)}</TableCell>
              <TableCell className="text-right">{item.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Activity;
