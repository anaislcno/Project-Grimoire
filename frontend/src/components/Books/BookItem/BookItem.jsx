import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { displayStars } from '../../../lib/functions';
import './BookItem.css';

function BookItem({ book, size }) {
  let title;
  switch (size) {
    case 2:
      title = <h2>{book.title}</h2>;
      break;
    case 3:
      title = <h3>{book.title}</h3>;
      break;
    default:
      title = <h2>{book.title}</h2>;
      break;
  }
  return (
    <Link to={`/livre/${book.id}`} className="book__item">
      <article>
        <img className="book__img" src={book.imageUrl} alt={`${book.title}, ${book.author} - ${book.year}`} />
        <div className="book__info">
          <div className="book__rating">{displayStars(book.averageRating)}</div>
          {title}
          <p>{book.author}</p>
          <p>{book.year}</p>
          <p>{book.genre}</p>
        </div>
      </article>
    </Link>
  );
}

BookItem.propTypes = {
  size: PropTypes.number.isRequired,
  book: PropTypes.shape({
    id: PropTypes.string,
    userId: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    year: PropTypes.number,
    imageUrl: PropTypes.string,
    genre: PropTypes.string,
    ratings: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string,
        grade: PropTypes.number,
      }),
    ),
    averageRating: PropTypes.number,
  }).isRequired,
};
export default BookItem;
