package com.Uday.service;

import com.Uday.response.ApiResponse;

public interface ChatbotService {

    ApiResponse getCoinDetails (String prompt) throws Exception;

    String simpleChat(String prompt);
}
