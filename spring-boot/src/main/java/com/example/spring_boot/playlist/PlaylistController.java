package com.example.spring_boot.playlist;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.spring_boot.playlist.PlaylistEvolution.EvolutionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StopWatch;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin(origins = {"http://localhost:3000", "https://insightify-0nxq.onrender.com/", "https://insightifyapp.com/"})
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
        StopWatch stopWatch = new StopWatch();
        stopWatch.start("Delete Old Playlists");
        playlistService.deletePlaylistFromDatabase();
        stopWatch.stop();

        stopWatch.start(String.format("Get Playlist - %s", playlistID));
        String playlist;
        if (playlistID.equals("liked_songs")) {
            playlist = playlistService.getLikedSongs(access_token);
        } else {playlist = playlistService.getPlaylist(access_token, playlistID);}

        stopWatch.stop();
        System.out.println(stopWatch.prettyPrint());
        return playlist;
    }
    
    @GetMapping("tracks")
    public String getPlaylistTracks(@RequestParam String access_token, @RequestParam String playlistID) {
        
        System.out.println("getPlaylistTracks endpoint hit");
        return tracksService.getPlaylistTracks(access_token, playlistID);
    }
    
    @GetMapping("evolution")
    public String getPlaylistEvolution(@RequestParam String playlistID) {
        System.out.println("getPlaylistTopAritstOverTime endpoint hit");
        StopWatch stopWatch = new StopWatch();
        stopWatch.start(String.format("Get PlaylistEvolution - %s", playlistID));

        String playlistEvolution = evolutionService.getPlaylistEvolution(playlistID);
        
        stopWatch.stop();
        System.out.println(stopWatch.prettyPrint());
        return playlistEvolution;
    }

    @GetMapping("test")
    public String testAPI(){
        return "OK";
    }
}
