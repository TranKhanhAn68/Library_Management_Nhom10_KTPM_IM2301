import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, test, expect, beforeEach } from "vitest";
import React from "react";

import BorrowingHistory from "./BorrowingHistory";
import { BorrowingListByUser } from "../../services/UserAPI";
import { AuthContent } from "../../utils/AuthContext";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../services/UserAPI", () => ({
    BorrowingListByUser: vi.fn()
}));

const mockBorrowingListByUser = BorrowingListByUser;
vi.mock("../StatusSelect", () => ({
    default: ({ value, onChange }) => (
        <select data-testid="status-select" value={value} onChange={onChange}>
            <option value="">ALL</option>
            <option value="BORROWING">BORROWING</option>
            <option value="RETURNED">RETURNED</option>
        </select>
    )
}));

vi.mock("../Pagination", () => ({
    default: ({ currentPage, totalPages, goPage }) => (
        <div data-testid="pagination">
            <span data-testid="page">Page {currentPage} / {totalPages}</span>

            <button
                data-testid="next-page"
                onClick={() => goPage(2)}
            >
                Next
            </button>
        </div>
    )
}));

vi.mock("../Loading", () => ({
    default: () => <div>Loading...</div>
}));


const borrowedData = {
    results: [
        {
            id: 1,
            status: "BORROWING",
            book: { name: "Book A" },
            borrowing_quantity: 2
        }
    ]
};

const returnedData = {
    results: [
        {
            id: 2,
            status: "RETURNED",
            book: { name: "Book B" },
            borrowing_quantity: 1
        }
    ]
};

const allData = {
    results: [
        { id: 1, status: "BORROWING", book: { name: "Book A" } },
        { id: 2, status: "RETURNED", book: { name: "Book B" } }
    ]
};

beforeEach(() => {
    mockBorrowingListByUser.mockImplementation((token, status, page) => {
        if (status === "RETURNED") {
            return { data: returnedData, loading: false };
        }

        if (status === "BORROWING") {
            return { data: borrowedData, loading: false };
        }

        return { data: allData, loading: false };
    });
});

const renderComponent = (value = {
    token: "fake-token",
    user: { id: 1 }
}) => {
    return render(
        <MemoryRouter>
            <AuthContent.Provider value={value}>
                <BorrowingHistory />
            </AuthContent.Provider>
        </MemoryRouter>
    );
};

test("render ALL borrowing history", async () => {
    renderComponent()
    expect(await screen.findByText("Book A")).toBeInTheDocument();
    expect(await screen.findByText("Book B")).toBeInTheDocument();
});

test("filter BORROWING status", async () => {
    renderComponent()
    fireEvent.change(screen.getByTestId("status-select"), {
        target: { value: "BORROWING" }
    });

    await waitFor(() => {
        expect(screen.getByText("Book A")).toBeInTheDocument();
        expect(screen.queryByText("Book B")).not.toBeInTheDocument();
    });

    expect(BorrowingListByUser).toHaveBeenLastCalledWith(
        "fake-token",
        "BORROWING",
        1
    );
});

test("filter RETURNED status", async () => {
    renderComponent()
    fireEvent.change(screen.getByTestId("status-select"), {
        target: { value: "RETURNED" }
    });

    await waitFor(() => {
        expect(screen.getByText("Book B")).toBeInTheDocument();
        expect(screen.queryByText("Book A")).not.toBeInTheDocument();
    });

    expect(BorrowingListByUser).toHaveBeenLastCalledWith(
        "fake-token",
        "RETURNED",
        1
    );
});

test("should render pagination on UI", async () => {
    renderComponent()
    expect(await screen.findByTestId("pagination")).toBeInTheDocument();
});

test("should change page when click pagination", async () => {
    renderComponent()
    const btn = await screen.findByTestId("next-page");

    fireEvent.click(btn);

    await waitFor(() => {
        expect(BorrowingListByUser).toHaveBeenLastCalledWith(
            "fake-token",
            "",
            2
        );
    });
});

test("show loading component", () => {
    mockBorrowingListByUser.mockReturnValue({
        data: null,
        loading: true
    });

    renderComponent()
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
});

test("show overdue button", () => {
    mockBorrowingListByUser.mockReturnValue({
        data: {
            results: [
                {
                    id: 1,
                    status: "OVERDUE",
                    book: { name: "Book X" }
                }
            ]
        },
        loading: false
    });

    renderComponent()
    expect(
        screen.getByText(/Gia hạn/i)
    ).toBeInTheDocument();
});

test("show login link when user is not logged in", () => {
    renderComponent({
        token: null,
        user: null
    });

    const loginLink = screen.getByRole("link", {
        name: /login ngay/i
    });

    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
});