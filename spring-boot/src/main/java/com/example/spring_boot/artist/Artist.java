package com.example.spring_boot.artist;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

import java.util.List;

@Entity
@Table(name = "artists")
public class Artist {
    @Id
    @Column(length = 22, nullable = false)
    private String id;

    @Column(columnDefinition = "VARCHAR(255) NOT NULL") 
    private String name;

    @Column(columnDefinition = "VARCHAR(255) NOT NULL") 
    private String href;

    @Column(columnDefinition = "VARCHAR(255)") 
    private String image_url;

    @ElementCollection
    @CollectionTable(name = "artist_genres", joinColumns = @JoinColumn(name = "artist_id"))
    @Column(name = "genre", columnDefinition = "VARCHAR(255) NOT NULL")
    private List<String> genres;

     // No-argument constructor (required by JPA)
    public Artist() {}

    public Artist(String id, String name, String href, String image_url, List<String> genres) {
        this.id = id;
        this.name = name;
        this.href = href;
        this.image_url = image_url;
        this.genres = genres;
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
    public String getHref() {
        return href;
    }
    public void setHref(String href) {
        this.href = href;
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
    
}