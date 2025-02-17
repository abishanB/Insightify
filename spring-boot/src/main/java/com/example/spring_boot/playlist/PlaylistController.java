package com.example.spring_boot.playlist;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.spring_boot.playlist.PlaylistEvolution.EvolutionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
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
    private final TracksService tracksService;
    @Autowired
    private final EvolutionService evolutionService;
    
    public PlaylistController (PlaylistService playlistService, TracksService tracksService, EvolutionService evolutionService) {
        this.playlistService = playlistService;
        this.tracksService = tracksService;
        this.evolutionService = evolutionService;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping
    public String getUserPlaylist(@RequestParam String access_token, @RequestParam String playlistID) {
        System.out.println("getUserPlaylist Endpoint Hit");
        playlistService.deletePlaylistFromDatabase();
        if (playlistID.equals("liked_songs")) {
            return playlistService.getLikedSongs(access_token);
        }
        return playlistService.getPlaylist(access_token, playlistID);
    }
    
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("tracks")
    public String getPlaylistTracks(@RequestParam String access_token, @RequestParam String playlistID) {
        System.out.println("getPlaylistTracks endpoint hit");
        return tracksService.getPlaylistTracks(access_token, playlistID);
    }
    
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("top_artists")
    public String getPlaylistEvolution(@RequestBody String playlistTracks) {
        System.out.println("getPlaylistTopAritstOverTime endpoint hit");
        return evolutionService.getPlaylistEvolution(playlistTracks);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @DeleteMapping("delete")
    public String deleteOldEntries(){
        playlistService.deletePlaylistFromDatabase();
        return "OK";
    }
}
