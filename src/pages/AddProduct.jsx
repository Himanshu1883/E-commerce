import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title: '',
    price: '',
    description: '',
    image: ''
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert price to a number
    const newProduct = { ...product, price: parseFloat(product.price) };

    try {
      await axios.post('https://e-commerce-api-jsjh.onrender.com/products', newProduct);
      toast.success('Product added successfully!');
      navigate('/');
    } catch (err) {
      toast.error('Failed to add product.');
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Product Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={product.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Price (₹)</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input
            type="text"
            className="form-control"
            name="image"
            value={product.image}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            rows="4"
            value={product.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
