import './styles/Home.css'
import Header from "./Header.jsx";

import React, {useEffect, useState} from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import MoviesContainer from "./MoviesContainer.jsx";
import {useNavigate} from "react-router-dom";

function Home() {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/movies')
            .then(response => response.json())
            .then(data => setMovies(data))
            .catch(error => console.error('Error fetching movies: ', error));
    }, []);

    useEffect(() => {
        if (searchTerm.length > 0) {
            const filteredSuggestions = movies.filter(movie =>
                movie.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    }, [searchTerm, movies]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSuggestionClick = (movieTitle) => {
        navigate(`/movie/${movieTitle}`);
    };

    const handleSearchClick = () => {
        const movie = movies.find(movie => movie.title.toLowerCase() === searchTerm.toLowerCase());
        if (movie) {
            navigate(`/movie/${movie.title}`);
        } else {
            alert('No movie found with that title.');
        }
    };
    return (
        <div id="Home">
            <div id="content_container">
                <div id="content">
                    <div id="for_title">
                        <h2>Welcome.</h2>
                        <p>Enchanting stories come to life on the silver screen, offering a journey of emotions and
                            adventures for every movie enthusiast.</p>
                    </div>
                    <div id="for_search">
                        <input type="text" name="search_field" placeholder="Search for movie..." value={searchTerm} onChange={handleSearchChange} autoComplete="off"/>
                        <button onClick={handleSearchClick}>Search</button>
                        {suggestions.length > 0 && (
                            <div className="suggestions">
                                {suggestions.map((movie) => (
                                    <div
                                        key={movie.id}
                                        className="suggestion"
                                        onClick={() => handleSuggestionClick(movie.title)}
                                    >
                                        {movie.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <MoviesContainer />
        </div>
    );
}

export default Home;