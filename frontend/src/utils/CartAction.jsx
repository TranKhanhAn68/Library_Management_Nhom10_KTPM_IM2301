import React from 'react';
import { SettingListAPI } from '../services/SettingAPI';

const AddToCart = (book, defaultSetting, qty = 1, setCart) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const date = new Date().toISOString().split('T')[0];
    const unitPrice = Number(defaultSetting?.borrowing_fee || defaultSetting?.borrowing_fee || 0);

    const exist = cart.find(b => b.id === book.id);
    let newCart;

    if (exist) {
        newCart = cart.map(item =>
            item.id === book.id
                ? { ...item, borrowing_quantity: item.qty + qty, price: (item.qty + qty) * unitPrice }
                : item
        );
    } else {
        const { id, name, image } = book;
        newCart = [...cart, {
            book_id: id,
            name,
            image,
            date,
            borrowing_quantity: qty,
            setting: defaultSetting,
            price: unitPrice * qty,
        }];
    }
    setCart(newCart)
};

const DeleteBookFromCart = (book_id) => {
    const cart = JSON.parse(localStorage.getItem('cart'))
    if (cart) {
        const newCart = cart.filter(book => book.id !== book_id)
        localStorage.setItem('cart', JSON.stringify(newCart))
    }
}

export { AddToCart, DeleteBookFromCart }