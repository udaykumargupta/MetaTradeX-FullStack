package com.Uday.service;

import com.Uday.model.Asset;
import com.Uday.model.Coin;
import com.Uday.model.User;

import java.util.List;

public interface AssetService {

    Asset creatAsset(User user, Coin coin,double quantity);

    Asset getAssetById(Long assetId) throws Exception;

    Asset getAssetByUserIdAndId(Long userId,Long assetId);

    List<Asset>getUsersAssets(Long userId);

    Asset updateAsset(Long assetId,double quantity) throws Exception;

    Asset findAssetByUserIdAndCoinId(Long userId,String coinId);

    void deleteAsset(Long assetId);

}
