vi.mock("../../utils/CartAction", () => ({
    AddToCart: vi.fn()
}));

vi.mock("react-router-dom", () => ({
    Link: ({ children }) => <a>{children}</a>
}));

vi.mock("../BaseModal", () => ({
    default: ({ open, children }) =>
        open ? <div data-testid="modal">{children}</div> : null
}));

import { render, screen, fireEvent } from "@testing-library/react";
import { vi, test, expect, beforeEach } from "vitest";
import React from "react";

import Card from "./Card";
import { AddToCart } from "../../utils/CartAction";

// ================= MOCK =================
vi.mock("../../utils/CartAction", () => ({
    AddToCart: vi.fn()
}));

vi.mock("react-router-dom", () => ({
    Link: ({ children }) => <a>{children}</a>
}));

vi.mock("../BaseModal", () => ({
    default: ({ open, children }) =>
        open ? <div data-testid="modal">{children}</div> : null
}));

// ================= DATA =================
const book = {
    id: 1,
    name: "Clean Code",
    image: "test.jpg",
    available_quantity: 5
};

const defaultSetting = {};
const setCart = vi.fn();

// ================= RESET =================
beforeEach(() => {
    vi.clearAllMocks();
});

// ================= TEST 1 =================
test("render book info", () => {
    render(<Card book={book} defaultSetting={defaultSetting} setCart={setCart} />);

    expect(screen.getByText("Clean Code")).toBeInTheDocument();
    expect(screen.getByText(/Số lượng còn lại/)).toBeInTheDocument();
});

// ================= TEST 2 =================
test("click add to cart calls AddToCart", () => {
    render(<Card book={book} defaultSetting={defaultSetting} setCart={setCart} />);

    fireEvent.click(screen.getByText("Thêm vào giỏ hàng"));

    expect(AddToCart).toHaveBeenCalledWith(
        book,
        defaultSetting,
        1,
        setCart
    );

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText(/đã được thêm vào giỏ hàng/)).toBeInTheDocument();
});

// ================= TEST 3 =================
test("out of stock should not call AddToCart", () => {
    const outOfStockBook = {
        ...book,
        available_quantity: 0
    };

    render(
        <Card
            book={outOfStockBook}
            defaultSetting={defaultSetting}
            setCart={setCart}
        />
    );

    fireEvent.click(screen.getByText("Thêm vào giỏ hàng"));

    expect(AddToCart).not.toHaveBeenCalled();

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText(/Sách đã hết/)).toBeInTheDocument();
});