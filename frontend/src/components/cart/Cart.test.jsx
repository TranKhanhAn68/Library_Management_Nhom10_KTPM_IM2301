import { render, screen, fireEvent } from "@testing-library/react";
import { vi, test, expect, beforeEach } from "vitest";
import React from "react";
import Cart from "./Cart";

vi.mock("../BaseModal", () => ({
    default: ({ open, children, close }) =>
        open ? (
            <div data-testid="modal">
                <button onClick={close}>close-modal</button>
                {children}
            </div>
        ) : null
}));

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

test("does not render modal when selectedItem is null", () => {
    render(
        <Cart
            cart={cartData}
            setCart={setCart}
            handleIncreaseQTy={handleIncreaseQTy}
            handleDecreaseQTy={handleDecreaseQTy}
        />
    );

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
});

test("sets selectedItem and opens modal", () => {
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