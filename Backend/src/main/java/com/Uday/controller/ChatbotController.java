package com.Uday.controller;

import com.Uday.model.PromptBody;
import com.Uday.response.ApiResponse;
import com.Uday.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai/chat")
public class ChatbotController {

    @Autowired
    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse>getCoinDetails(@RequestBody PromptBody prompt) throws Exception {

        ApiResponse response=chatbotService.getCoinDetails(prompt.getPrompt());
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @PostMapping("/simple")
    public ResponseEntity<String>simpleChatHandler(@RequestBody PromptBody prompt) throws Exception {

        String response=chatbotService.simpleChat(prompt.getPrompt());
        return new ResponseEntity<>(response,HttpStatus.OK);
    }
}
