import axios from "axios";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Movierated from "./MovieRated";
jest.mock("axios");
describe("Movierated Component", () => {
  const mockMovieData = [
    {
      id: 1,
      posterPath: "image.jpg",
      title: "SuperHero",
      releaseDate: "2022-02-04",
      overview: "Overview 1",
      ratings: 6.0,
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { results: mockMovieData } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("render the component with top-rated movies", async () => {
    render(<Movierated />);
    await waitFor(() => {
      mockMovieData.forEach((movie) => {
        expect(screen.getByText(movie.title)).toBeInTheDocument();
      });
    });
  });

  it("displays search results when the user enters a query", async () => {
    render(<Movierated />);

    fireEvent.change(screen.getByPlaceholderText("Search movies"), {
      target: { value: "SuperHero" },
    });

    await waitFor(() => {
      expect(screen.getByText("SuperHero")).toBeInTheDocument();
    });
  });

  it("returns to top-rated movies when clicking the home button", async () => {
    render(<Movierated />);

    fireEvent.change(screen.getByPlaceholderText("Search movies"), {
      target: { value: "SuperHero" },
    });

    await waitFor(() => {
      expect(screen.getByText("SuperHero")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Home"));
    await waitFor(() => {
      mockMovieData.forEach((movie) => {
        expect(screen.getByText(movie.title)).toBeInTheDocument();
      });
    });
  });
});
