package com.Uday.service;

import com.Uday.model.CoinDto;
import com.Uday.response.ApiResponse;
import com.Uday.response.FunctionResponse;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.cache.annotation.Cacheable;
import java.util.Map;

@Service
public class ChatbotServiceImpl implements ChatbotService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private double convertToDouble(Object value) {
        if (value instanceof Integer) {
            return ((Integer) value).doubleValue();
        } else if (value instanceof Long) {
            return (((Long) value).doubleValue());
        } else if (value instanceof Double) {
            return (Double) value;
        }else if (value instanceof java.math.BigDecimal) {
            return ((java.math.BigDecimal) value).doubleValue();
        }else if (value instanceof String) {
            try {
                return Double.parseDouble((String) value);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("String value is not a parsable double: " + value);
            }
        }
        else {
            throw new IllegalArgumentException("unsupported type" + value.getClass().getName());
        }
    }
    @Cacheable(value = "coinData", key = "#currencyName")
    public CoinDto makeApiRequest(String currencyName) throws Exception {
        String url = "https://api.coingecko.com/api/v3/coins/"+currencyName;

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> responseEntity = restTemplate.getForEntity(url, Map.class);
        Map<String, Object> responseBody = responseEntity.getBody();
        if (responseBody != null) {
            Map<String, Object> image = (Map<String, Object>) responseBody.get("image");
            Map<String, Object> marketData = (Map<String, Object>) responseBody.get("market_data");

            CoinDto coinDto = new CoinDto();
            coinDto.setId((String) responseBody.get("id"));
            coinDto.setName((String) responseBody.get("name"));
            coinDto.setSymbol((String) responseBody.get("symbol"));
            coinDto.setImage((String) image.get("large"));

            coinDto.setCurrentPrice(convertToDouble(((Map<String, Object>) marketData.get("current_price")).get("usd")));
            coinDto.setMarketCap(convertToDouble(((Map<String, Object>) marketData.get("market_cap")).get("usd")));
            coinDto.setMarketCapRank(convertToDouble((marketData.get("market_cap_rank"))));
            coinDto.setTotalVolume(convertToDouble(((Map<String, Object>) marketData.get("total_volume")).get("usd")));
            coinDto.setHigh24h(convertToDouble(((Map<String, Object>) marketData.get("high_24h")).get("usd")));
            coinDto.setLow24h(convertToDouble(((Map<String, Object>) marketData.get("low_24h")).get("usd")));


            coinDto.setPriceChange24h(convertToDouble((marketData.get("price_change_24h"))));
            coinDto.setPriceChangePercentage24h(convertToDouble((marketData.get("price_change_percentage_24h"))));
            coinDto.setMarketCapChange24h(convertToDouble((marketData.get("market_cap_change_24h"))));
            coinDto.setMarketCapChangePercentage24h(convertToDouble((marketData.get("market_cap_change_percentage_24h"))));
            coinDto.setCirculatingSupply(convertToDouble((marketData.get("circulating_supply"))));
            coinDto.setTotalSupply(convertToDouble((marketData.get("total_supply"))));
            return coinDto;
        }
        throw new Exception("coin not found");
    }

    public FunctionResponse getFunctionResponse(String prompt) throws Exception {
        String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiApiKey ;

        JSONObject requestBodyJson = new JSONObject()
                .put("contents", new JSONArray()
                        .put(new JSONObject()
                                .put("parts", new JSONArray()
                                        .put(new JSONObject()
                                                .put("text", prompt)
                                        )
                                )
                        )
                )
                .put("tools", new JSONArray()
                        .put(new JSONObject()
                                .put("functionDeclarations", new JSONArray()
                                        .put(new JSONObject()
                                                .put("name", "getCoinDetails")
                                                .put("description", "Gets all available real-time market data for a specific cryptocurrency, such as Bitcoin or Ethereum.")
                                                .put("parameters", new JSONObject()
                                                        .put("type", "OBJECT")
                                                        .put("properties", new JSONObject()
                                                                // This is the corrected structure
                                                                .put("currencyName", new JSONObject()
                                                                        .put("type", "STRING")
                                                                        .put("description", "The name or symbol of the cryptocurrency, for example 'bitcoin' or 'BTC'.")
                                                                )
                                                        )
                                                        .put("required", new JSONArray()
                                                                .put("currencyName")
                                                        )
                                                )
                                        )
                                )
                        )
                );


        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> requestEntity = new HttpEntity<>(requestBodyJson.toString(), headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL, requestEntity, String.class);

        String responseBody = response.getBody();
        JSONObject obj = new JSONObject(responseBody);

        // Extract the 'candidates' array
        JSONArray candidatesArray = obj.getJSONArray("candidates");

        // Get the first candidate object (assuming only one candidate here)
        JSONObject candidateObject = candidatesArray.getJSONObject(0);

        // Extract the 'content' object
        JSONObject contentObject = candidateObject.getJSONObject("content");

        // Extract the 'parts' array
        JSONArray partsArray = contentObject.getJSONArray("parts");

        // Get the first part object
        JSONObject partObject = partsArray.getJSONObject(0);

                if (!partObject.has("functionCall")) {
                    // If there's no function call, the model likely returned a text response.
                    // Handle this case gracefully.
                    String textResponse = partObject.optString("text", "The model did not return a valid function call or text response.");
                    throw new Exception("Please rephrase your query to ask for specific coin data. The model responded with: " + textResponse);
                }
        // Extract the 'functionCall' object
        JSONObject functionCallObject = partObject.getJSONObject("functionCall");

        // Extract 'name' (function name) and 'args' (currency data)
        String functionName = functionCallObject.getString("name");
        JSONObject argsObject = functionCallObject.getJSONObject("args");
        String currencyName = argsObject.getString("currencyName");


        System.out.println("Function Name: " + functionName);

        System.out.println("Currency Name: " + currencyName);

        FunctionResponse res = new FunctionResponse();
        res.setFunctionName(functionName);
        res.setCurrencyName(currencyName);

        return res;


    }

    @Override
    public ApiResponse getCoinDetails(String prompt) throws Exception {

        FunctionResponse res = getFunctionResponse(prompt);
        CoinDto apiResponse = makeApiRequest(res.getCurrencyName().toLowerCase());
        JSONObject apiResponseJson = new JSONObject();
        apiResponseJson.put("id", apiResponse.getId());
        apiResponseJson.put("name", apiResponse.getName());
        apiResponseJson.put("symbol", apiResponse.getSymbol());
        apiResponseJson.put("currentPrice", apiResponse.getCurrentPrice());
        apiResponseJson.put("marketCap", apiResponse.getMarketCap());
        apiResponseJson.put("marketCapRank", apiResponse.getMarketCapRank());
        apiResponseJson.put("priceChange24h", apiResponse.getPriceChange24h());
        apiResponseJson.put("totalVolume", apiResponse.getTotalVolume());

        String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiApiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String body = new JSONObject()
                .put("contents", new JSONArray()
                        // Turn 1: The user's initial prompt
                        .put(new JSONObject()
                                .put("role", "user")
                                .put("parts", new JSONArray()
                                        .put(new JSONObject().put("text", prompt))
                                )
                        )
                        // Turn 2: The model's response (simulated), which is to call our function
                        .put(new JSONObject()
                                .put("role", "model")
                                .put("parts", new JSONArray()
                                        .put(new JSONObject()
                                                .put("functionCall", new JSONObject()
                                                        .put("name", "getCoinDetails")
                                                        .put("args", new JSONObject()
                                                                .put("currencyName", res.getCurrencyName())
                                                        )
                                                )
                                        )
                                )
                        )
                        // Turn 3: The result of our function call
                        .put(new JSONObject()
                                .put("role", "function")
                                .put("parts", new JSONArray()
                                        .put(new JSONObject()
                                                .put("functionResponse", new JSONObject()
                                                        .put("name", "getCoinDetails")
                                                        .put("response", new JSONObject()
                                                                // Pass the correctly serialized apiResponseJson object here
                                                                .put("content", apiResponseJson)
                                                        )
                                                )
                                        )
                                )
                        )
                )
                .toString();

            HttpEntity<String>request=new HttpEntity<>(body,headers);
            RestTemplate restTemplate=new RestTemplate();
            ResponseEntity<String>response=restTemplate.postForEntity(GEMINI_API_URL,request,String.class);

            String responseBody=response.getBody();

            System.out.println("---------"+responseBody);

            // Create a JSONObject from the string
            JSONObject jsonObject = new JSONObject(responseBody);

            // Extract the first candidate
            JSONArray candidates = jsonObject.getJSONArray("candidates");
            JSONObject firstCandidate = candidates.getJSONObject(0);

            // Extract the text
            JSONObject content = firstCandidate.getJSONObject("content");
            JSONArray parts = content.getJSONArray("parts");
            JSONObject firstPart = parts.getJSONObject(0);
            String text = firstPart.getString("text");

            ApiResponse ans=new ApiResponse();
            ans.setMessage(text);



            return ans;
    }

    @Override
    public String simpleChat(String prompt) {
        String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiApiKey;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestBody = new JSONObject()
                .put("contents", new JSONArray()
                        .put(new JSONObject()
                                .put("parts", new JSONArray()
                                        .put(new JSONObject()
                                                .put("text", prompt))))
                ).toString();
        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL, requestEntity, String.class);

        return response.getBody();
    }
}