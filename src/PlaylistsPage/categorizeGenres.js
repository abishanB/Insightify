//NOT ACTIVELY BEING USED

const genreGroupings = {
    "Pop": ["pop", "synth-pop", "indie pop", "electropop"],
    "Rock": ["rock", "punk rock", "alternative rock", "indie rock"],
    "Hip Hop": ["hip hop", "rap", "conscious hip hop", "urban", "plugg", "pluggnb"],
    "Trap": ["trap"],
    "Electronic": ["edm", "dubstep", "house", "techno", "drum and bass", "ambient"],
    "Jazz": ["jazz", "smooth jazz", "bebop", "free jazz"],
    "Classical": ["classical", "baroque", "romantic", "orchestral", "orchestra"],
    "Country": ["country", "bluegrass", "outlaw country", "country pop"],
    "Blues": ["blues", "delta blues", "chicago blues", "electric blues"],
    "Reggae": ["reggae", "dancehall", "dub", "roots reggae"],
    "Folk": ["folk", "americana", "celtic folk", "indie folk"],
    "Metal": ["metal", "death metal", "black metal", "thrash metal"],
    "R&B/Soul": ["r&b", "soul", "neo-soul", "funk", "motown"],
    "Latin": ["latin", "salsa", "reggaeton", "bachata"],
    "World Music": ["world", "afrobeat", "flamenco", "samba", "tango"],
  };

const regionalKeywords = {
    "West Coast Rap" : ['west coast', "cali", "california"],
    "Chicago": ["chicago"],
    "New York Rap": ["new york", "nyc", "brooklyn", "manhattan", "queens"],
    "Norwegian": ["norwegian"],
    "French": ["french"],
    "Korean": ["korean", "k-pop"],
    "Bhangra": ["bhangra"],
    "Brazilian": ["brazilian"],
    "Mexican": ["mexican"],
    "Indian": ["indian"],
    "Japanese": ["japanese"],
    "Arabic": ["arabic"],
    "African": ["african"],
    "UK rap": ["uk hip hop", "grime"],
  };
  
  // Step 3: Categorize genres with inclusive regional mapping
  function categorizeSpotifyGenres(data) {
    const output = {};
  
    // Helper to add occurrences
    const addOccurrences = (category, occurrences) => {
      if (!output[category]) {
        output[category] = { totalOccurences: 0 };
      }
      output[category].totalOccurences += occurrences;
    };
  
    // Process genres
    data.forEach(([genre, details]) => {
      const lowerGenre = genre.toLowerCase();
      const occurrences = details.totalOccurences;
  
      let matchedCategories = [];
  
      // Match genre to broad categories
      for (const [category, keywords] of Object.entries(genreGroupings)) {
        if (keywords.some((keyword) => lowerGenre.includes(keyword))) {
          addOccurrences(category, occurrences);
          matchedCategories.push(category);
        }
      }
  
      // Match genre to regional categories
      for (const [region, keywords] of Object.entries(regionalKeywords)) {
        if (keywords.some((keyword) => lowerGenre.includes(keyword))) {
          addOccurrences(region, occurrences);
          matchedCategories.push(region);
        }
      }
  
      // If no matches, leave as uncategorized
      if (matchedCategories.length === 0) {
        addOccurrences(genre, occurrences);
      }
    });
  
    // Convert the output back to input-like structure
    return Object.entries(output).map(([genre, details]) => [genre, details]);
  }
  

export default categorizeSpotifyGenres