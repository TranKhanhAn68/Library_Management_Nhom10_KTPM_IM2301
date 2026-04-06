import React from 'react';

const AddToCart = (book, qty = 1) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || []
    const exist = cart.find(b => b.id === book.id)

    if (exist)
        exist.qty += qty
    else
        cart.push({ ...book, qty })
    localStorage.setItem('cart', JSON.stringify(cart))
}


const DeleteBookFromCart = (book_id) => {
    const cart = JSON.parse(localStorage.getItem('cart'))
    if (cart) {
        const newCart = cart.filter(book => book.id !== book_id)
        localStorage.setItem('cart', JSON.stringify(newCart))
    }
}

export { AddToCart, DeleteBookFromCart }