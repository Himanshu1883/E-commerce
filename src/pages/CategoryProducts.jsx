import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

function CategoryProducts() {
    const [products, setProducts] = useState([]);
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const { categoryName } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        setLoading(true);


        fetch(`http://localhost:5000/categories?name=${categoryName}`)
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    setCategoryInfo(data[0]);
                }
            })
            .catch(err => {
                console.error('Error fetching category info:', err);
            });

        // Fetch products by category
        fetch(`http://localhost:5000/products?category=${categoryName}`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching category products:', err);
                setLoading(false);
            });
    }, [categoryName]);

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    if (loading) {
        return <div className="container mt-5 text-center"><div className="spinner-border" role="status"></div></div>;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-capitalize category">{categoryName}</h2>

            {categoryInfo && (
                <div className="alert alert-light mb-4">
                    {categoryInfo.description}
                </div>
            )}

            {products.length === 0 ? (
                <div className="alert alert-info">
                    No products found in this category.
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
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CategoryProducts;