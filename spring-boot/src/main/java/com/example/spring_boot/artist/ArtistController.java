package com.example.spring_boot.artist;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping(path = "api/artists")
public class ArtistController {
    private final ArtistService artistService;
    
    @Autowired
    public ArtistController (ArtistService artistService) {
        this.artistService = artistService;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping()
    public String getPlaylistArtists(@RequestParam String access_token, @RequestBody String artistIDs) {
        return artistService.getArtists(access_token, artistIDs);
    }
}

