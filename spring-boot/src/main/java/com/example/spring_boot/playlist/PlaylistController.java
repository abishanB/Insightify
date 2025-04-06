package com.example.spring_boot.playlist;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.spring_boot.playlist.PlaylistEvolution.EvolutionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin(origins = {"http://localhost:3000", "https://insightifyapp.com/"})
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

    @GetMapping
    public String getUserPlaylist(@RequestParam String access_token, @RequestParam String playlistID) {
        System.out.println("getUserPlaylist Endpoint Hit");
        playlistService.deletePlaylistFromDatabase();//delete old playlists
  
        String playlist;
        if (playlistID.equals("liked_songs")) {
            System.out.println("getUserPlaylist - Liked Songs");
            playlist = playlistService.getLikedSongs(access_token);//doesnt need id, included in accees_token
        } else {playlist = playlistService.getPlaylist(access_token, playlistID);}
        return playlist;
    }
    
    @GetMapping("tracks")
    public String getPlaylistTracks(@RequestParam String access_token, @RequestParam String playlistID) {
        System.out.println("getPlaylistTracks Endpoint Hit");
        return tracksService.getPlaylistTracks(access_token, playlistID);
    }
    
    @GetMapping("evolution")
    public String getPlaylistEvolution(@RequestParam String playlistID) {
        System.out.println("getPlaylistTopAritstOverTime Endpoint Hit");
   
        String playlistEvolution = evolutionService.getPlaylistEvolution(playlistID);
        return playlistEvolution;
    }

    @GetMapping("ping")
    public String testAPI(){
        return "OK";
    }
}
