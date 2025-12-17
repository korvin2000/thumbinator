package com.thumbinator.app.service;

import com.thumbinator.app.model.GreetingResponse;
import org.springframework.stereotype.Service;

@Service
public class GreetingService {

    public GreetingResponse getGreeting() {
        return new GreetingResponse("Spring Boot + React");
    }
}
