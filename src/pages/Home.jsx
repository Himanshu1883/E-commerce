<<<<<<< HEAD
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
    const [products, setProducts] = useState([]);
    const [ads, setAds] = useState([]);
    const [reviews, setReviews] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const loadAllReviews = () => {
            const allReviews = {};
            axios.get('https://e-commerce-api-jsjh.onrender.com/products')
                .then(res => {
                    const productsData = res.data;
                    setProducts(productsData);
                    productsData.forEach(product => {
                        const productId = product.id;
                        const productReviews = JSON.parse(localStorage.getItem(`reviews-${productId}`)) || [];
                        allReviews[productId] = productReviews;
                    });
                    setReviews(allReviews);
                })
                .catch(err => console.log('Error loading products:', err));
        };

        loadAllReviews();

        axios.get('https://e-commerce-api-jsjh.onrender.com/ads')
            .then(res => setAds(res.data))
            .catch(err => console.log('Error loading ads:', err));
    }, []);

    const getAverageRating = (productId) => {
        const productReviews = reviews[productId] || [];
        if (productReviews.length === 0) return 0;
        const totalRating = productReviews.reduce((acc, review) => acc + review.rating, 0);
        return (totalRating / productReviews.length).toFixed(1);
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '★';
        if (halfStar) stars += '✩';
        for (let i = 0; i < emptyStars; i++) stars += '☆';
        return stars;
    };

    const handleCardClick = (e, productId) => {
        if (
            e.target.tagName === 'BUTTON' ||
            e.target.closest('button') ||
            e.target.tagName === 'A' ||
            e.target.closest('a')
        ) {
            return;
        }
        navigate(`/product/${productId}`);
    };

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        dispatch(addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1,
        }));
        toast.success(`${product.title} added to cart!`, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
        });
    };

    const handleBuyNow = (e, product) => {
        e.stopPropagation();
        dispatch(addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1,
        }));
        navigate('/');
    };

    useEffect(() => {
        if (ads.length > 0 && window.bootstrap) {
            const el = document.querySelector('#advertCarousel');
            new window.bootstrap.Carousel(el, {
                interval: 2000,
                ride: 'carousel',
            });
        }
    }, [ads]);

    return (
        <div className="container mt-4">
            <ToastContainer />
            {ads.length > 0 ? (
                <div
                    id="advertCarousel"
                    className="carousel slide mb-5"
                    data-bs-ride="carousel"
                    data-bs-interval="2000"
                >
                    <div className="carousel-indicators">
                        {ads.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                data-bs-target="#advertCarousel"
                                data-bs-slide-to={index}
                                className={index === 0 ? 'active' : ''}
                                aria-current={index === 0 ? 'true' : undefined}
                                aria-label={`Slide ${index + 1}`}
                            ></button>
                        ))}
                    </div>

                    <div className="carousel-inner rounded carousel_custom">
                        {ads.map((ad, index) => (
                            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={ad.id}>
                                <div className="row align-items-center h-100 px-4 gx-2">
                                    <div className="col-md-5 d-flex flex-column justify-content-center ctext" style={{ paddingLeft: '30px' }}>
                                        <h5 className="fw-semibold mb-1">{ad.title}</h5>
                                        <p className="mb-2 small">{ad.description}</p>
                                        <Link to={ad.link} className="btn btn-warning py-1 px-3 btn-sm cbutton" style={{ fontSize: '0.8rem' }}>
                                            Shop Now
                                        </Link>
                                    </div>
                                    <div className="col-md-7 text-center" style={{ paddingTop: '20px' }}>
                                        <Link to={ad.link}>
                                            <img
                                                src={ad.image}
                                                alt={`Ad ${ad.id}`}
                                                style={{ maxHeight: '180px', objectFit: 'contain', width: '100%' }}
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p>No advertisements available at the moment.</p>
            )}
            <div className="row">
                {products.map((product) => {
                    const averageRating = getAverageRating(product.id);
                    return (
                        <div className="col-md-4 mb-4" key={product.id}>
                            <div
                                className="card h-100 d-flex flex-column justify-content-between"
                                onClick={(e) => handleCardClick(e, product.id)}
                                style={{ cursor: 'pointer', minHeight: '450px' }}
                            >
                                <div className="text-center" style={{ height: '200px', overflow: 'hidden' }}>
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
                                    />
                                </div>
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <h5 className="card-title">{product.title}</h5>
                                    <p className="card-text">₹{product.price}</p>
                                    <div className="d-flex align-items-center">
                                        <span className="me-2">{renderStars(Number(averageRating))}</span>
                                        <span>({averageRating})</span>
                                    </div>
                                    {product.stock === 0 ? (
                                        <p className="text-danger fw-semibold">Out of stock</p>
                                    ) : product.stock <= 3 ? (
                                        <p className="text-warning fw-semibold">Only {product.stock} left!</p>
                                    ) : (
                                        <p className="text-success fw-semibold">In stock</p>
                                    )}
                                    <div className="d-flex gap-2 mt-auto">
                                        <button
                                            className="btn btn-outline-primary flex-grow-1"
                                            onClick={(e) => handleAddToCart(e, product)}
                                            disabled={product.stock === 0}
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            className="btn btn-warning flex-grow-1"
                                            onClick={(e) => handleBuyNow(e, product)}
                                            disabled={product.stock === 0}
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Home;
=======
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
    const [products, setProducts] = useState([]);
    const [ads, setAds] = useState([]);
    const [reviews, setReviews] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const loadAllReviews = () => {
            const allReviews = {};
            axios.get('http://localhost:5000/products')
                .then(res => {
                    const productsData = res.data;
                    setProducts(productsData);
                    productsData.forEach(product => {
                        const productId = product.id;
                        const productReviews = JSON.parse(localStorage.getItem(`reviews-${productId}`)) || [];
                        allReviews[productId] = productReviews;
                    });
                    setReviews(allReviews);
                })
                .catch(err => console.log('Error loading products:', err));
        };

        loadAllReviews();

        axios.get('http://localhost:5000/ads')
            .then(res => setAds(res.data))
            .catch(err => console.log('Error loading ads:', err));
    }, []);

    const getAverageRating = (productId) => {
        const productReviews = reviews[productId] || [];
        if (productReviews.length === 0) return 0;
        const totalRating = productReviews.reduce((acc, review) => acc + review.rating, 0);
        return (totalRating / productReviews.length).toFixed(1);
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '★';
        if (halfStar) stars += '✩';
        for (let i = 0; i < emptyStars; i++) stars += '☆';
        return stars;
    };

    const handleCardClick = (e, productId) => {
        if (
            e.target.tagName === 'BUTTON' ||
            e.target.closest('button') ||
            e.target.tagName === 'A' ||
            e.target.closest('a')
        ) {
            return;
        }
        navigate(`/product/${productId}`);
    };

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        dispatch(addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1,
        }));
        toast.success(`${product.title} added to cart!`, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
        });
    };

    const handleBuyNow = (e, product) => {
        e.stopPropagation();
        dispatch(addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1,
        }));
        navigate('/');
    };

    useEffect(() => {
        if (ads.length > 0 && window.bootstrap) {
            const el = document.querySelector('#advertCarousel');
            new window.bootstrap.Carousel(el, {
                interval: 2000,
                ride: 'carousel',
            });
        }
    }, [ads]);

    return (
        <div className="container mt-4">
            <ToastContainer />
            {ads.length > 0 ? (
                <div
                    id="advertCarousel"
                    className="carousel slide mb-5"
                    data-bs-ride="carousel"
                    data-bs-interval="2000"
                >
                    <div className="carousel-indicators">
                        {ads.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                data-bs-target="#advertCarousel"
                                data-bs-slide-to={index}
                                className={index === 0 ? 'active' : ''}
                                aria-current={index === 0 ? 'true' : undefined}
                                aria-label={`Slide ${index + 1}`}
                            ></button>
                        ))}
                    </div>

                    <div className="carousel-inner rounded carousel_custom">
                        {ads.map((ad, index) => (
                            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={ad.id}>
                                <div className="row align-items-center h-100 px-4 gx-2">
                                    <div className="col-md-5 d-flex flex-column justify-content-center ctext" style={{ paddingLeft: '30px' }}>
                                        <h5 className="fw-semibold mb-1">{ad.title}</h5>
                                        <p className="mb-2 small">{ad.description}</p>
                                        <Link to={ad.link} className="btn btn-warning py-1 px-3 btn-sm cbutton" style={{ fontSize: '0.8rem' }}>
                                            Shop Now
                                        </Link>
                                    </div>
                                    <div className="col-md-7 text-center" style={{ paddingTop: '20px' }}>
                                        <Link to={ad.link}>
                                            <img
                                                src={ad.image}
                                                alt={`Ad ${ad.id}`}
                                                style={{ maxHeight: '180px', objectFit: 'contain', width: '100%' }}
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p>No advertisements available at the moment.</p>
            )}
            <div className="row">
                {products.map((product) => {
                    const averageRating = getAverageRating(product.id);
                    return (
                        <div className="col-md-4 mb-4" key={product.id}>
                            <div
                                className="card h-100 d-flex flex-column justify-content-between"
                                onClick={(e) => handleCardClick(e, product.id)}
                                style={{ cursor: 'pointer', minHeight: '450px' }}
                            >
                                <div className="text-center" style={{ height: '200px', overflow: 'hidden' }}>
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
                                    />
                                </div>
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <h5 className="card-title">{product.title}</h5>
                                    <p className="card-text">₹{product.price}</p>
                                    <div className="d-flex align-items-center">
                                        <span className="me-2">{renderStars(Number(averageRating))}</span>
                                        <span>({averageRating})</span>
                                    </div>
                                    {product.stock === 0 ? (
                                        <p className="text-danger fw-semibold">Out of stock</p>
                                    ) : product.stock <= 3 ? (
                                        <p className="text-warning fw-semibold">Only {product.stock} left!</p>
                                    ) : (
                                        <p className="text-success fw-semibold">In stock</p>
                                    )}
                                    <div className="d-flex gap-2 mt-auto">
                                        <button
                                            className="btn btn-outline-primary flex-grow-1"
                                            onClick={(e) => handleAddToCart(e, product)}
                                            disabled={product.stock === 0}
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            className="btn btn-warning flex-grow-1"
                                            onClick={(e) => handleBuyNow(e, product)}
                                            disabled={product.stock === 0}
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Home;
>>>>>>> 3ee5ce2c11e67ef438a0f1bf6266aa913f7b6820
