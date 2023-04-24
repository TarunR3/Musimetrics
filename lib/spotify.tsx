import SpotifyWebApi from 'spotify-web-api-node'

const scopes = [
    "user-read-private",
    "user-read-email", 
    "user-top-read",
    "user-read-recently-played",
].join(",");

const params = {
    scope: scopes,
}

const queryParamString = new URLSearchParams(params);

const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString.toString()}`;

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_ID,
    clientSecret: process.env.SPOTIFY_SECRET,
})

export default spotifyApi

export {LOGIN_URL}