package com.example.spring_boot.playlist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface PlaylistRepository extends JpaRepository<Playlist, String> {
  @Query("SELECT p.snapshot_id FROM Playlist p WHERE p.id = :playlistId")
  String findSnapshotById(String playlistId);

  @Query("SELECT p.tracks FROM Playlist p WHERE p.id = :playlistId")
  List<Track> getTracksById(String playlistId);

  @Query("SELECT a FROM Playlist a WHERE a.createdAt < :threshold")
  List<Playlist> findPlaylistsBeforeDate(@Param("threshold") LocalDateTime threshold);
}
