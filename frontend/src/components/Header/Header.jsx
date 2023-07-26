import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import * as PropTypes from 'prop-types';
import './Header.css';
import Logo from '../../images/Logo.png';

function Header({ user, setUser }) {
  const navigate = useNavigate();
  const disconnect = () => {
    localStorage.clear();
    setUser(null);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <img src={Logo} alt="logo mpm vieu grimoire" />
        <ul>
          <li>
            <NavLink to="/" className="header__link">
              Accueil
            </NavLink>
          </li>
          <li>
            <NavLink to="/Ajouter" className="header__link">
              Ajouter un livre
            </NavLink>
          </li>
          <li>
            {!user ? (
              <NavLink to="/Connexion" className="header__link">
                Se connecter
              </NavLink>
            ) : (
              <span className="header__link" tabIndex={0} role="button" onKeyUp={disconnect} onClick={disconnect}>
                Se déconnecter
              </span>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}

Header.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.string,
    token: PropTypes.string,
  }),
  setUser: PropTypes.func.isRequired,
};

Header.defaultProps = {
  user: null,
};
export default Header;
