import React from 'react';
import { SettingListAPI } from '../services/SettingAPI';

const AddToCart = (book, defaultSetting, qty = 1, setCart) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const date = new Date().toISOString().split('T')[0];
    const unitPrice = Number(defaultSetting?.borrowing_fee || defaultSetting?.borrowing_fee || 0);

    let newCart;
    const { id, name, image } = book;
    const exist = cart.find(b => b.book_id === id)
    if (exist) {
        newCart = cart.map(item => {
            if (item.book_id === id) {
                const newQty = item.borrowing_quantity + qty
                return {
                    ...item,
                    borrowing_quantity: newQty,
                    price: newQty * unitPrice
                }
            }
            return item
        });
    } else {
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