import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, test, expect } from "vitest";
import Books from "./Books";
import React from "react";

// mock Card
vi.mock("../card/Card", () => ({
    default: ({ book }) => <div data-testid="card">{book.name}</div>
}));

// mock Pagination
vi.mock("../Pagination", () => ({
    default: () => <div data-testid="pagination">Pagination</div>
}));

// mock Loading
vi.mock("../Loading", () => ({
    default: () => <div data-testid="loading">Loading...</div>
}));

// mock Setting API
const mockSettings = [{ currency: "VND" }];

vi.mock("../../services/SettingAPI", () => ({
    SettingListAPI: () => mockSettings
}));


// mock AuthContext
vi.mock("../../utils/AuthContext", async () => {
    const React = await vi.importActual("react");

    return {
        AuthContent: React.createContext({ token: "fake-token" })
    };
});

// mock react-router
const mockGoPage = vi.fn();
const mockGoSearchToCategory = vi.fn();
const mockGoSearchToAuthor = vi.fn();
const getOutletContext = vi.fn();

const mockOutletContext = {
    books: [
        { id: 1, name: "Book 1" },
        { id: 2, name: "Book 2" }
    ],
    authors: [
        { id: 1, name: "Nguyen Van A" },
        { id: 2, name: "Tran B" }
    ],
    categories: [
        { id: 1, name: "Fiction" },
        { id: 2, name: "Science" }
    ],
    currentPage: 1,
    dataBooks: { count: 16 },
    goPage: mockGoPage,
    goSearchToCategory: mockGoSearchToCategory,
    goSearchToAuthor: mockGoSearchToAuthor,
    setCart: vi.fn()
};

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useOutletContext: () => getOutletContext()

    };
});



test("Render card from books", () => {
    getOutletContext.mockReturnValue({
        ...mockOutletContext
    })
    render(<Books />);

    const cards = screen.getAllByTestId("card");
    expect(cards.length).toBe(2);
});

test("Render pagination", () => {
    getOutletContext.mockReturnValue({
        ...mockOutletContext
    })
    render(<Books />);
    const pagination = screen.getByTestId("pagination");
    expect(pagination).toBeInTheDocument();
});

test("render empty books", async () => {
    getOutletContext.mockReturnValue({
        ...mockOutletContext,
        books: []
    });

    render(<Books />);


    expect(await screen.findByText("Không có dữ liệu"))
        .toBeInTheDocument();
});

test("show loading UI", () => {
    getOutletContext.mockReturnValue({
        ...mockOutletContext,
        loading: true,
        books: []
    });

    render(<Books />);

    expect(screen.getByTestId("loading"))
        .toBeInTheDocument();
});

// Test Author
test("render authors dropdown list", () => {
    getOutletContext.mockReturnValue({
        ...mockOutletContext
    });

    render(<Books />);

    expect(screen.getByText("Nguyen Van A")).toBeInTheDocument();
    expect(screen.getByText("Tran B")).toBeInTheDocument();
});

test("filter authors by search input", () => {
    getOutletContext.mockReturnValue({
        ...mockOutletContext
    });

    render(<Books />);

    const input = screen.getByPlaceholderText("Nhập tên tác giả...");

    fireEvent.change(input, {
        target: { value: "Nguyen" }
    });

    expect(screen.getByText("Nguyen Van A")).toBeInTheDocument();
    expect(screen.queryByText("Tran B")).not.toBeInTheDocument();
});

test("click author calls goSearchToAuthor", () => {
    getOutletContext.mockReturnValue({
        ...mockOutletContext
    });

    render(<Books />);

    const btn = screen.getByText("Nguyen Van A");

    fireEvent.click(btn);

    expect(mockGoSearchToAuthor).toHaveBeenCalledWith(1);
});

// Category
test("render categories dropdown list", () => {
    getOutletContext.mockReturnValue({
        ...mockOutletContext
    });

    render(<Books />);

    expect(screen.getByText("Fiction")).toBeInTheDocument();
    expect(screen.getByText("Science")).toBeInTheDocument();
});

test("click category calls goSearchToCategory", () => {
    getOutletContext.mockReturnValue({
        ...mockOutletContext
    });

    render(<Books />);

    const btn = screen.getByText("Fiction");

    fireEvent.click(btn);

    expect(mockGoSearchToCategory).toHaveBeenCalledWith(1);
});

