import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, test, expect, beforeEach } from "vitest";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import BookDasboard from "./BookDashboard"
import { BookListAPI, DeleteBook } from "../../../services/BookAPI";

vi.mock("../../../services/BookAPI", () => ({
    BookListAPI: vi.fn(),
    DeleteBook: vi.fn()
}));

vi.mock("../../../utils/AuthContext", async () => {
    const React = await vi.importActual("react");

    return {
        AuthContent: React.createContext({
            token: "fake-token"
        })
    };
});

vi.mock("../../../components/Pagination", () => ({
    default: ({ currentPage, totalPages, goPage }) => (
        <div data-testid="pagination">
            <span>
                {currentPage} / {totalPages}
            </span>

            <button
                data-testid="next-page"
                onClick={() => goPage(2)}
            >
                Next
            </button>
        </div>
    )
}));

vi.mock("../../../components/Loading", () => ({
    default: () => <div>Loading...</div>
}));

vi.mock("../../../components/BaseModal", () => ({
    default: ({ open, children }) =>
        open ? <div data-testid="modal">{children}</div> : null
}));

vi.mock("../../../components/Input", () => ({
    default: ({ value, onChange, placeholder }) => (
        <input
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    )
}));

vi.mock("../../../utils/GetError", () => ({
    getError: vi.fn(() => "Delete failed")
}));

const mockBooks = {
    count: 2,
    results: [
        {
            id: 1,
            name: "Book A",
            image: "a.jpg",
            total_quantity: 10,
            available_quantity: 5,
            active: true,
            author: { name: "Author A" },
            publisher: { name: "Publisher A" },
            created_at: "2025-01-01",
            updated_at: "2025-01-01",
            description: "Description A"
        },
        {
            id: 2,
            name: "Book B",
            image: "b.jpg",
            total_quantity: 8,
            available_quantity: 3,
            active: false,
            author: { name: "Author B" },
            publisher: { name: "Publisher B" },
            created_at: "2025-01-01",
            updated_at: "2025-01-01",
            description: "Description B"
        }
    ]
};

beforeEach(() => {
    BookListAPI.mockReturnValue({
        dataBooks: mockBooks,
        loading: false
    });
});

const renderComponent = () => {
    return render(
        <MemoryRouter>
            <BookDasboard />
        </MemoryRouter>
    );
};

test("render books list", () => {
    renderComponent();

    expect(screen.getByText("Book A")).toBeInTheDocument();
    expect(screen.getByText("Book B")).toBeInTheDocument();
});

test("show loading", () => {
    BookListAPI.mockReturnValue({
        dataBooks: null,
        loading: true
    });

    renderComponent();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test("show empty data", () => {
    BookListAPI.mockReturnValue({
        dataBooks: {
            count: 0,
            results: []
        },
        loading: false
    });

    renderComponent();

    expect(
        screen.getByText(/không có dữ liệu/i)
    ).toBeInTheDocument();
});

test("open detail modal", () => {
    renderComponent();

    const btn = screen.getAllByText(/xem chi tiết/i)[0];

    fireEvent.click(btn);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText(/chi tiết sách/i)).toBeInTheDocument();
});

test("close detail modal", () => {
    renderComponent();

    const detailBtn = screen.getAllByText(/xem chi tiết/i)[0];

    fireEvent.click(detailBtn);

    expect(
        screen.getByText(/chi tiết sách/i)
    ).toBeInTheDocument();

    const closeBtn = screen.getByText("✕");

    fireEvent.click(closeBtn);

    expect(
        screen.queryByText(/chi tiết sách/i)
    ).not.toBeInTheDocument();
});

test("show delete confirm modal", () => {
    renderComponent();

    const deleteBtns = screen.getAllByRole("button");

    fireEvent.click(deleteBtns[2]);

    expect(
        screen.getByText(/xác nhận xóa/i)
    ).toBeInTheDocument();
});

test("cancel delete modal", () => {
    renderComponent();

    const deleteBtns = screen.getAllByRole("button");

    fireEvent.click(deleteBtns[2]);

    expect(
        screen.getByText(/xác nhận xóa/i)
    ).toBeInTheDocument();

    const cancelBtn = screen.getByText(/hủy/i);

    fireEvent.click(cancelBtn);

    expect(
        screen.queryByText(/xác nhận xóa/i)
    ).not.toBeInTheDocument();
});

test("delete book success", async () => {
    DeleteBook.mockResolvedValue();

    renderComponent();

    const deleteBtns = screen.getAllByRole("button");

    fireEvent.click(deleteBtns[2]);

    const confirmBtn = screen.getByText(/^xóa$/i);

    fireEvent.click(confirmBtn);

    await waitFor(() => {
        expect(DeleteBook).toHaveBeenCalledWith(
            1,
            "fake-token"
        );
    });

    expect(
        await screen.findByText(/Xóa dữ liệu thành công/i)
    ).toBeInTheDocument();
});

test("delete book failed", async () => {
    DeleteBook.mockRejectedValue(new Error("Delete failed"));

    renderComponent();

    const deleteBtns = screen.getAllByRole("button");

    fireEvent.click(deleteBtns[2]);

    const confirmBtn = screen.getByText(/^xóa$/i);

    fireEvent.click(confirmBtn);

    await waitFor(() => {
        expect(DeleteBook).toHaveBeenCalled();
    });

    expect(
        await screen.findByText("Delete failed")
    ).toBeInTheDocument();
});

test("pagination render", () => {
    renderComponent();

    expect(
        screen.getByTestId("pagination")
    ).toBeInTheDocument();
});

test("change page", () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("next-page"));

    expect(
        screen.getByText("2 / 1")
    ).toBeInTheDocument();
});

test("search input change", () => {
    renderComponent();

    const input = screen.getByPlaceholderText(/tìm sách/i);

    fireEvent.change(input, {
        target: {
            value: "React"
        }
    });

    expect(input.value).toBe("React");
});

test("render add book link", () => {
    renderComponent();

    const link = screen.getByText(/add book/i);

    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute(
        "href",
        "/add-book"
    );
});

test("show detail information correctly", () => {
    renderComponent();

    const detailBtn = screen.getAllByText(/xem chi tiết/i)[0];

    fireEvent.click(detailBtn);

    expect(screen.getByText(/author a/i))
        .toBeInTheDocument();

    expect(screen.getByText(/publisher a/i))
        .toBeInTheDocument();

    expect(screen.getByText(/description a/i))
        .toBeInTheDocument();
});

test("handleSearch reset current page", () => {
    renderComponent();

    const nextBtn = screen.getByTestId("next-page");

    fireEvent.click(nextBtn);

    expect(
        screen.getByText("2 / 1")
    ).toBeInTheDocument();

    const searchBtn = screen.getByText(/tìm/i);

    fireEvent.click(searchBtn);

    expect(
        screen.getByText("1 / 1")
    ).toBeInTheDocument();
});

test("handleSearch reload data", () => {
    renderComponent();

    const oldCall = BookListAPI.mock.calls.length;

    const searchBtn = screen.getByText(/tìm/i);

    fireEvent.click(searchBtn);

    expect(BookListAPI.mock.calls.length)
        .toBeGreaterThan(oldCall);
});