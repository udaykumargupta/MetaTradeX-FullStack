import React, { useEffect } from 'react'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useDispatch, useSelector } from 'react-redux';
import { getUserAssets } from '@/State/Asset/Action';
const Portfolio = () => {
  const dispatch=useDispatch();

  const {asset}=useSelector(store=>store)

  useEffect(()=>{
    dispatch(getUserAssets(localStorage.getItem("jwt")))
  },[])

  return (
    <div className="px-5 lg:px-20">
      <h1 className="font-bold text-3xl pb-5">Portfolio</h1>
          <Table>
  <TableHeader>
    <TableRow>
      <TableHead className="">ASSET</TableHead>
      <TableHead>PRICE</TableHead>
      <TableHead>UNIT</TableHead>
      <TableHead>CHANGE</TableHead>
      <TableHead>CHANGE(%)</TableHead>
      <TableHead className="text-right">VALUE</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {asset.userAssets.map((item,index)=> <TableRow key={index}>
      <TableCell className="font-medium flex items-center gap-2">
        <Avatar className="-z-50">
            <AvatarImage src={item.coin.image}>

            </AvatarImage>
        </Avatar>
        <span>{item.coin.name}</span>
      </TableCell>
      <TableCell>{item.coin.symbol.toUpperCase()}</TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell>{item.coin.price_change_24h}</TableCell>
      <TableCell>{item.coin.price_change_percentage_24h}</TableCell>
      <TableCell className="text-right">${item.coin.total_volume}</TableCell>
    </TableRow>)}
  </TableBody>
</Table>
    </div>
  )
}

export default Portfolio