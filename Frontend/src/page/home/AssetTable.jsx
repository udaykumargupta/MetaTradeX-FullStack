import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


const AssetTable = ({coin, category}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Table>
      <ScrollArea className={`${category=="all"?" h-[75vh]":"h-[75vh]"}`}>
      <TableHeader>
        <TableRow className="">
          <TableHead className="w-[200px]">COIN</TableHead>
          <TableHead className="w-[120px]">SYMBOL</TableHead>
          <TableHead className="w-[120px]">VOLUME</TableHead>
          <TableHead className="w-[120px]">MARKET CAP</TableHead>
          <TableHead className=" ">PRICE CHANGE(24h)</TableHead>
          <TableHead className=" w-[100px] text-right">PRICE</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {coin.map((item,index)=><TableRow key={item.id}>
            <TableCell
              onClick={() => navigate(`/market/${item.id}/`)}
              className="font-medium flex items-center gap-2 w-[200px]"
            >
              <Avatar className="-z-50">
                <AvatarImage src={item.image}></AvatarImage>
              </Avatar>
              <span>{item.name}</span>
            </TableCell>
            <TableCell>{item.symbol}</TableCell>
            <TableCell>{item.total_volume}</TableCell>
            <TableCell>{item.market_cap}</TableCell>
            <TableCell>
                <span
                  className={`${
                    item.price_change_percentage_24h < 0
                      ? "text-red-600" 
                      : "text-green-400" 
                  }`}
                >
                  {item.price_change_percentage_24h.toFixed(2)}%
                </span>
              </TableCell>
            <TableCell className="text-right">${item.current_price}</TableCell>
          </TableRow>
        )}
      </TableBody>
      </ScrollArea>

    </Table>
  );
};

export default AssetTable;
