package com.Uday.repository;

import com.Uday.model.WatchList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WatchlistRepository extends JpaRepository<WatchList,Long> {

    WatchList findByUserId(Long userId);
}
