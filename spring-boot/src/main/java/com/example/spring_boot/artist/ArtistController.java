package com.example.spring_boot.artist;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping(path = "api/artists")
public class ArtistController {
  @Autowired
  private final ArtistService artistService;


  public ArtistController(ArtistService artistService) {
    this.artistService = artistService;
  }

  @CrossOrigin(origins = "http://localhost:3000")
  @PostMapping()
  public String getPlaylistArtists(@RequestParam String access_token, @RequestBody String artistIDs) {
    artistService.deleteArtistFromDatabase();//delete old artists every api call
    return artistService.getArtists(access_token, artistIDs);
  }

  @DeleteMapping("delete")
  public String deleteOldArtists() {//test purposes
    artistService.deleteArtistFromDatabase();
    return "OK";
  }
}
