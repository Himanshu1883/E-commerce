import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);
    const dispatch = useDispatch();

    const cartItems = useSelector((state) => state.cart.items);

    useEffect(() => {
        axios.get(`https://e-commerce-api-jsjh.onrender.com/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(err => console.log(err));

        const storedReviews = JSON.parse(localStorage.getItem(`reviews-${id}`)) || [];
        setReviews(storedReviews);
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            dispatch(addToCart({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: quantity,
            }));
            toast.success(`${product.title} added to cart!`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });
        }
    };

    const handleQuantityChange = (e) => {
        setQuantity(Math.max(1, e.target.value));
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        const newReview = {
            review: reviewText,
            rating,
            date: new Date().toISOString(),
        };

        const updatedReviews = [newReview, ...reviews];
        setReviews(updatedReviews);
        localStorage.setItem(`reviews-${id}`, JSON.stringify(updatedReviews));
        setReviewText('');
        setRating(5);
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} className={`bi ${i < rating ? 'bi-star-fill' : 'bi-star'} text-warning`}></span>
            );
        }
        return stars;
    };

    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
        : 0;

    if (!product) return <div>Loading...</div>;

    return (
        <div className="container mt-5">
            <ToastContainer />
            <div className="row">
                <div className="col-md-6">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="img-fluid rounded shadow-lg"
                        style={{ maxHeight: '400px', objectFit: 'contain' }}
                    />
                </div>
                <div className="col-md-6">
                    <h2 className="text-primary">{product.title}</h2>
                    <p className="lead">{product.description}</p>
                    <h3 className="text-danger">₹{product.price}</h3>
                    <p className={`text-${product.stock === 0 ? 'danger' : 'success'}`}>
                        {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                    </p>

                    <div className="mb-3">
                        <strong>Rating: </strong>
                        {renderStars(Math.round(averageRating))} <span>{averageRating.toFixed(1)} / 5</span>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="quantity" className="form-label">Quantity</label>
                        <input
                            type="number"
                            id="quantity"
                            className="form-control"
                            value={quantity}
                            onChange={handleQuantityChange}
                            min="1"
                            max={product.stock}
                        />
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className={`btn ${product.stock === 0 ? 'btn-secondary' : 'btn-primary'} btn-lg w-100`}
                        disabled={product.stock === 0}
                    >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>

            <div className="mt-5">
                <h3 className="text-info">Customer Reviews</h3>
                {reviews.length === 0 ? (
                    <p>No reviews yet. Be the first to review this product!</p>
                ) : (
                    reviews.map((review, index) => (
                        <div key={index} className="review p-3 mb-3 border rounded shadow-sm">
                            <p><strong>Rating: {review.rating} stars</strong></p>
                            <p>{review.review}</p>
                            <p><small className="text-muted">{new Date(review.date).toLocaleDateString()}</small></p>
                        </div>
                    ))
                )}

                <h4>Add Your Review</h4>
                <form onSubmit={handleReviewSubmit}>
                    <div className="mb-3">
                        <label htmlFor="review" className="form-label">Your Review</label>
                        <textarea
                            id="review"
                            className="form-control"
                            rows="4"
                            placeholder="Write your review here..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="rating" className="form-label">Rating</label>
                        <select
                            id="rating"
                            className="form-select"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                        >
                            {[5, 4, 3, 2, 1].map((val) => (
                                <option key={val} value={val}>{val} stars</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary">Submit Review</button>
                </form>
            </div>
        </div>
    );
}

export default ProductDetail;
