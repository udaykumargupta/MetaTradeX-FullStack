package com.Uday.service;

import com.Uday.domain.OrderType;
import com.Uday.model.Coin;
import com.Uday.model.Order;
import com.Uday.model.OrderItem;
import com.Uday.model.User;

import java.util.List;

public interface OrderService  {
    Order createOrder(User user, OrderItem orderItem, OrderType orderType);
    Order getOrderById(Long orderId) throws Exception;
    List<Order> getAllOrderOfUser(Long userId,OrderType orderType,String assetSymbol);
    Order processOrder(Coin coin, double quantity, OrderType orderType, User user) throws Exception;
}

