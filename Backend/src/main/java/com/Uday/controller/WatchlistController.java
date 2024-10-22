package com.Uday.controller;

import com.Uday.model.Coin;
import com.Uday.model.User;
import com.Uday.model.WatchList;
import com.Uday.service.CoinService;
import com.Uday.service.UserService;
import com.Uday.service.WatchlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    @Autowired
    private WatchlistService watchlistService;

    @Autowired
    private UserService userService;

    @Autowired
    private CoinService coinService;

    @GetMapping("/user")
    public ResponseEntity<WatchList> getUserWatchList(
            @RequestHeader("Authorization") String jwt)throws Exception{

        User user=userService.findUserProfileByJwt(jwt);
        WatchList watchList=watchlistService.findUserWatchList(user.getId());
        return ResponseEntity.ok(watchList);

    }

    @GetMapping("/{watchlistId}")
    public ResponseEntity<WatchList> getWatchlistById(
            @PathVariable Long watchlistId)throws Exception{

        WatchList watchList=watchlistService.findById(watchlistId);
        return ResponseEntity.ok(watchList);
    }

    @PatchMapping("/add/coin/{coinId}")
    public ResponseEntity<Coin>addItemToWatchlist(
            @RequestHeader("Authorization") String jwt,
            @PathVariable String coinId)throws Exception {

        User user=userService.findUserProfileByJwt(jwt);
        Coin coin=coinService.findById(coinId);
        Coin addedCoin=watchlistService.addItemToWatchlist(coin,user);
        return ResponseEntity.ok(addedCoin);
    }

}
