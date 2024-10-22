package com.Uday.service;

import com.Uday.model.Coin;
import com.Uday.model.User;
import com.Uday.model.WatchList;
import com.Uday.repository.WatchlistRepository;
import jakarta.persistence.Id;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class WatchlistServiceImpl implements WatchlistService {

    @Autowired
    private WatchlistRepository watchlistRepository;

    @Override
    public WatchList findUserWatchList(Long userId) throws Exception {
        WatchList watchList=watchlistRepository.findByUserId(userId);
        if(watchList==null){
            throw new Exception("watchlist not found");
        }
        return watchList;
    }

    @Override
    public WatchList createWatchList(User user) {
        WatchList watchList=new WatchList();
        watchList.setUser(user);
        return watchlistRepository.save(watchList);
    }

    @Override
    public WatchList findById(Long id) throws Exception {
        Optional<WatchList>watchListOptional=watchlistRepository.findById(id);
        if(watchListOptional.isEmpty()){
            throw new Exception("watchlist not found");
        }
        return watchListOptional.get();
    }

    @Override
    public Coin addItemToWatchlist(Coin coin, User user) throws Exception {
        WatchList watchList=findUserWatchList(user.getId());

        if(watchList.getCoins().contains(coin)){
            watchList.getCoins().remove(coin);
        }
        else watchList.getCoins().add(coin);
        watchlistRepository.save(watchList);
        return coin;
    }
}
