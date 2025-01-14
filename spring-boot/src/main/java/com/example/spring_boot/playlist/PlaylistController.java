package com.example.spring_boot.playlist;

import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping(path = "api/playlist")
public class PlaylistController {
    private final PlaylistService playlistService;
    
    @Autowired
    public PlaylistController (PlaylistService playlistService) {
        this.playlistService = playlistService;
    }

    @GetMapping
    public  Map<String, Map<String, Double>> getPlaylist(@RequestBody String playlistTracks) {
        return playlistService.getTopArtistsOverTime(playlistTracks);
    }
}
