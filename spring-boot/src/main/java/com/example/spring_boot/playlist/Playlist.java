package com.example.spring_boot.playlist;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.CascadeType;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.annotations.Expose;
@Entity
@Table(name = "playlists")
public class Playlist {
  @Id
  @Column(columnDefinition = "VARCHAR(255) NOT NULL")
  @Expose
  private String id;//if liked songs, id corresponds to user id
  @Column(columnDefinition = "VARCHAR(255) NOT NULL")
  @Expose
  private String name;
  @Column(columnDefinition = "VARCHAR(255) NOT NULL")
  @Expose
  private String href;
  @Column(columnDefinition = "VARCHAR(255)")
  @Expose
  private String image_url;
  @Column(columnDefinition = "VARCHAR(255) NOT NULL")
  @Expose
  private String owner_name;
  @Column(columnDefinition = "VARCHAR(255) NOT NULL")
  @Expose
  private String owner_url;
  @Column(columnDefinition = "VARCHAR(255)")
  @Expose
  private String snapshot_id;
  @Expose
  private int followers;
  @Expose
  private int total_tracks;

  @Expose
  private Boolean isLikedSongs;

  @OneToMany(mappedBy = "playlist", cascade = CascadeType.ALL)
  @Expose(serialize = false)
  private List<Track> tracks = new ArrayList<>();  // Array of Track objects
  
  public Playlist(String id, String name, String href, String image_url, String owner_name, String owner_url,
      String snapshot_id, int followers, int total_tracks, Boolean isLikedSongs, List<Track> tracks) {
    this.id = id;
    this.name = name;
    this.href = href;
    this.image_url = image_url;
    this.owner_name = owner_name;
    this.owner_url = owner_url;
    this.snapshot_id = snapshot_id;
    this.followers = followers;
    this.total_tracks = total_tracks;
    this.isLikedSongs = isLikedSongs;
    this.tracks = tracks;
  }
  
  public Playlist(){}//empty constructor as required by jpa
  public String getId() {
    return id;
  }
  public void setId(String id) {
    this.id = id;
  }
  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }
  public String getHref() {
    return href;
  }
  public void setHref(String href) {
    this.href = href;
  }
  public String getImage_url() {
    return image_url;
  }
  public void setImage_url(String image_url) {
    this.image_url = image_url;
  }
  public String getOwner_name() {
    return owner_name;
  }
  public void setOwner_name(String owner_name) {
    this.owner_name = owner_name;
  }
  public String getOwner_url() {
    return owner_url;
  }
  public void setOwner_url(String owner_url) {
    this.owner_url = owner_url;
  }
  public int getFollowers() {
    return followers;
  }
  public void setFollowers(int followers) {
    this.followers = followers;
  }
  public int getTotal_tracks() {
    return total_tracks;
  }
  public void setTotal_tracks(int total_tracks) {
    this.total_tracks = total_tracks;
  }
  public List<Track> getTracks() {
    return tracks;
  }
  public void setTracks(List<Track> tracks) {
    this.tracks.clear();  // Clear existing tracks to prevent duplicates
    this.tracks.addAll(tracks);
  }
  public String getSnapshot_id() {
    return snapshot_id;
  }
  public void setSnapshot_id(String snapshot_id) {
    this.snapshot_id = snapshot_id;
  }

  public Boolean getIsLikedSongs() {
    return isLikedSongs;
  }

  public void setIsLikedSongs(Boolean isLikedSongs) {
    this.isLikedSongs = isLikedSongs;
  }

  
}