package com.example.spring_boot.artist;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "artists")
public class Artist {
    @Id
    @Column(length = 22, nullable = false)
    private String id;

    @Column(columnDefinition = "VARCHAR(255) NOT NULL") 
    private String name;

    private int popularity;

    @Column(columnDefinition = "VARCHAR(255)") 
    private String image_url;

    @ElementCollection
    @CollectionTable(name = "artist_genres", joinColumns = @JoinColumn(name = "artist_id"))
    @Column(name = "genre", columnDefinition = "VARCHAR(255) NOT NULL")
    private List<String> genres;

    private LocalDateTime createdAt;

     // No-argument constructor (required by JPA)
    public Artist() {}

    public Artist(String id, String name, int popularity, String image_url, List<String> genres) {
        this.id = id;
        this.name = name;
        this.popularity = popularity;
        this.image_url = image_url;
        this.genres = genres;
        this.createdAt = LocalDateTime.now();
    }
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
   
    public String getImageURL() {
        return image_url;
    }
    public void setImageURL(String imageURL) {
        this.image_url = imageURL;
    }
    public List<String> getGenres() {
        return genres;
    }
    public void setGenres(List<String> genres) {
        this.genres = genres;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public int getPopularity() {
        return popularity;
    }
    public void setPopularity(int popularity) {
        this.popularity = popularity;
    }
    
    
    
}