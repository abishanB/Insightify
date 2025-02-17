package com.example.spring_boot.playlist;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.spring_boot.playlist.PlaylistEvolution.EvolutionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping(path = "api/playlist")
public class PlaylistController {
    @Autowired
    private final PlaylistService playlistService;
    @Autowired
    private final PlaylistTracksService playistTracksService;
    @Autowired
    private final EvolutionService evolutionService;
    
    public PlaylistController (PlaylistService playlistService, PlaylistTracksService playistTracksService, EvolutionService evolutionService) {
        this.playlistService = playlistService;
        this.playistTracksService = playistTracksService;
        this.evolutionService = evolutionService;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping
    public String getUserPlaylist(@RequestParam String access_token, @RequestParam String playlistID) {
        System.out.println("getUserPlaylist Endpoint Hit");
        return playlistService.getPlaylist(access_token, playlistID);
    }
    
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("tracks")
    public String getPlaylistTracks(@RequestParam String access_token, @RequestParam String playlistID) {
        System.out.println("getPlaylistTracks endpoint hit");
        if (playlistID == "liked_songs"){
            return playistTracksService.getLikedSongs(access_token);
        }
        return playistTracksService.getPlaylistTracks(access_token, playlistID);
    }
    
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("top_artists")
    public String getPlaylistEvolution(@RequestBody String playlistTracks) {
        System.out.println("getPlaylistTopAritstOverTime endpoint hit");
        return evolutionService.getPlaylistEvolution(playlistTracks);
    }
}
