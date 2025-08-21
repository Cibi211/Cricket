package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5000/")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public Map<String, Object> signup(@RequestBody Map<String, String> userMap) {
        Map<String, Object> response = new HashMap<>();
        try {
            User user = userService.registerUser(
                    userMap.get("name"),
                    userMap.get("email"),
                    userMap.get("password")
            );
            response.put("success", true);
            response.put("message", "User registered successfully");
            response.put("user", user);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginMap) {
        Map<String, Object> response = new HashMap<>();
        try {
            User user = userService.loginUser(
                    loginMap.get("email"),
                    loginMap.get("password")
            );
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("user", user);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }
}
