package com.example.spring_boot.artist;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity(name = "artists")
@Table
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

    @Column(columnDefinition = "VARCHAR(255) NOT NULL") 
    private String[] genres;

     // No-argument constructor (required by JPA)
    public Artist() {}

    public Artist(String id, String name, String href, String image_url, String[] genres) {
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
    public String[] getGenres() {
        return genres;
    }
    public void setGenres(String[] genres) {
        this.genres = genres;
    }
    
}