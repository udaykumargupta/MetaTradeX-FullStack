import React, { useEffect } from 'react'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { BookmarkFilledIcon } from '@radix-ui/react-icons'
import { useDispatch, useSelector } from 'react-redux'
import { addItemToWatchlist, getUserWatchlist } from '@/State/Watchlist/Action'
import { existInWatchlist } from '@/utils/existInWatchlist'


const Watchlist = () => {
  const {watchlist}=useSelector(store=>store);
  const dispatch=useDispatch();
  const handleRemoveToWatchlist=(value)=>{
    dispatch(
      addItemToWatchlist({
        coinId:value,
        jwt: localStorage.getItem("jwt")
      })
    );
    console.log(value);
  }

  useEffect(()=>{
    dispatch(getUserWatchlist(localStorage.getItem('jwt')))
  },[])
  return (
    <div className="px-5 lg:px-20">
    <h1 className="font-bold text-3xl pb-5">Watchlist</h1>
        <Table className="border">
<TableHeader>
  <TableRow>
    <TableHead className="py-5">COIN</TableHead>
    <TableHead>SYMBOL</TableHead>
    <TableHead>VOLUME</TableHead>
    <TableHead>MARKET CAP</TableHead>
    <TableHead>24h</TableHead>
    <TableHead className="">PRICE</TableHead>
    <TableHead className="text-right text-red-600">REMOVE</TableHead>
  </TableRow>
</TableHeader>
<TableBody>
  {watchlist.items.map((item,index)=> <TableRow key={index}>
    <TableCell className="font-medium flex items-center gap-2">
      <Avatar className="-z-50">
          <AvatarImage src={item.image}>

          </AvatarImage>
      </Avatar>
      <span>{item.name}</span>
    </TableCell>
    <TableCell>{item.symbol}</TableCell>
    <TableCell>{item.total_volume}</TableCell>
    <TableCell>{item.market_cap}</TableCell>
    <TableCell>{item.price_change_percentage_24h}</TableCell>
    <TableCell className="">${item.current_price}</TableCell>
    <TableCell className="text-right">
      <Button variant="ghost" onClick={()=>handleRemoveToWatchlist(item.id)}size="icon" className="h-10 w-10">
        
        <BookmarkFilledIcon className='w-6 h-6'>

        </BookmarkFilledIcon>
      </Button>
    </TableCell>
  </TableRow>)}
</TableBody>
</Table>
  </div>
  )
}

export default Watchlist