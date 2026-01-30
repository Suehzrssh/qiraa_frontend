import { useEffect, useState } from "react";
import BookList from "./components/BookList";
import Reader from "./components/Reader";
import {
  fetchGenres,
  fetchBooks,
  readBook,
} from "./api/books.js";

export default function App() {
  const [genres, setGenres] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  
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

  useEffect(() => {
    async function restoreSession() {
      const savedBookId = localStorage.getItem("lastReadBookId");
      const savedChapterId = localStorage.getItem("lastReadChapterId");

      if (savedBookId && isInitialLoad) {
        try {
          const fullBook = await readBook(savedBookId);
          setSelectedBook(fullBook);

          if (savedChapterId && fullBook.chapters) {
            const chapter = fullBook.chapters.find(ch => ch.id === savedChapterId);
            if (chapter) setSelectedChapter(chapter);
          }
        } catch (error) {
          console.error("Geri yükleme hatası:", error);
        } finally {
          setIsInitialLoad(false);
        }
      }
    }

    if (genres.length > 0) {
      restoreSession();
    }
  }, [genres]);

  const handleSelectBook = async (book) => {
    const fullBook = await readBook(book.id);
    setSelectedBook(fullBook);
    setSelectedChapter(null);
    
    localStorage.setItem("lastReadBookId", book.id);
    localStorage.removeItem("lastReadChapterId");
  };

  const handleSelectChapter = (chapter) => {
    setSelectedChapter(chapter);
    // Bölümü Kaydet
    localStorage.setItem("lastReadChapterId", chapter.id);
  };

  const handleBackToChapters = () => {
    setSelectedChapter(null);
    localStorage.removeItem("lastReadChapterId");
  };

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
          onSelectBook={handleSelectBook}
        />

        <Reader
          selectedBook={selectedBook}
          selectedChapter={selectedChapter}
          onSelectChapter={handleSelectChapter}
          onBack={handleBackToChapters}
        />
      </main>
    </div>
  );
}