import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

// Debug (optional)
console.log("http://localhost:4000/books");

/* =======================
   GENRES
======================= */

// all genres
export const fetchGenres = async () => {
  const res = await api.get("/genres");
  return res.data;
};

/* =======================
   BOOKS
======================= */

// all books
export const fetchBooks = async () => {
  const res = await api.get("/books");
  return res.data;
};

// one book
export const fetchBook = async (bookId) => {
  const res = await api.get(`/books/${bookId}`);
  return res.data;
};

// create book (optional, but useful)
export const createBook = async (data) => {
  const res = await api.post("/books", data);
  return res.data;
};

// delete book
export const deleteBook = async (bookId) => {
  const res = await api.delete(`/books/${bookId}`);
  return res.data;
};

/* =======================
   CHAPTERS
======================= */

// all chapters of a book
export const fetchChapters = async (bookId) => {
  const res = await api.get(`/books/${bookId}/chapters`);
  return res.data;
};

// one chapter of a book
export const fetchChapter = async (bookId, chapterId) => {
  const res = await api.get(`/books/${bookId}/chapters/${chapterId}`);
  return res.data;
};

// create chapter
export const createChapter = async (bookId, data) => {
  const res = await api.post(`/books/${bookId}/chapters`, data);
  return res.data;
};

// delete chapter
export const deleteChapter = async (bookId, chapterId) => {
  const res = await api.delete(`/books/${bookId}/chapters/${chapterId}`);
  return res.data;
};

export const readBook = async (bookId) => {
  const res = await api.get(`/books/${bookId}/read`);
  return res.data;
};


export default api;
