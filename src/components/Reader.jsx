export default function Reader({
  selectedBook,
  selectedChapter,
  onSelectChapter,
  onBack,
}) {
  return (
    <section className="md:col-span-2 bg-neutral-900 rounded-2xl p-6">
      {!selectedBook && (
        <div className="text-center text-neutral-400 mt-20">
          Select a book to begin reading
        </div>
      )}

      {selectedBook && (
        <>
          {/* BOOK VIEW (accordion closed) */}
          {!selectedChapter && (
            <>
              {/* Book header */}
              <div className="flex gap-6 mb-6">
                {selectedBook.image && (
                  <img
                    src={selectedBook.image}
                    className="w-32 h-44 object-cover rounded-xl"
                    alt={selectedBook.title}
                  />
                )}

                <div>
                  <h2 className="text-2xl mb-1">
                    {selectedBook.title}
                  </h2>

                  <p className="text-neutral-400">
                    {selectedBook.author}
                  </p>

                  {selectedBook.info && (
                    <p className="mt-1 text-sm text-neutral-500 leading-snug">
                      {selectedBook.info}
                    </p>
                  )}
                </div>
              </div>

              {/* Chapters */}
              <h3 className="mb-2 text-neutral-300">Chapters</h3>
              <ul className="space-y-2">
                {selectedBook.chapters?.map((ch) => (
                  <li
                    key={ch.id}
                    onClick={() => onSelectChapter(ch)}
                    className="cursor-pointer p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700"
                  >
                    {ch.title}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* CHAPTER VIEW (accordion open) */}
          {selectedChapter && (
            <article className="prose prose-invert max-w-none">
              <button
                onClick={onBack}
                className="text-sm mb-4 text-neutral-400 hover:text-neutral-200"
              >
                ← Back to chapters
              </button>

              <h2 className="text-center uppercase">
                {selectedChapter.title}
              </h2>

              {selectedChapter.content
                ?.split(/\n\s*\n/)
                .map((para, index) => (
                  <p
                    key={index}
                    className="mb-4 indent-8 leading-relaxed text-justify"
                  >
                    {para}
                  </p>
                ))}
            </article>
          )}
        </>
      )}
    </section>
  );
}
