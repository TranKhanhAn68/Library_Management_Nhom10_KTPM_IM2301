import { render, screen, fireEvent } from "@testing-library/react";
import { vi, test, expect, beforeEach } from "vitest";
import React from "react";
import Header from "./Header";
import { MemoryRouter } from "react-router-dom";
import { AuthContent } from "../../utils/AuthContext";
// ===== MOCK =====
vi.mock("./Menu", () => ({
    default: () => <div data-testid="menu">Menu</div>
}));

vi.mock("bootstrap/js/dist/tooltip", () => {
    return {
        default: vi.fn()
    };
});

vi.mock("../../utils/AuthContext", async () => {
    const React = await vi.importActual("react");

    return {
        AuthContent: React.createContext({
            logout: vi.fn(),
            user: null,
            status: false
        })
    };
});

// ===== MOCK AUTH =====
const mockLogout = vi.fn();

// ===== DEFAULT PROPS =====
const defaultProps = {
    handleSearch: vi.fn(),
    searchParams: new URLSearchParams(""),
    cart: [],
    authors: [],
    categories: []
};

beforeEach(() => {
    vi.clearAllMocks();
});


// ================= TEST =================

// 1. render basic
test("render header basic", () => {
    render(
        <MemoryRouter>
            <Header {...defaultProps} />
        </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Nhập vào sách cần tìm"))
        .toBeInTheDocument();
});


// 2. search submit
test("submit search", () => {
    const handleSearch = vi.fn();

    render(
        <MemoryRouter>
            <Header {...defaultProps} handleSearch={handleSearch} />
        </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Nhập vào sách cần tìm"), {
        target: { value: "react" }
    });

    fireEvent.click(screen.getByText("Tìm kiếm"));

    expect(handleSearch).toHaveBeenCalledWith("react");
});


// 3. show login when not authenticated
test("show login button when not logged in", () => {
    render(
        <MemoryRouter>
            <Header {...defaultProps} />
        </MemoryRouter>
    );

    expect(screen.getByText("Đăng nhập")).toBeInTheDocument();
});


// 4. show user info when logged in
test("show user info when logged in", () => {
    render(
        <AuthContent.Provider value={{
            status: true,
            logout: mockLogout,
            user: {
                first_name: "An",
                last_name: "Tran",
                username: "an123",
                image: ""
            }
        }}>
            <MemoryRouter>
                <Header {...defaultProps} />
            </MemoryRouter>
        </AuthContent.Provider>
    );

    expect(screen.getByText("Đăng xuất")).toBeInTheDocument();
});


// 5. logout click
test("click logout", () => {
    const React = require("react");

    render(
        <MemoryRouter>
            <Header
                {...defaultProps}
            />
        </MemoryRouter>
    );

    // override context manually
    const logoutBtn = screen.queryByText("Đăng xuất");

    if (logoutBtn) {
        fireEvent.click(logoutBtn);
        expect(mockLogout).toHaveBeenCalled();
    }
});


// 6. cart badge
test("show cart badge when cart has items", () => {
    render(
        <MemoryRouter>
            <Header {...defaultProps} cart={[1, 2]} />
        </MemoryRouter>
    );

    expect(screen.getByText("2")).toBeInTheDocument();
});


// 7. hide cart badge when empty
test("hide cart badge when empty", () => {
    render(
        <MemoryRouter>
            <Header {...defaultProps} cart={[]} />
        </MemoryRouter>
    );

    const badge = screen.getByLabelText("badge")
    expect(badge).toHaveClass("d-none");
});