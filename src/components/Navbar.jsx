import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext'; // Import AuthContext

function Navbar() {
    const cartItems = useSelector(state => state.cart.items);
    const cartCount = cartItems.length;
    const { currentUser, logout } = useAuth(); // Get auth context data

    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false); // For user dropdown
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const navbarRef = useRef(null);
    const userMenuRef = useRef(null); // Ref for user dropdown

    useEffect(() => {
        fetch('https://e-commerce-api-jsjh.onrender.com/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error('Error fetching categories:', err));

        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
            // Close user menu if clicked outside
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll);

        // Show notification animation on first load
        setTimeout(() => {
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
        }, 1000);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Add animation effect when cart count changes
    useEffect(() => {
        if (cartCount > 0 && navbarRef.current) {
            const cartBtn = navbarRef.current.querySelector('.cart-btn');
            cartBtn.classList.add('cart-pulse');
            setTimeout(() => {
                cartBtn.classList.remove('cart-pulse');
            }, 1000);
        }
    }, [cartCount]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim()) {
            fetch(`https://e-commerce-api-jsjh.onrender.com/products?q=${value}`)
                .then(res => res.json())
                .then(data => {
                    setSuggestions(data.slice(0, 5));
                    setShowSuggestions(true);
                });
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${searchTerm}`);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (id) => {
        navigate(`/product/${id}`);
        setShowSuggestions(false);
        setSearchTerm('');
    };

    const handleCategoryClick = (category) => {
        navigate(`/category/${category}`);
        setShowSuggestions(false);
        setSearchTerm('');
        setIsNavCollapsed(true);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setShowUserMenu(false);
    };

    // Toggle user menu
    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    // Add global styles
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            /* Base Animations */
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes floatUp {
                0% { transform: translateY(0); }
                50% { transform: translateY(-6px); }
                100% { transform: translateY(0); }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            @keyframes glowEffect {
                0% { box-shadow: 0 0 0 rgba(13, 110, 253, 0); }
                50% { box-shadow: 0 0 10px rgba(13, 110, 253, 0.5); }
                100% { box-shadow: 0 0 0 rgba(13, 110, 253, 0); }
            }
            
            @keyframes rotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes shimmer {
                0% { background-position: -100% 0; }
                100% { background-position: 200% 0; }
            }
            
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }
            
            /* Navbar Transitions */
            .navbar {
                transition: all 0.4s ease;
                position: sticky;
                top: 0;
                z-index: 1030;
            }
            
            .navbar.scrolled {
                padding-top: 0.5rem !important;
                padding-bottom: 0.5rem !important;
                box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1) !important;
                backdrop-filter: blur(5px);
                background-color: rgba(33, 37, 41, 0.97) !important;
            }
            
            /* Brand Effects */
            .navbar-brand {
                position: relative;
                overflow: hidden;
            }
            
            .brand-text {
                transition: all 0.5s ease;
                position: relative;
                display: inline-block;
            }
            
            .navbar-brand:hover .brand-text {
                color: #ffffff;
                text-shadow: 0 0 15px rgba(255, 255, 255, 0.7);
                letter-spacing: 0.03em;
            }
            
            .navbar-brand::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 0;
                height: 2px;
                background: linear-gradient(90deg, transparent, #0d6efd, transparent);
                transition: width 0.3s ease;
            }
            
            .navbar-brand:hover::after {
                width: 100%;
            }
            
            /* Nav Link Effects */
            .nav-link {
                position: relative;
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                padding-left: 1rem !important;
                padding-right: 1rem !important;
                margin: 0 0.2rem;
                overflow: hidden;
            }
            
            .nav-link::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 0;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.05);
                transition: width 0.3s ease;
                z-index: -1;
                border-radius: 4px;
            }
            
            .nav-link:hover::before {
                width: 100%;
            }
            
            .nav-link::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                width: 0;
                height: 2px;
                background: linear-gradient(90deg, #0d6efd, #6610f2);
                transition: all 0.3s ease;
                transform: translateX(-50%);
            }
            
            .nav-link:hover::after {
                width: 80%;
            }
            
            .nav-link:hover {
                color: #ffffff !important;
                transform: translateY(-2px);
            }
            
            .nav-link:active {
                transform: translateY(1px);
            }
            
            .nav-link .bi {
                transition: transform 0.3s ease;
                display: inline-block;
            }
            
            .nav-link:hover .bi {
                transform: translateY(-2px);
            }
            
            /* Dropdown Effects */
            .dropdown-toggle::after {
                margin-left: 0.5em;
                vertical-align: 0.15em;
                opacity: 0.7;
                transition: transform 0.3s ease, opacity 0.3s ease;
            }
            
            .dropdown-toggle:hover::after {
                opacity: 1;
                transform: translateY(3px);
            }
            
            .dropdown-menu {
                border: none;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                animation: fadeIn 0.25s ease-out forwards;
                overflow: hidden;
                margin-top: 0.5rem !important;
                background: linear-gradient(145deg, #1e2125, #292e33);
                backdrop-filter: blur(10px);
            }
            
            .dropdown-item {
                transition: all 0.25s ease;
                position: relative;
                padding-top: 0.6rem;
                padding-bottom: 0.6rem;
                overflow: hidden;
            }
            
            .dropdown-item::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(13, 110, 253, 0.1), transparent);
                transition: all 0.6s ease;
            }
            
            .dropdown-item:hover::before {
                left: 100%;
            }
            
            .dropdown-item:hover {
                background-color: rgba(13, 110, 253, 0.15);
                padding-left: 1.8rem;
                color: white;
            }
            
            /* Search Input Effects */
            .search-control {
                background: rgba(55, 65, 81, 0.3) !important;
                border: 1px solid rgba(108, 117, 125, 0.5) !important;
                transition: all 0.3s ease !important;
                box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
            }
            
            .search-control:focus {
                background: rgba(55, 65, 81, 0.5) !important;
                border-color: #0d6efd !important;
                box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
            }
            
            .search-btn {
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
                position: relative;
                overflow: hidden;
                z-index: 1;
            }
            
            .search-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: all 0.6s ease;
                z-index: -1;
            }
            
            .search-btn:hover::before {
                left: 100%; 
            }
            
            /* Cart Button Effects */
            .cart-btn {
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .cart-btn:hover {
                transform: translateY(-3px);
            }
            
            .cart-btn:active {
                transform: translateY(1px);
            }
            
            .cart-count {
                position: absolute;
                top: -8px;
                right: -8px;
                background: #dc3545;
                color: white;
                border-radius: 50%;
                min-width: 18px;
                height: 18px;
                font-size: 0.7rem;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .cart-pulse {
                animation: pulse 0.5s ease;
            }
            
            /* Notification Effects */
            .notification {
                position: fixed;
                top: 80px;
                right: 20px;
                background: rgba(40, 167, 69, 0.9);
                color: white;
                padding: 1rem;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                transform: translateX(200%);
                transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                z-index: 1100;
                backdrop-filter: blur(5px);
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            /* Search Suggestions */
            .search-suggestions {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: linear-gradient(145deg, #1e2125, #292e33);
                border-radius: 0 0 8px 8px;
                overflow: hidden;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                z-index: 1050;
                max-height: 300px;
                overflow-y: auto;
                animation: fadeIn 0.25s ease-out forwards;
                backdrop-filter: blur(10px);
            }
            
            .suggestion-item {
                padding: 0.8rem 1rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
            }
            
            .suggestion-item:hover {
                background-color: rgba(13, 110, 253, 0.15);
                padding-left: 1.5rem;
            }
            
            .suggestion-img {
                width: 40px;
                height: 40px;
                object-fit: cover;
                border-radius: 4px;
                margin-right: 10px;
                background: rgba(255, 255, 255, 0.1);
                transition: all 0.3s ease;
            }
            
            .suggestion-item:hover .suggestion-img {
                transform: scale(1.1);
            }
            
            .suggestion-name {
                font-weight: 500;
                margin-bottom: 2px;
                transition: all 0.3s ease;
            }
            
            .suggestion-price {
                font-size: 0.85rem;
                color: #adb5bd;
            }
            
            .suggestion-item:hover .suggestion-name {
                color: #0d6efd;
            }
            
            /* User Account Menu */
            .user-menu {
                position: absolute;
                top: 100%;
                right: 0;
                width: 220px;
                background: linear-gradient(145deg, #1e2125, #292e33);
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                z-index: 1050;
                animation: fadeIn 0.25s ease-out forwards;
                margin-top: 0.5rem;
                backdrop-filter: blur(10px);
            }
            
            .user-menu-header {
                padding: 1rem;
                background: linear-gradient(90deg, #0d6efd, #6610f2);
                color: white;
                border-radius: 8px 8px 0 0;
            }
            
            .user-menu-item {
                padding: 0.8rem 1rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
            }
            
            .user-menu-item:hover {
                background-color: rgba(13, 110, 253, 0.15);
                padding-left: 1.5rem;
            }
            
            .user-menu-item i {
                margin-right: 10px;
                opacity: 0.7;
                transition: all 0.3s ease;
            }
            
            .user-menu-item:hover i {
                opacity: 1;
                transform: translateX(3px);
            }
            
            .user-menu-footer {
                padding: 0.8rem 1rem;
                font-size: 0.85rem;
                color: #adb5bd;
                text-align: center;
                background: rgba(0, 0, 0, 0.2);
            }
            
            /* Auth Buttons */
            .auth-btn {
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                position: relative;
                overflow: hidden;
                z-index: 1;
                margin-left: 0.5rem;
            }
            
            .auth-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: all 0.6s ease;
                z-index: -1;
            }
            
            .auth-btn:hover::before {
                left: 100%;
            }
            
            .auth-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
            }
            
            .auth-btn:active {
                transform: translateY(1px);
            }
            
            /* User Avatar */
            .user-avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: linear-gradient(135deg, #0d6efd, #6610f2);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                border: 2px solid transparent;
            }
            
            .user-avatar:hover {
                transform: scale(1.1);
                border-color: rgba(255, 255, 255, 0.5);
                box-shadow: 0 0 15px rgba(13, 110, 253, 0.5);
            }
            
            /* Profile Menu Toggle Animation */
            .profile-toggle {
                transition: all 0.3s ease;
            }
            
            .profile-toggle.active {
                transform: rotate(180deg);
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <>
            <nav
                ref={navbarRef}
                className={`navbar navbar-expand-lg navbar-dark bg-dark ${isScrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    <Link to="/" className="navbar-brand">
                        <span className="brand-text">ShopEase</span>
                    </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                        aria-controls="navbarContent"
                        aria-expanded={!isNavCollapsed}
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to="/" className="nav-link">
                                    <i className="bi bi-house-door me-1"></i> Home
                                </Link>
                            </li>

                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="categoriesDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    <i className="bi bi-grid me-1"></i> Categories
                                </a>
                                <ul className="dropdown-menu dropdown-menu-dark shadow border-0 py-1">
                                    {categories.map(category => (
                                        <li key={category.id}>
                                            <Link
                                                className="dropdown-item py-2"
                                                to={`/category/${category.name}`}
                                                onClick={() => setIsNavCollapsed(true)}
                                            >
                                                {category.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>

                            {/* <li className="nav-item">
                                <Link to="/products" className="nav-link">
                                    <i className="bi bi-shop me-1"></i> Shop
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/about" className="nav-link">
                                    <i className="bi bi-info-circle me-1"></i> About
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/contact" className="nav-link">
                                    <i className="bi bi-envelope me-1"></i> Contact
                                </Link>
                            </li> */}
                        </ul>

                        <div className="d-flex align-items-center">
                            <div className="position-relative me-2" ref={searchRef}>
                                <form className="d-flex" onSubmit={handleSubmit}>
                                    <input
                                        className="form-control search-control me-2 text-light"
                                        type="search"
                                        placeholder="Search products..."
                                        aria-label="Search"
                                        value={searchTerm}
                                        onChange={handleSearch}
                                    />
                                    <button className="btn btn-outline-primary search-btn" type="submit">
                                        <i className="bi bi-search"></i>
                                    </button>
                                </form>

                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="search-suggestions">
                                        {suggestions.map((product) => (
                                            <div
                                                key={product.id}
                                                className="suggestion-item text-light"
                                                onClick={() => handleSuggestionClick(product.id)}>
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="suggestion-img"
                                                />
                                                <div>
                                                    <div className="suggestion-name">{product.title}</div>
                                                    <div className="suggestion-price">${product.price}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Link to="/cart" className="btn btn-outline-light cart-btn position-relative me-2">
                                <i className="bi bi-cart3"></i>
                                {cartCount > 0 && (
                                    <span className="cart-count">{cartCount}</span>
                                )}
                            </Link>

                            {currentUser ? (
                                <div className="position-relative ms-2" ref={userMenuRef}>
                                    <div
                                        className="user-avatar"
                                        onClick={toggleUserMenu}>
                                        {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() :
                                            currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
                                    </div>

                                    {showUserMenu && (
                                        <div className="user-menu">
                                            <div className="user-menu-header">
                                                <div className="fw-bold">{currentUser.displayName || 'Welcome'}</div>
                                                <div className="small text-light-50">{currentUser.email}</div>
                                            </div>
                                            <div
                                                className="user-menu-item text-light"
                                                onClick={handleLogout}>
                                                <i className="bi bi-box-arrow-right"></i> Logout
                                            </div>
                                            <div className="user-menu-footer">
                                                Member since {currentUser.metadata?.creationTime ?
                                                    new Date(currentUser.metadata.creationTime).toLocaleDateString() :
                                                    'recently'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="auth-buttons">
                                    <Link to="/login" className="btn btn-outline-light auth-btn me-2">
                                        <i className="bi bi-person"></i> Login
                                    </Link>
                                    <Link to="/signup" className="btn btn-primary auth-btn">
                                        <i className="bi bi-person-plus"></i> Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Notification toast */}
            <div className={`notification ${showNotification ? 'show' : ''}`}>
                <i className="bi bi-check-circle me-2"></i>
                Welcome to ShopEase!
            </div>
        </>
    );
}

export default Navbar;
