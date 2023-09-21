import React, { useEffect, useState } from "react";
import axios from "axios";
import "./movieRated.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Modal,
  Navbar,
  Container,
  InputGroup,
  FormControl,
} from "react-bootstrap";

const api_movierated =
  "https://api.themoviedb.org/3/movie/top_rated?api_key=5ebf30ca6cc87e0aab48bf1e4390dfca";
const image_basepath = "https://image.tmdb.org/t/p/w500";

const Movierated = () => {
  const [movieData, setMovieData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);
  async function get_movie() {
    try {
      const response = await axios.get(api_movierated);
      const data = response.data.results;
      const movie_data = data.map((movie) => ({
        id: movie.id,
        posterPath: `${image_basepath}/${movie.poster_path}`,
        title: movie.title,
        releaseDate: movie.release_date,
        overview: movie.overview,
        ratings: movie.vote_average,
      }));
      setMovieData(movie_data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    get_movie();
  }, []);

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const goHome = () => {
    setSearchQuery("");
    get_movie();
  };
  const handleSearchInputChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      setSearchTriggered(true);
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=5ebf30ca6cc87e0aab48bf1e4390dfca&query=${query}`
        );
        const data = response.data.results;
        const results = data.map((movie) => ({
          id: movie.id,
          posterPath:
            movie.poster_path == null
              ? "./no-image.png"
              : `${image_basepath}/${movie.poster_path}`,
          title: movie.title,
          releaseDate: movie.release_date,
          overview: movie.overview,
          ratings: movie.vote_average,
        }));
        setMovieData(results);
      } catch (error) {
        console.error(error);
      }
    } else {
      setSearchTriggered(false);
    }
  };

  return (
    <div>
      <Navbar class="navbar" bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <button type="button" onClick={goHome} class="btn btn-light">
            Home
          </button>
        </Container>
        <div className="search-box">
          <InputGroup>
            <FormControl
              type="search"
              placeholder="Search movies"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          </InputGroup>
        </div>
      </Navbar>

      <div className="movierated-container">
        {movieData.length === 0 && searchTriggered ? (
          <p className="no-results">No results found...</p>
        ) : (
          movieData.map((movie, index) => (
            <div
              key={index}
              className="movie_detail"
              onClick={() => openModal(movie)}
            >
              <h1>{movie.title}</h1>
              <img src={movie.posterPath} alt="" />
              <button className="btn btn-dark">Know More</button>
            </div>
          ))
        )}
      </div>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedMovie?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            className="modal-img"
            src={selectedMovie?.posterPath}
            alt="image_poster"
          />
          <p>
            <span>Release Date:</span> {selectedMovie?.releaseDate}
          </p>
          <p>
            <span>Ratings:</span> {selectedMovie?.ratings}
          </p>
          <p>
            <span>Overview:</span> {selectedMovie?.overview}
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Movierated;
