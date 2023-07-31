/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookItem from '../../components/Books/BookItem/BookItem';
import Banner from '../../images/library.jpg';
import './Home.css';
import { getBooks } from '../../lib/common';

function Home() {
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(true);
  const displayBooks = () => (books ? books.map((book) => <BookItem size={2} book={book} key={book.id} />) : <h1>Vide</h1>);

  useEffect(() => {
    async function getBooksList() {
      const data = await getBooks();
      if (data) {
        setBooks(data);
        setLoading(false);
      }
    }
    getBooksList();
  }, []);
  const backgroundImageStyle = { backgroundImage: `url(${Banner})` };
  return (
    <div className="home home__banner" style={backgroundImageStyle}>
      <main className="home__main">
        <header className="home__header">
          <h1 className="home__title">Nos Livres</h1>
          <h2 className="home__text">à lire et à relire</h2>
          <Link to="/Ajouter" className="home__btn">
            <span className="home__btn--plus">+ </span>
            Ajouter un livre
          </Link>
        </header>
        <section className="booklist">{loading ? <h1 className="load">Chargement</h1> : displayBooks()}</section>
      </main>
    </div>
  );
}

export default Home;
