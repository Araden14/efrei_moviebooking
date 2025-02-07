import { useState, useEffect, ChangeEvent } from "react";
import DefaultLayout from "@/layouts/default";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button as HerouiButton } from "@heroui/button";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@heroui/modal";
import {Button} from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import {Tabs, Tab} from "@heroui/tabs";
import { title } from "@/components/primitives";

// --- Interfaces for type safety ---
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

interface Reservation {
  id: number;
  movieId: number;
  creneaux: number[];
  createdAt: string;
  updatedAt: string;
}

interface FeaturedMovie {
  id: number;
  titre: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  // Optional reservation data attached after matching
  reservation?: Reservation;
}

// --- Mapping of creneau numbers to display hours ---
const creneauxHours: { [key: number]: string } = {
  5: "14:00",
  7: "16:00",
  9: "18:00",
  10: "20:00",
};

export default function IndexPage() {
  // --- Movies tab state ---
  // The search input remains empty initially but the effective query will be "action"
  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("action");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [moviesLoading, setMoviesLoading] = useState<boolean>(false);

  // --- Featured Movies tab state ---
  const [featuredMovies, setFeaturedMovies] = useState<FeaturedMovie[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState<boolean>(false);
  const [bookingLoadingReservationId, setBookingLoadingReservationId] = useState<number | null>(null);

  // --- Modal state for movie details (Movies tab) ---
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // --- Active tab: "movies" or "featured" (NextUI Tabs are controlled by a string value) ---
  const [activeTab, setActiveTab] = useState<string>("movies");

  // --- Debounce the search input: wait 2 seconds after the user stops typing ---
  useEffect(() => {
    // If the search input is empty, we use the default "action" query.
    if (searchInput.trim() === "") {
      setDebouncedSearch("action");
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // --- Fetch movies whenever the debounced search query changes ---
  useEffect(() => {
    const fetchMovies = async () => {
      setMoviesLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/movies?search=${debouncedSearch}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        // Assuming the API returns { results: Movie[] }
        setMovies(data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setMoviesLoading(false);
      }
    };

    fetchMovies();
  }, [debouncedSearch]);

  // --- Fetch featured movies and reservations on mount ---
  useEffect(() => {
    const fetchFeaturedAndReservations = async () => {
      setFeaturedLoading(true);
      try {
        const token = localStorage.getItem("token");
        const [moviesRes, reservationsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/movies/available`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/reservations/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const moviesData: FeaturedMovie[] = await moviesRes.json();
        const reservationsData: Reservation[] = await reservationsRes.json();

        // For each featured movie, attach the matching reservation (if any) using movie id.
        const featured = moviesData.map((movie) => {
          const reservation = reservationsData.find((r) => r.movieId === movie.id);
          return { ...movie, reservation };
        });
        setFeaturedMovies(featured);
      } catch (error) {
        console.error("Error fetching featured movies:", error);
      } finally {
        setFeaturedLoading(false);
      }
    };

    fetchFeaturedAndReservations();
  }, []);

  // --- Event handlers ---
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleModalOpen = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  // Book a creneau for a featured movie by sending a POST to /reservations.
  const handleBook = async (reservationId: number, creneau: number) => {
    try {
      setBookingLoadingReservationId(reservationId);
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reservationid: reservationId, creneau }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert("Booking failed: " + errorData.message);
      } else {
        const data = await response.json();
        alert(data.message);
        // Optionally update the UI by removing the booked slot from the movie’s reservation.
        setFeaturedMovies((prev) =>
          prev.map((movie) => {
            if (movie.reservation && movie.reservation.id === reservationId) {
              return {
                ...movie,
                reservation: {
                  ...movie.reservation,
                  creneaux: movie.reservation.creneaux.filter((c) => c !== creneau),
                },
              };
            }
            return movie;
          })
        );
      }
    } catch (error) {
      console.error("Error booking reservation:", error);
      alert("An error occurred while booking.");
    } finally {
      setBookingLoadingReservationId(null);
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 md:py-10">
        <div className="inline-block max-w-lg text-center">
          <span className={title()}>Bienvenue dans&nbsp;</span>
          <span className={title({ color: "violet" })}>CineMax&nbsp;</span>
          <br />
          <span className={title()}>Votre cinéma connecté</span>
        </div>

        {/* --- NextUI Tabs: Movies and Featured Movies --- */}
        <Tabs
          className="w-full max-w-4xl"
        >
          <Tab key="movies" title="Films">
            {/* Search Input */}
            <div className="flex justify-center my-4">
              <Input
                type="search"
                placeholder="Search movies..."
                value={searchInput}
                onChange={handleSearchChange}
                className="max-w-xs"
              />
            </div>

            {/* Movies List */}
            {moviesLoading ? (
              <div className="flex justify-center my-8">
                <Spinner>Loading movies...</Spinner>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {movies.map((movie) => (
                  <Card key={movie.id} className="p-4">
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      loading="lazy"
                      className="w-full object-cover mb-2"
                    />
                    <h3 className="text-lg font-bold">{movie.title}</h3>
                    <HerouiButton onClick={() => handleModalOpen(movie)}>
                      View Details
                    </HerouiButton>
                  </Card>
                ))}
              </div>
            )}

            {/* NextUI Modal for movie details */}
            <Modal isOpen={isModalOpen} onClose={handleModalClose}>
              {selectedMovie && (
                <>
                  <ModalHeader>{selectedMovie.title}</ModalHeader>
                  <ModalBody>
                    <img
                      src={`https://image.tmdb.org/t/p/w300${selectedMovie.backdrop_path}`}
                      alt={selectedMovie.title}
                      loading="lazy"
                      className="w-full object-cover mb-4"
                    />
                    <p>{selectedMovie.overview}</p>
                    <p>
                      <strong>Release Date:</strong> {selectedMovie.release_date}
                    </p>
                    <p>
                      <strong>Rating:</strong> {selectedMovie.vote_average}
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <Button onClick={handleModalClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </Modal>
          </Tab>

          <Tab key="featured" title="Films en salle">
            {featuredLoading ? (
              <div className="flex justify-center my-8">
                <Spinner>Loading featured movies...</Spinner>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featuredMovies.map((movie) => (
                  <Card key={movie.id} className="p-4">
                    <h3 className="text-lg font-bold">{movie.titre}</h3>
                    <p>{movie.description}</p>
                    <p>
                      <strong>Release Date:</strong>{" "}
                      {new Date(movie.date).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    {movie.reservation && movie.reservation.creneaux.length > 0 ? (
                      <div className="mt-2">
                        <p className="mb-1">Available Slots:</p>
                        <div className="flex flex-wrap gap-2">
                          {movie.reservation.creneaux.map((slot) => (
                            <HerouiButton
                              key={slot}
                              onClick={() => handleBook(movie.reservation!.id, slot)}
                              disabled={bookingLoadingReservationId === movie.reservation!.id}
                            >
                              {bookingLoadingReservationId === movie.reservation!.id ? (
                                <Spinner size="sm" />
                              ) : (
                                creneauxHours[slot] || `Slot ${slot}`
                              )}
                            </HerouiButton>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm italic">No available slots</p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </Tab>
        </Tabs>
      </section>
    </DefaultLayout>
  );
}
