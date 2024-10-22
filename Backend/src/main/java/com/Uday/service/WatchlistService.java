package com.Uday.service;

import com.Uday.model.Coin;
import com.Uday.model.User;
import com.Uday.model.WatchList;

public interface WatchlistService {

     WatchList findUserWatchList(Long userId) throws Exception;
     WatchList createWatchList(User user);
     WatchList findById(Long id) throws Exception;

     Coin addItemToWatchlist(Coin coin,User user) throws Exception;
}
