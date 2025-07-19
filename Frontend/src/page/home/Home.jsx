import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import AssetTable from "./AssetTable";
import StockChart from "./StockChart";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Cross1Icon, DotIcon } from "@radix-ui/react-icons";
import { MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { getCoinList, getTop50CoinList } from "@/State/Coin/Action";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { fetchCoinDetails } from "@/State/Chatbot/Action";

const ITEMS_PER_PAGE = 10;

const Home = () => {
  const [category, setCategory] = useState("all");
  const [inputValue, setInputValue] = useState("");
  const [isBotRelease, setIsBotRelease] = useState(false);
  const { coin } = useSelector((store) => store);
  const [selectedCoinId, setSelectedCoinId] = useState("bitcoin");
    const handleCoinClick = (coinId) => {
    setSelectedCoinId(coinId);
  };
  const selectedCoin = coin.coinList.find(item => item.id === selectedCoinId) || 
                       coin.top50.find(item => item.id === selectedCoinId);
  const chatResponse = useSelector((store) => store.chatbox.response);
  const dispatch = useDispatch();

  const [chatHistory, setChatHistory] = useState([]); // State to keep chat history

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(
    (category === "all" ? coin.coinList.length : coin.top50.length) / ITEMS_PER_PAGE
  );

  const handleBotRelease = () => setIsBotRelease(!isBotRelease);

  const handleCategory = (value) => {
    setCategory(value);
    setCurrentPage(1);

    if (value === "TopGainers") {
      const gainers = getSortedGainers(coin.coinList);
      if (gainers.length > 0) {
        setSelectedCoinId(gainers[0].id);
      }
    } else if (value === "TopLosers") {
      const losers = getSortedLosers(coin.coinList);
      if (losers.length > 0) {
        setSelectedCoinId(losers[0].id);
      }
    } else if (value === "Top50") {
      // The top50 list is already sorted by market cap from the API
      if (coin.top50.length > 0) {
        // Set the chart to the #1 coin (e.g., Bitcoin)
        setSelectedCoinId(coin.top50[0].id);
      }
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && inputValue.trim()) {
      // Add user input to chat history
      setChatHistory([...chatHistory, { sender: "user", message: inputValue }]);
      
      // Dispatch the action to fetch coin details
      dispatch(fetchCoinDetails(inputValue));
      setInputValue(""); // Clear input after submission
    }
  };

  // Append bot response to the chat history
  useEffect(() => {
    if (chatResponse) {
      setChatHistory([...chatHistory, { sender: "bot", message: chatResponse.message }]);
    }
  }, [chatResponse]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Fetch coin data
  useEffect(() => {
    dispatch(getTop50CoinList());
  }, [category]);

  useEffect(() => {
    dispatch(getCoinList(1));
  }, []);

  const getSortedLosers = (coinList) => {
    return [...coinList].sort(
      (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h
    );
  };

  const getSortedGainers = (coinList) => {
    return [...coinList].sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    );
  };

  const paginatedData = (
    category === "all"
      ? coin.coinList
      : category === "Top50"
      ? coin.top50
      : category === "TopLosers"
      ? getSortedLosers(coin.coinList)
      : category === "TopGainers"
      ? getSortedGainers(coin.coinList)
      : coin.coinList
  ).slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="relative">
      <div className="lg:flex">
        <div className="lg:w-[50%] lg:border-r">
          <div className="p-3 flex items-center gap-4">
            <Button
              onClick={() => handleCategory("all")}
              variant={category === "all" ? "default" : "outline"}
              className="rounded-full"
            >
              All
            </Button>

            <Button
              onClick={() => handleCategory("Top50")}
              variant={category === "Top50" ? "default" : "outline"}
              className="rounded-full"
            >
              Top 50
            </Button>

            <Button
              onClick={() => handleCategory("TopGainers")}
              variant={category === "TopGainers" ? "default" : "outline"}
              className="rounded-full"
            >
              Top Gainers
            </Button>

            <Button
              onClick={() => handleCategory("TopLosers")}
              variant={category === "TopLosers" ? "default" : "outline"}
              className="rounded-full"
            >
              Top Losers
            </Button>
          </div>

          <AssetTable coin={paginatedData} category={category} onCoinClick={handleCoinClick} />

          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">Page {currentPage}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>

      <div className="hidden lg:block lg:w-[50%] p-5">
        
        {/* Pass the dynamic ID to the chart */}
        <StockChart coinId={selectedCoinId} />

        {/* Check if selectedCoin exists before trying to render it */}
        {selectedCoin && (
          <div className="flex gap-5 items-center">
            <div>
              <Avatar>
                <AvatarImage src={selectedCoin.image} />
              </Avatar>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p>{selectedCoin.symbol.toUpperCase()}</p>
                <DotIcon className="text-gray-400" />
                <p className="text-gray-400">{selectedCoin.name}</p>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-xl font-bold">
                  ${selectedCoin.current_price.toLocaleString()}
                </p>
                <p className={selectedCoin.price_change_percentage_24h > 0 ? "text-green-600" : "text-red-600"}>
                  <span>{selectedCoin.price_change_24h.toLocaleString()}</span>
                  <span>({selectedCoin.price_change_percentage_24h.toFixed(2)}%)</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Chat Bot */}
      <section className="absolute bottom-5 right-5 z-40 flex flex-col justify-end items-end gap-2">
        {isBotRelease && (
          <div className="rounded-md w-[20rem] md:w-[25rem] lg:w-[25rem] h-[70vh] bg-slate-900">
            <div className="flex justify-between items-center border-b px-6 h-[12%]">
              <p className="text-green-100" >Chat Bot</p>
              <Button onClick={handleBotRelease} variant="ghost" size="icon">
                <Cross1Icon />
              </Button>
            </div>

            <div className="h-[76%] flex flex-col overflow-y-auto gap-5 px-5 py-2 scroll-container">
              <div className="self-start -pb-5 w-auto">
                <div className="justify-end self-end px-5 py-2 rounded-md bg-slate-800 w-auto">
                <p>👋  Hi, I'm your Crypto Assistant!</p>
                <p>Ask me about crypto prices, market cap, and more.</p>
                </div>
              </div>

              {chatHistory.map((chat, index) => (
                <div key={index} className={`self-${chat.sender === "user" ? "end" : "start"} pb-5 w-auto`}>
                  <div className="justify-end self-end px-5 py-2 rounded-md bg-slate-800 w-auto">
                    <p>{chat.sender === "user" ? `You: ${chat.message}` : `Bot: ${chat.message}`}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-[12%] border-t">
              <Input
                className="w-full h-full order-none outline-none"
                placeholder="Write prompt"
                onChange={handleChange}
                value={inputValue}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>
        )}

        <div className="relative w-[10rem] cursor-pointer group">
          <Button onClick={handleBotRelease} className="w-full h-[3rem] gap-2 items-center">
            <MessageCircle
              size={30}
              className="fill-[#1e293b] -rotate-90 stroke-none group-hover:fill-[#1a1a1a]"
            />
            <span className="text-2xl">Chat Bot</span>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
