package com.example.spring_boot.artist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

public interface ArtistRepository extends JpaRepository<Artist, String>{
  @Modifying
  @Transactional
  @Query("DELETE FROM Artist a WHERE a.createdAt < :threshold")
  int deleteOldEntries(LocalDateTime threshold);
}