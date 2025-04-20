<<<<<<< HEAD

import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        products: productReducer,
    },
});
=======

import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        products: productReducer,
    },
});
>>>>>>> 3ee5ce2c11e67ef438a0f1bf6266aa913f7b6820
