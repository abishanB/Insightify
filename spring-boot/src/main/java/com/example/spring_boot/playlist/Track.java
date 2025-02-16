package com.example.spring_boot.playlist;

import com.google.gson.annotations.Expose;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Id;

@Entity
@Table(name="tracks")
public class Track {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Expose
  private Long id;

  @Column(columnDefinition = "VARCHAR(255) NOT NULL")
  @Expose
  private String name;
  @Column(columnDefinition = "TEXT")
  @Expose
  private String artists;
  @Column(columnDefinition = "VARCHAR(255)")
  @Expose
  private String album_name;
  @Column(columnDefinition = "VARCHAR(255)")
  @Expose
  private String album_href;
  @Column(columnDefinition = "VARCHAR(255) NOT NULL")
  @Expose
  private String image_url;
  @Column(columnDefinition = "VARCHAR(255)")
  @Expose
  private String href;
  @Column(columnDefinition = "VARCHAR(255) NOT NULL")
  @Expose
  private String added_at;
  
  @Expose
  private int popularity;
  @ManyToOne
  @JoinColumn(name = "playlist_id", referencedColumnName = "id") // Foreign key in Track table
  @Expose(serialize = false)
  private Playlist playlist;

  public Track(String name, String artists, String album_name, String album_href, String image_url, String href, String added_at, int popularity, Playlist playlist) {
    this.name = name;
    this.artists = artists;
    this.album_name = album_name;
    this.album_href = album_href;
    this.image_url = image_url;
    this.href = href;
    this.added_at = added_at;
    this.popularity = popularity;
    this.playlist = playlist;
  }

  public Track(){}

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }


  public String getArtists() {
    return artists;
  }


  public void setArtists(String artists) {
    this.artists = artists;
  }


  public String getAlbum() {
    return album_name;
  }


  public void setAlbum(String album_name) {
    this.album_name = album_name;
  }


  public String getAlbum_href() {
    return album_href;
  }

  public void setAlbum_href(String album_href) {
    this.album_href = album_href;
  }

  public String getImage_url() {
    return image_url;
  }


  public void setImage_url(String image_url) {
    this.image_url = image_url;
  }


  public String getHref() {
    return href;
  }


  public void setHref(String href) {
    this.href = href;
  }

  public String getAdded_at() {
    return added_at;
  }


  public void setAdded_at(String added_at) {
    this.added_at = added_at;
  }

  public Playlist getPlaylist() {
    return playlist;
  }

  public void setPlaylist(Playlist playlist) {
    this.playlist = playlist;
  }


}