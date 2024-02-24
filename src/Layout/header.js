import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from 'react-redux';
import { logout } from '../Reducer/authSlice';
import './Header.css';

function Header() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
};
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark">
        <div className="container">
          <h1 className="navbar-brand">Welcome to Our Mail Box</h1>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt}/> Logout
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
