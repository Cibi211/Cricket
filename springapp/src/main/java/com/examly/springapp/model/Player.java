package com.examly.springapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int playerId;

    private String playerName;
    private String playerCity;
    private long phone;
    private String playedIn;
    private String playerType;
    private String lastPlayedFor;

    public Player() {}

    public Player(String playerName, String playerCity, long phone, String playedIn, String playerType, String lastPlayedFor) {
        this.playerName = playerName;
        this.playerCity = playerCity;
        this.phone = phone;
        this.playedIn = playedIn;
        this.playerType = playerType;
        this.lastPlayedFor = lastPlayedFor;
    }

    public int getPlayerId() {
        return playerId;
    }

    public void setPlayerId(int playerId) {
        this.playerId = playerId;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public String getPlayerCity() {
        return playerCity;
    }

    public void setPlayerCity(String playerCity) {
        this.playerCity = playerCity;
    }

    public long getPhone() {
        return phone;
    }

    public void setPhone(long phone) {
        this.phone = phone;
    }

    public String getPlayedIn() {
        return playedIn;
    }

    public void setPlayedIn(String playedIn) {
        this.playedIn = playedIn;
    }

    public String getPlayerType() {
        return playerType;
    }

    public void setPlayerType(String playerType) {
        this.playerType = playerType;
    }

    public String getLastPlayedFor() {
        return lastPlayedFor;
    }

    public void setLastPlayedFor(String lastPlayedFor) {
        this.lastPlayedFor = lastPlayedFor;
    }

    // ✅ Add getters & setters here if needed
    
}
