import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Navbar() {
    const cartItems = useSelector(state => state.cart.items);
    const cartCount = cartItems.length;

    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const navigate = useNavigate();
    const searchRef = useRef(null);

    useEffect(() => {
        fetch('http://localhost:5000/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error('Error fetching categories:', err));

        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim()) {
            fetch(`http://localhost:5000/products?q=${value}`)
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
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            .navbar-brand span {
                transition: color 0.3s ease, text-shadow 0.3s ease;
            }
            
            .navbar-brand:hover span.brand-text {
                color: #ffffff !important;
                text-shadow: 0 0 8px rgba(255,255,255,0.4);
            }
            
            .nav-link {
                position: relative;
                transition: all 0.3s ease;
            }
            
            .nav-link::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                width: 0;
                height: 2px;
                background: #0d6efd;
                transition: all 0.3s ease;
                transform: translateX(-50%);
            }
            
            .nav-link:hover::after {
                width: 70%;
            }
            
            .nav-link:hover {
                color: #ffffff !important;
            }
            
            .dropdown-toggle::after {
                margin-left: 0.5em;
                vertical-align: 0.15em;
                opacity: 0.7;
                transition: transform 0.3s ease, opacity 0.3s ease;
            }
            
            .dropdown-toggle:hover::after {
                opacity: 1;
                transform: translateY(2px);
            }
            
            .suggestion-item {
                transition: all 0.2s ease;
            }
            
            .suggestion-item:hover {
                background-color: rgba(255,255,255,0.1);
                padding-left: 10px;
            }
            
            .cart-badge {
                transition: all 0.3s ease;
            }
            
            .cart-btn:hover .cart-badge {
                transform: scale(1.2);
            }
            
            .cart-btn {
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .cart-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: all 0.6s ease;
            }
            
            .cart-btn:hover::before {
                left: 100%;
            }
            
            .category-badge {
                transition: all 0.3s ease;
            }
            
            .category-badge:hover {
                transform: translateY(-3px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            
            .search-suggestions {
                animation: fadeIn 0.3s ease-out forwards;
            }
            
            .navbar-toggler:focus {
                box-shadow: none;
            }
            
            .notification-dot {
                position: absolute;
                top: -5px;
                right: -5px;
                width: 10px;
                height: 10px;
                background-color: #dc3545;
                border-radius: 50%;
                animation: pulse 1.5s infinite;
            }
            
            .dropdown-menu {
                animation: fadeIn 0.25s ease-out forwards;
            }
            
            .dropdown-item {
                transition: all 0.2s ease;
            }
            
            .dropdown-item:hover {
                background-color: rgba(13, 110, 253, 0.2);
                padding-left: 1.5rem;
            }
            
            /* Custom category dropdown styling */
            .custom-dropdown-toggle .dropdown-icon {
                display: inline-block;
                transition: transform 0.3s ease;
                font-size: 12px;
                margin-left: 5px;
            }
            
            .custom-dropdown-toggle:hover .dropdown-icon {
                transform: translateY(3px);
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <span className="fs-4 fw-bold brand-text">E-Shop</span>
                    {/* <span className="badge bg-primary ms-2 rounded-pill">BETA</span> */}
                </Link>

                <button
                    className="navbar-toggler border-0"
                    type="button"
                    aria-controls="navbarContent"
                    aria-expanded={!isNavCollapsed}
                    aria-label="Toggle navigation"
                    onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link px-3 fw-medium" to="/" onClick={() => setIsNavCollapsed(true)}>
                                <i className="bi bi-house-door me-1"></i> Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-3 fw-medium" to="/add" onClick={() => setIsNavCollapsed(true)}>
                                <i className="bi bi-plus-circle me-1"></i> Add Product
                            </Link>
                        </li>
                        {categories.length > 0 && (
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link px-3 fw-medium custom-dropdown-toggle d-flex align-items-center"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <i className="bi bi-grid me-1"></i>
                                    <span>Categories</span>
                                    <i className="bi bi-chevron-down dropdown-icon ms-1"></i>
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
                        )}
                    </ul>
                    <div className="position-relative me-lg-3 mb-3 mb-lg-0 flex-grow-1 flex-lg-grow-0" ref={searchRef} style={{ maxWidth: '320px' }}>
                        <form onSubmit={handleSubmit} className="input-group">
                            <input
                                type="text"
                                className="form-control bg-dark text-light border-secondary"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={handleSearch}
                                onFocus={() => searchTerm && setShowSuggestions(true)}
                                style={{ transition: 'all 0.3s ease' }}
                            />
                            <button
                                className="btn btn-outline-light"
                                type="submit"
                                style={{ transition: 'all 0.3s ease' }}
                                onMouseEnter={(e) => e.currentTarget.classList.add('btn-light', 'text-dark')}
                                onMouseLeave={(e) => e.currentTarget.classList.remove('btn-light', 'text-dark')}
                            >
                                <i className="bi bi-search"></i>
                            </button>
                        </form>

                        {showSuggestions && (
                            <div className="position-absolute top-100 start-0 mt-1 w-100 bg-dark text-light shadow rounded z-3 search-suggestions" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                {suggestions.length > 0 ? (
                                    <div className="px-3 py-2 border-bottom border-secondary">
                                        <small className="text-muted">Products</small>
                                        {suggestions.map(item => (
                                            <div
                                                key={item.id}
                                                className="py-2 border-bottom border-secondary d-flex align-items-center suggestion-item"
                                                onClick={() => handleSuggestionClick(item.id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="d-flex flex-column">
                                                    <span className="fw-medium text-light">{item.title}</span>
                                                    <span className="small text-success">₹{item.price}</span>
                                                </div>
                                                <i className="bi bi-arrow-right-short ms-auto"></i>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-3 text-muted">No products found</div>
                                )}

                                {categories.length > 0 && (
                                    <div className="px-3 py-2">
                                        <small className="text-muted">Categories</small>
                                        <div className="d-flex flex-wrap gap-2 mt-2">
                                            {categories.map(category => (
                                                <span
                                                    key={category.id}
                                                    className="badge bg-secondary rounded-pill px-3 py-2 category-badge"
                                                    onClick={() => handleCategoryClick(category.name)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {category.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <Link
                        className="btn btn-primary d-flex align-items-center gap-2 cart-btn position-relative"
                        to="/cart"
                        onClick={() => setIsNavCollapsed(true)}
                    >
                        <div className="position-relative">
                            <i className="bi bi-cart3"></i>
                            {cartCount > 0 && <div className="notification-dot"></div>}
                        </div>
                        <span>Cart</span>
                        {cartCount > 0 && (
                            <span className="badge bg-light text-dark rounded-circle cart-badge">{cartCount}</span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;