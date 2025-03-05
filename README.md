# **Insightify**  
**Insightify is a web application that leverages the Spotify Web API to deliver personalized music insights**  :musical_note:

## Features
:heavy_check_mark: Explore your top artists and tracks across different time ranges

:heavy_check_mark: Get an in-depth breakdown of your playlists, including top genres, top artists & top albums

:heavy_check_mark: Track how your playlists have evolved over time

:heavy_check_mark: Visualize your playlist breakdown through interactive charts

## Tech Stack
:computer: **Frontend:** React

:globe_with_meridians: **Backend:** Spring Boot

:open_file_folder: **Database:** PostgreSQL



### Prerequisites

1. Make sure you have **npm** installed for running the frontend.
2. Make sure you have **Java** and **Maven** for the backend (Spring Boot).
3. Create a Spotify Developer account and set up an application to get your **Spotify API credentials**.

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/insightify.git
    cd insightify
    ```
2. Install the frontend dependencies:
    ```bash
    cd client
    npm install
    ```

3. Set up environment variables
   - Create a .env file
     
   ```bash
    REACT_APP_CLIENT_ID=
    REACT_APP_CLIENT_SECRET=
    REACT_APP_SCOPE="user-read-private user-read-email user-top-read playlist-read-private user-library-read"
    REACT_APP_REDIRECT_URI=
    REACT_APP_SERVER_URL=
   ```
4. Set up the backend by following these steps:
    - Update the `application.properties` file with your PostgreSQL database details.
    - Add your **Spotify API credentials** to the configuration files.

5. Run the backend (Spring Boot application):
    ```bash
    cd server
    mvn spring-boot:run  
    ```
6. Run the frontend development server:

    ```bash
    cd client
    npm start
    ```

The app will be available at `http://localhost:3000` for the frontend and `http://localhost:8080` for the backend.
