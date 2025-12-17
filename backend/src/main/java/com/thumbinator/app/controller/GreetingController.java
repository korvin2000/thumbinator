package com.thumbinator.app.controller;

import com.thumbinator.app.model.GreetingResponse;
import com.thumbinator.app.service.GreetingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/greeting")
public class GreetingController {

    private final GreetingService greetingService;

    public GreetingController(GreetingService greetingService) {
        this.greetingService = greetingService;
    }

    @GetMapping
    public GreetingResponse fetchGreeting() {
        return greetingService.getGreeting();
    }
}
