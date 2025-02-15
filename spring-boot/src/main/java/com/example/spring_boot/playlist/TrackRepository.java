package com.example.spring_boot.playlist;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TrackRepository extends JpaRepository<Track, Long> {
    List<Track> findByPlaylistId(String playlistId);
}