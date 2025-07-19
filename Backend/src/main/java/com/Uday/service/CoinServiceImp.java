package com.Uday.service;

import com.Uday.model.Coin;
import com.Uday.repository.CoinRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.cache.annotation.Cacheable;
import java.util.List;
import java.util.Optional;

@Service
public class CoinServiceImp implements CoinService{

    @Autowired
    private CoinRepository coinRepository;

    @Autowired

    private ObjectMapper objectMapper;

    @Override
    @Cacheable(value = "coinList", key = "#page")
    public List<Coin> getCoinList(int page) throws Exception {
        String url="https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=100&page="+page;
        RestTemplate restTemplate=new RestTemplate();

        try{

            HttpHeaders headers=new HttpHeaders();

            HttpEntity<String>entity=new HttpEntity<String>("parameters",headers);

            ResponseEntity<String> response=restTemplate.exchange(url, HttpMethod.GET,entity,String.class);

            List<Coin> coinList=objectMapper.readValue(response.getBody(),new TypeReference<List<Coin>>(){});

            return coinList;
        }

        catch (HttpClientErrorException | HttpServerErrorException e){
            throw new Exception(e.getMessage());
        }

    }

    @Override
    @Cacheable(value = "marketChart", key = "#coinId + '-' + #days")
    public String getMarketChart(String coinId, int days) throws Exception {
        String url="https://api.coingecko.com/api/v3/coins/"+coinId+"/market_chart?vs_currency=usd&days="+days;
        RestTemplate restTemplate=new RestTemplate();

        try{

            HttpHeaders headers=new HttpHeaders();

            HttpEntity<String>entity=new HttpEntity<String>("parameters",headers);

            ResponseEntity<String> response=restTemplate.exchange(url, HttpMethod.GET,entity,String.class);

           return response.getBody();


        }

        catch (HttpClientErrorException | HttpServerErrorException e){
            throw new Exception(e.getMessage());
        }
    }

    @Override
    @Cacheable(value = "coinDetails", key = "#coinId")
    public String getCoinDetails(String coinId) throws Exception {
        String url = "https://api.coingecko.com/api/v3/coins/" + coinId;
        RestTemplate restTemplate = new RestTemplate();

        try {
            HttpHeaders headers = new HttpHeaders();
            HttpEntity<String> entity = new HttpEntity<>("parameters", headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            JsonNode jsonNode = objectMapper.readTree(response.getBody());

            Coin coin = coinRepository.findById(coinId).orElse(new Coin());

            // Use .path() for safe navigation
            coin.setId(jsonNode.path("id").asText());
            coin.setName(jsonNode.path("name").asText());
            coin.setSymbol(jsonNode.path("symbol").asText());
            coin.setImage(jsonNode.path("image").path("large").asText());

            JsonNode marketData = jsonNode.path("market_data");

            // Add checks before getting values to prevent crashes
            if (!marketData.isMissingNode()) {
                JsonNode currentNode;

                currentNode = marketData.path("current_price").path("usd");
                if (!currentNode.isMissingNode()) coin.setCurrentPrice(currentNode.asDouble());

                currentNode = marketData.path("market_cap").path("usd");
                if (!currentNode.isMissingNode()) coin.setMarketCap(currentNode.asDouble());

                currentNode = marketData.path("market_cap_rank");
                if (!currentNode.isMissingNode()) coin.setMarketCapRank(currentNode.asInt());

                currentNode = marketData.path("total_volume").path("usd");
                if (!currentNode.isMissingNode()) coin.setTotalVolume(currentNode.asDouble());

                currentNode = marketData.path("high_24h").path("usd");
                if (!currentNode.isMissingNode()) coin.setHigh24h(currentNode.asDouble());

                currentNode = marketData.path("low_24h").path("usd");
                if (!currentNode.isMissingNode()) coin.setLow24h(currentNode.asDouble());

                currentNode = marketData.path("price_change_24h");
                if (!currentNode.isMissingNode()) coin.setPriceChange24h(currentNode.asDouble());

                currentNode = marketData.path("price_change_percentage_24h");
                if (!currentNode.isMissingNode()) coin.setPriceChangePercentage24h(currentNode.asDouble());

                currentNode = marketData.path("market_cap_change_24h");
                if (!currentNode.isMissingNode()) coin.setMarketCapChange24h(currentNode.asDouble());

                currentNode = marketData.path("market_cap_change_percentage_24h");
                if (!currentNode.isMissingNode()) coin.setMarketCapChangePercentage24h(currentNode.asDouble());

                currentNode = marketData.path("total_supply");
                if (!currentNode.isMissingNode() && !currentNode.isNull()) {
                    coin.setTotalSupply(currentNode.asDouble());
                }
            }

            coinRepository.save(coin);

            return response.getBody();

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public Coin findById(String coinId) throws Exception {
        Optional<Coin>optionalCoin=coinRepository.findById(coinId);
        if(optionalCoin.isEmpty())throw new Exception("coin not found");
        return optionalCoin.get();
    }

    @Override
    @Cacheable(value = "searchResults", key = "#keyword")
    public String searchCoin(String keyword) throws Exception {
        String url="https://api.coingecko.com/api/v3/search?query="+keyword;
        RestTemplate restTemplate=new RestTemplate();

        try{

            HttpHeaders headers=new HttpHeaders();

            HttpEntity<String>entity=new HttpEntity<String>("parameters",headers);

            ResponseEntity<String> response=restTemplate.exchange(url, HttpMethod.GET,entity,String.class);

            return response.getBody();


        }

        catch (HttpClientErrorException | HttpServerErrorException e){
            throw new Exception(e.getMessage());
        }
    }

    @Override
    @Cacheable("top50Coins")
    public String getTop50CoinsByMarketCapRank() throws Exception {
        String url="https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=50&page=1";
        RestTemplate restTemplate=new RestTemplate();

        try{

            HttpHeaders headers=new HttpHeaders();

            HttpEntity<String>entity=new HttpEntity<String>("parameters",headers);

            ResponseEntity<String> response=restTemplate.exchange(url, HttpMethod.GET,entity,String.class);

            return response.getBody();


        }

        catch (HttpClientErrorException | HttpServerErrorException e){
            throw new Exception(e.getMessage());
        }
    }

    @Override
    @Cacheable("trendingCoins")
    public String getTradingCoins() throws Exception {
        String url="https://api.coingecko.com/api/v3/search/trending";
        RestTemplate restTemplate=new RestTemplate();

        try{

            HttpHeaders headers=new HttpHeaders();

            HttpEntity<String>entity=new HttpEntity<String>("parameters",headers);

            ResponseEntity<String> response=restTemplate.exchange(url, HttpMethod.GET,entity,String.class);

            return response.getBody();


        }

        catch (HttpClientErrorException | HttpServerErrorException e){
            throw new Exception(e.getMessage());
        }
    }
}
