vi.mock("../../utils/CartAction", () => ({
    AddToCart: vi.fn()
}));

vi.mock("react-router-dom", () => ({
    Link: ({ children }) => <a>{children}</a>
}));

vi.mock("../BaseModal", () => ({
    default: ({ open, children, close }) =>
        open ? (
            <div data-testid="modal">
                {children}
                <button onClick={close}>close</button>
            </div>
        ) : null
}));

vi.mock("../BaseModal", () => ({
    default: ({ open, children }) =>
        open ? <div data-testid="modal">{children}</div> : null
}));

vi.mock("../../utils/CartAction", () => ({
    AddToCart: vi.fn((book, setting, qty, setCart) => {
        setCart?.(prev => [...(prev || []), book]);
    })
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

beforeEach(() => {
    vi.clearAllMocks();
});

test("render book info", () => {
    render(<Card book={book} defaultSetting={defaultSetting} setCart={setCart} />);

    expect(screen.getByText("Clean Code")).toBeInTheDocument();
    expect(screen.getByText(/Số lượng còn lại/)).toBeInTheDocument();
});

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

test("handleAddToCart covers both branches", async () => {
    const { rerender } = render(
        <Card book={book} defaultSetting={defaultSetting} setCart={setCart} />
    );

    // IN STOCK
    fireEvent.click(screen.getByText("Thêm vào giỏ hàng"));

    expect(AddToCart).toHaveBeenCalledWith(
        book,
        defaultSetting,
        1,
        setCart
    );

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText(/đã được thêm/i)).toBeInTheDocument();

    // OUT OF STOCK
    rerender(
        <Card
            book={{ ...book, available_quantity: 0 }}
            defaultSetting={defaultSetting}
            setCart={setCart}
        />
    );

    fireEvent.click(screen.getByText("Thêm vào giỏ hàng"));

    expect(AddToCart).toHaveBeenCalledTimes(1);

    expect(screen.getByText(/Sách đã hết/i)).toBeInTheDocument();
});