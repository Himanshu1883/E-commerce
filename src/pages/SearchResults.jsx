<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

function SearchResults() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const dispatch = useDispatch();


    const query = new URLSearchParams(location.search).get('q');

    useEffect(() => {
        setLoading(true);


        fetch(`https://e-commerce-api-jsjh.onrender.com/products?q=${query}`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching search results:', err);
                setLoading(false);
            });
    }, [query]);

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    if (loading) {
        return <div className="container mt-5 text-center"><div className="spinner-border" role="status"></div></div>;
    }

    return (
        <div className="container mt-4">
            <h2>Search Results for "{query}"</h2>

            {products.length === 0 ? (
                <div className="alert alert-info mt-4">
                    No products found matching your search.
                </div>
            ) : (
                <div className="row">
                    {products.map(product => (
                        <div key={product.id} className="col-md-4 mb-4">
                            <div className="card h-100">
                                <img src={product.image} className="card-img-top" alt={product.title} style={{ height: '200px', objectFit: 'cover' }} />
                                <div className="card-body">
                                    <h5 className="card-title">{product.title}</h5>
                                    <p className="card-text text-truncate">{product.description}</p>
                                    <p className="card-text fw-bold">₹{product.price}</p>
                                    <div className="d-flex justify-content-between">
                                        <Link to={`/product/${product.id}`} className="btn btn-outline-primary">View Details</Link>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleAddToCart(product)}
                                            disabled={product.stock <= 0}
                                        >
                                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                        </button>
                                    </div>
                                </div>
                                <div className="card-footer text-muted">
                                    <small>Category: <Link to={`/category/${product.category}`}>{product.category}</Link></small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

=======
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

function SearchResults() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const dispatch = useDispatch();


    const query = new URLSearchParams(location.search).get('q');

    useEffect(() => {
        setLoading(true);


        fetch(`http://localhost:5000/products?q=${query}`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching search results:', err);
                setLoading(false);
            });
    }, [query]);

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    if (loading) {
        return <div className="container mt-5 text-center"><div className="spinner-border" role="status"></div></div>;
    }

    return (
        <div className="container mt-4">
            <h2>Search Results for "{query}"</h2>

            {products.length === 0 ? (
                <div className="alert alert-info mt-4">
                    No products found matching your search.
                </div>
            ) : (
                <div className="row">
                    {products.map(product => (
                        <div key={product.id} className="col-md-4 mb-4">
                            <div className="card h-100">
                                <img src={product.image} className="card-img-top" alt={product.title} style={{ height: '200px', objectFit: 'cover' }} />
                                <div className="card-body">
                                    <h5 className="card-title">{product.title}</h5>
                                    <p className="card-text text-truncate">{product.description}</p>
                                    <p className="card-text fw-bold">₹{product.price}</p>
                                    <div className="d-flex justify-content-between">
                                        <Link to={`/product/${product.id}`} className="btn btn-outline-primary">View Details</Link>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleAddToCart(product)}
                                            disabled={product.stock <= 0}
                                        >
                                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                        </button>
                                    </div>
                                </div>
                                <div className="card-footer text-muted">
                                    <small>Category: <Link to={`/category/${product.category}`}>{product.category}</Link></small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

>>>>>>> 3ee5ce2c11e67ef438a0f1bf6266aa913f7b6820
export default SearchResults;