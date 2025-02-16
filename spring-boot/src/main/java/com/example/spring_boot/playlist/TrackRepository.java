package com.example.spring_boot.playlist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface TrackRepository extends JpaRepository<Track, Long> {
  @Modifying
  @Transactional
  @Query("DELETE FROM Track t WHERE t.playlist.id = :playlistId")
  void deleteAllTracksByPlaylistId(String playlistId);
}