package com.Uday.service;

import com.Uday.model.Coin;

import java.util.List;

public interface CoinService {
    List<Coin> getCoinList(int page) throws Exception;

    String getMarketChart(String coinId,int days) throws Exception;

    String getCoinDetails(String coinId) throws Exception;

    Coin findById(String keyword) throws Exception;

    String searchCoin(String keyword) throws Exception;

    String getTop50CoinsByMarketCapRank() throws Exception;

    String getTradingCoins() throws Exception;
}
