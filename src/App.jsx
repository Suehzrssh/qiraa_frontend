import { useEffect, useState } from "react";
import BookList from "./components/BookList";
import Reader from "./components/Reader";
import {
  fetchGenres,
  fetchBooks,
  fetchBook,
} from "./api/books.js";

export default function App() {
  const [genres, setGenres] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  useEffect(() => {
    async function load() {
      const genresData = await fetchGenres();
      const booksData = await fetchBooks();

      const composedGenres = genresData.map((g) => ({
        ...g,
        books: booksData.filter((b) => b.genreId === g.id),
      }));

      setGenres(composedGenres);
    }

    load();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-serif">
      <header className="border-b border-neutral-800 p-6 text-center">
        <h1 className="text-3xl tracking-wide">Qira’a</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Read. Reflect. Remain.
        </p>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <BookList
          genres={genres}
          onSelectBook={async (book) => {
            const fullBook = await fetchBook(book.id); // ✔ FIXED
            setSelectedBook(fullBook);
            setSelectedChapter(null);
          }}
        />

        <Reader
          selectedBook={selectedBook}
          selectedChapter={selectedChapter}
          onSelectChapter={(chapter) => {
            setSelectedChapter(chapter);
          }}
          onBack={() => setSelectedChapter(null)}
        />
      </main>
    </div>
  );
}
