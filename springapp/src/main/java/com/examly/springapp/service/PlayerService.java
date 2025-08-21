package com.examly.springapp.service;

import com.examly.springapp.model.Player;
import com.examly.springapp.repository.PlayerRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlayerService {

    private final PlayerRepo playerRepo;

    // Constructor injection (preferred)
    public PlayerService(PlayerRepo playerRepo) {
        this.playerRepo = playerRepo;
    }

    public Player addPlayer(Player player) {
        // basic validation can be added here if needed
        return playerRepo.save(player);
    }

    public List<Player> getAllPlayers() {
        return playerRepo.findAll();
    }

    // public Player getPlayerById(Integer id) {
    //     return playerRepo.findById(id).orElse(null);
    // }

    // public void deletePlayer(Integer id) {
    //     playerRepo.deleteById(id);
    // }

    // public Player updatePlayer(Integer id, Player updated) {
    //     return playerRepo.findById(id).map(p -> {
    //         p.setPlayerName(updated.getPlayerName());
    //         p.setPlayerCity(updated.getPlayerCity());
    //         p.setPhone(updated.getPhone());
    //         p.setPlayedIn(updated.getPlayedIn());
    //         p.setPlayerType(updated.getPlayerType());
    //         p.setLastPlayedFor(updated.getLastPlayedFor());
    //         return playerRepo.save(p);
    //     }).orElse(null);
    // }
}
