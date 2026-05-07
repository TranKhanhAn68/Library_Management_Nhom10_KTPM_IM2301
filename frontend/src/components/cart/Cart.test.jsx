import { render, screen, fireEvent } from "@testing-library/react";
import { vi, test, expect, beforeEach } from "vitest";
import React from "react";
import Cart from "./Cart";

// ===== MOCK =====
vi.mock("../BaseModal", () => ({
    default: ({ open, children }) =>
        open ? <div data-testid="modal">{children}</div> : null
}));

// ===== DATA =====
const cartData = [
    {
        book_id: 1,
        name: "Book A",
        image: "img.jpg",
        borrowing_quantity: 2,
        price: 10000,
        date: "2024-01-01",
        setting: { borrowing_days: 5 }
    }
];

let setCart;
let handleIncreaseQTy;
let handleDecreaseQTy;

beforeEach(() => {
    setCart = vi.fn();
    handleIncreaseQTy = vi.fn();
    handleDecreaseQTy = vi.fn();
});

// ===== TEST 1 =====
test("render empty cart", () => {
    render(
        <Cart
            cart={[]}
            setCart={setCart}
            handleIncreaseQTy={handleIncreaseQTy}
            handleDecreaseQTy={handleDecreaseQTy}
        />
    );

    expect(screen.getByText(/Không có sản phẩm/)).toBeInTheDocument();
});

// ===== TEST 2 =====
test("render cart item", () => {
    render(
        <Cart
            cart={cartData}
            setCart={setCart}
            handleIncreaseQTy={handleIncreaseQTy}
            handleDecreaseQTy={handleDecreaseQTy}
        />
    );

    expect(screen.getByText("Book A")).toBeInTheDocument();
});

// ===== TEST 3 =====
test("increase quantity", () => {
    render(
        <Cart
            cart={cartData}
            setCart={setCart}
            handleIncreaseQTy={handleIncreaseQTy}
            handleDecreaseQTy={handleDecreaseQTy}
        />
    );

    fireEvent.click(screen.getByText("+"));

    expect(handleIncreaseQTy).toHaveBeenCalledWith(1);
});

// ===== TEST 4 =====
test("decrease quantity", () => {
    render(
        <Cart
            cart={cartData}
            setCart={setCart}
            handleIncreaseQTy={handleIncreaseQTy}
            handleDecreaseQTy={handleDecreaseQTy}
        />
    );

    fireEvent.click(screen.getByText("-"));

    expect(handleDecreaseQTy).toHaveBeenCalledWith(1);
});

// ===== TEST 5 =====
test("open delete modal", () => {
    render(
        <Cart
            cart={cartData}
            setCart={setCart}
            handleIncreaseQTy={handleIncreaseQTy}
            handleDecreaseQTy={handleDecreaseQTy}
        />
    );

    fireEvent.click(screen.getByLabelText("delete-item"));

    expect(screen.getByTestId("modal")).toBeInTheDocument();
});

// ===== TEST 6 =====
test("cancel delete closes modal", () => {
    render(
        <Cart
            cart={cartData}
            setCart={setCart}
            handleIncreaseQTy={handleIncreaseQTy}
            handleDecreaseQTy={handleDecreaseQTy}
        />
    );

    fireEvent.click(screen.getByLabelText("delete-item"));

    fireEvent.click(screen.getByText("Hủy"));

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
});

// ===== TEST 7 =====
test("confirm delete calls setCart", () => {
    render(
        <Cart
            cart={cartData}
            setCart={setCart}
            handleIncreaseQTy={handleIncreaseQTy}
            handleDecreaseQTy={handleDecreaseQTy}
        />
    );

    fireEvent.click(screen.getByLabelText("delete-item"));

    fireEvent.click(screen.getByText("Xóa"));

    expect(setCart).toHaveBeenCalled();
});