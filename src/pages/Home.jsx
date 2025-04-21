import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { CustomToastContainer, showAddToCartToast } from './ToastNotification';

function Home() {
    const [products, setProducts] = useState([]);
    const [ads, setAds] = useState([]);
    const [reviews, setReviews] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const loadAllReviews = () => {
            setIsLoading(true);
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
                    setIsLoading(false);
                })
                .catch(err => {
                    console.log('Error loading products:', err);
                    setIsLoading(false);
                });
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

        return (
            <div className="rating-stars">
                {[...Array(fullStars)].map((_, i) => (
                    <span key={`full-${i}`} className="star-filled">★</span>
                ))}
                {halfStar && <span className="star-half">★</span>}
                {[...Array(emptyStars)].map((_, i) => (
                    <span key={`empty-${i}`} className="star-empty">☆</span>
                ))}
            </div>
        );
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

        showAddToCartToast(product);
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
        navigate('/details');
    };

    useEffect(() => {
        if (ads.length > 0 && window.bootstrap) {
            const el = document.querySelector('#advertCarousel');
            new window.bootstrap.Carousel(el, {
                interval: 3000,
                ride: 'carousel',
            });
        }
    }, [ads]);

    const getStockBadge = (stock) => {
        if (stock === 0) {
            return <span className="badge bg-danger">Out of stock</span>;
        } else if (stock <= 3) {
            return <span className="badge bg-warning text-dark">Only {stock} left!</span>;
        } else {
            return <span className="badge bg-success">In stock</span>;
        }
    };

    return (
        <div className="container mt-4">
            <CustomToastContainer />

            {/* Carousel Section with Enhanced UI */}
            {ads.length > 0 ? (
                <div
                    id="advertCarousel"
                    className="carousel slide mb-5 shadow-lg rounded"
                    data-bs-ride="carousel"
                    data-bs-interval="3000"
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
                                <div className="row align-items-center h-100 px-4 gx-2 py-3">
                                    <div className="col-md-5 d-flex flex-column justify-content-center ctext" style={{ paddingLeft: '30px' }}>
                                        <h4 className="fw-bold mb-2">{ad.title}</h4>
                                        <p className="mb-3">{ad.description}</p>
                                        <Link to={ad.link} className="btn btn-warning py-2 px-4 btn-sm cbutton fw-bold shop-now-btn">
                                            Shop Now
                                        </Link>
                                    </div>
                                    <div className="col-md-7 text-center" style={{ paddingTop: '20px' }}>
                                        <Link to={ad.link} className="ad-image-link">
                                            <img
                                                src={ad.image}
                                                alt={`Ad ${ad.id}`}
                                                className="ad-image"
                                                style={{ maxHeight: '200px', objectFit: 'contain', width: '100%' }}
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="carousel-control-prev" type="button" data-bs-target="#advertCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#advertCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            ) : (
                <div className="alert alert-info">No advertisements available at the moment.</div>
            )}

            {/* Loading State */}
            {isLoading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading products...</p>
                </div>
            ) : (
                <div className="row">
                    {products.map((product) => {
                        const averageRating = getAverageRating(product.id);
                        return (
                            <div className="col-lg-4 col-md-6 mb-4" key={product.id}>
                                <div
                                    className="card h-100 product-card"
                                    onClick={(e) => handleCardClick(e, product.id)}
                                >
                                    <div className="product-image-container">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="product-image"
                                        />
                                        {product.stock > 0 && (
                                            <div className="quick-actions">
                                                <button
                                                    className="btn btn-primary quick-add-btn"
                                                    onClick={(e) => handleAddToCart(e, product)}
                                                    title="Add to Cart"
                                                >
                                                    <i className="fas fa-shopping-cart"></i>
                                                </button>
                                                <button
                                                    className="btn btn-warning quick-buy-btn"
                                                    onClick={(e) => handleBuyNow(e, product)}
                                                    title="Buy Now"
                                                >
                                                    <i className="fas fa-bolt"></i>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title product-title">{product.title}</h5>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <p className="price-tag mb-0">₹{product.price}</p>
                                            {getStockBadge(product.stock)}
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                            {renderStars(Number(averageRating))}
                                            <span className="ms-2 rating-number">({averageRating})</span>
                                        </div>

                                        <div className="d-flex gap-2 mt-auto">
                                            <button
                                                className="btn btn-outline-primary flex-grow-1 add-to-cart-btn"
                                                onClick={(e) => handleAddToCart(e, product)}
                                                disabled={product.stock === 0}
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                className="btn btn-warning flex-grow-1 buy-now-btn"
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
            )}

            {/* Add custom CSS for the improved UI and hover effects */}
            <style jsx="true">{`
                /* Carousel improvements */
                .carousel_custom {
                    background: linear-gradient(135deg,rgb(0, 43, 85) 0%,rgb(1, 95, 189) 100%);
                    border: 1px solid #dee2e6;
                }
                
                .shop-now-btn {
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                
                .shop-now-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }
                
                .ad-image {
                    transition: transform 0.3s ease;
                }
                
                .ad-image-link:hover .ad-image {
                    transform: scale(1.05);
                }
                
                /* Product card improvements */
                .product-card {
                    transition: all 0.3s ease;
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    cursor: pointer;
                }
                
                .product-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
                
                .product-image-container {
                    position: relative;
                    height: 220px;
                    overflow: hidden;
                    background-color: #f8f9fa;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .product-image {
                    max-height: 180px;
                    width: auto;
                    max-width: 90%;
                    object-fit: contain;
                    transition: transform 0.5s ease;
                }
                
                .product-card:hover .product-image {
                    transform: scale(1.1);
                }
                
                /* Quick action buttons that appear on hover */
                .quick-actions {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    opacity: 0;
                    transform: translateX(20px);
                    transition: all 0.3s ease;
                }
                
                .product-card:hover .quick-actions {
                    opacity: 1;
                    transform: translateX(0);
                }
                
                .quick-add-btn, .quick-buy-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }
                
                .quick-add-btn:hover, .quick-buy-btn:hover {
                    transform: scale(1.1);
                }
                
                /* Product title styling */
                .product-title {
                    font-weight: 600;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    height: 48px;
                    margin-bottom: 10px;
                }
                
                /* Price styling */
                .price-tag {
                    font-weight: 700;
                    font-size: 1.2rem;
                    color: #212529;
                }
                
                /* Rating stars styling */
                .rating-stars {
                    display: flex;
                    align-items: center;
                }
                
                .star-filled, .star-half {
                    color: #ffc107;
                    font-size: 1.1rem;
                }
                
                .star-empty {
                    color: #e0e0e0;
                    font-size: 1.1rem;
                }
                
                .rating-number {
                    color: #6c757d;
                    font-size: 0.9rem;
                }
                
                /* Button styling */
                .add-to-cart-btn, .buy-now-btn {
                    transition: all 0.3s ease;
                    font-weight: 500;
                }
                
                .add-to-cart-btn:hover {
                    background-color: #0d6efd;
                    color: white;
                }
                
                .buy-now-btn:hover {
                    background-color: #e09b00;
                }
                
                /* Badge styling */
                .badge {
                    font-weight: 500;
                    padding: 0.4em 0.6em;
                    border-radius: 4px;
                }
            `}</style>

            {/* Add Font Awesome for icons */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
                integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg=="
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
            />
        </div>
    );
}

export default Home;