import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Header() {
    const navigate = useNavigate()
    return (
        <header className="header" id="header">
            <div className="container header-container">
                <a href="" className="logo">
                    <i className="fas fa-heart logo-icon"></i>
                    <span className="logo-text">Bron<span className="logo-accent">line Hall</span></span>
                </a>

                <nav className="nav">
                    <ul className="nav-links">
                        <li className="nav-item"><Link to='/' className="nav-link">Bosh sahifa</Link></li>
                        <li className="nav-item"><Link to='/about' className="nav-link">Biz haqimizda</Link></li>
                        <li className="nav-item"><Link to='/contact' className="nav-link">Aloqa</Link></li>
                    </ul>
                    <button className='btn btn-primary' onClick={() => {navigate('./login')}}>Kirish</button>
                </nav>

                <button className="mobile-menu-btn" id="mobile-menu-btn">
                    <i className="fas fa-bars"></i>
                </button>
            </div>

            <div className="mobile-menu" id="mobile-menu">
                <ul className="mobile-nav-links">
                    <li><a href="/" className="mobile-nav-link">Bosh sahifa</a></li>
                    <li><a href="/saroylar" className="mobile-nav-link">Saroylar</a></li>
                    <li><a href="/xizmatlar" className="mobile-nav-link">Xizmatlar</a></li>
                    <li><a href="/galereya" className="mobile-nav-link">Galereya</a></li>
                    <li><a href="/biz-haqimizda" className="mobile-nav-link">Biz haqimizda</a></li>
                    <li><a href="/aloqa" className="mobile-nav-link">Aloqa</a></li>
                    <li><a href="/kirish" className="mobile-nav-link">Kirish</a></li>
                    <li><a href="/royxatdan-otish" className="mobile-nav-link">Ro'yxatdan o'tish</a></li>
                </ul>
            </div>
        </header>
    )
}

export default Header