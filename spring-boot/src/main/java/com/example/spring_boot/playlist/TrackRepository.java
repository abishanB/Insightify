package com.example.spring_boot.playlist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TrackRepository extends JpaRepository<Track, Long> {
  @Modifying
  @Transactional
  @Query("DELETE FROM Track t WHERE t.playlist.id = :playlistId")
  void deleteAllTracksByPlaylistId(String playlistId);

  //return all tracks from playlist in order starting with last added
  @Query("SELECT t FROM Track t WHERE t.playlist.id = :playlistId ORDER BY t.added_at DESC")
  List<Track> findTracksByPlaylistIdOrdered(@Param("playlistId") String playlistId);
}