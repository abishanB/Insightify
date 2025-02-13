package com.example.spring_boot;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.example.spring_boot.playlist.Artist;
import com.example.spring_boot.playlist.ArtistRepository;

@SpringBootApplication
public class InsightifyApplication {

	public static void main(String[] args) {
		SpringApplication.run(InsightifyApplication.class, args);
	}

	@Bean
	CommandLineRunner commandLineRunner(ArtistRepository artistRepository) {
		String[] genres = {};
		return args -> {
			artistRepository.save(new Artist("1", "Drake", "https/spotify/drake", null, genres));
			
		};
	}
}
