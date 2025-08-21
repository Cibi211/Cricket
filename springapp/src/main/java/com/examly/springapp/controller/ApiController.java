package com.examly.springapp.controller;

import com.examly.springapp.model.Player;
import com.examly.springapp.service.PlayerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@CrossOrigin(origins ="http://localhost:5000") // allow React dev server
public class ApiController {

    private final PlayerService playerService;

    public ApiController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @PostMapping("/addPlayer")
    public ResponseEntity<Player> addPlayer(@RequestBody Player player) {
        try {
            Player saved = playerService.addPlayer(player);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            // log if you have a logger
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/getAllPlayer")
    public ResponseEntity<List<Player>> getAllPlayer() {
        try {
            List<Player> list = playerService.getAllPlayers();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
