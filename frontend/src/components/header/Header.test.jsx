import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, test, expect, beforeEach } from "vitest";
import React from "react";
import Header from "./Header";
import { MemoryRouter } from "react-router-dom";
import { AuthContent } from "../../utils/AuthContext";

const mockNavigate = vi.fn();
vi.mock("./Menu", () => ({
    default: () => <div data-testid="menu">Menu</div>
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

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
            status: false,
        })
    };
});

const mockLogout = vi.fn();

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



test("render header basic", () => {
    render(
        <MemoryRouter>
            <Header {...defaultProps} />
        </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Nhập vào sách cần tìm"))
        .toBeInTheDocument();
});


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


test("show login button when not logged in", () => {
    render(
        <MemoryRouter>
            <Header {...defaultProps} />
        </MemoryRouter>
    );

    expect(screen.getByText("Đăng nhập")).toBeInTheDocument();
});


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

test("logout success flow", async () => {
    mockLogout.mockResolvedValue();

    render(
        <AuthContent.Provider value={{
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

    fireEvent.click(screen.getByText("Đăng xuất"));

    expect(screen.getByText("Đang đăng xuất...")).toBeInTheDocument();

    await waitFor(() => {
        expect(mockLogout).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    await waitFor(() => {
        expect(screen.getByText("Đăng xuất")).toBeInTheDocument();
    });
});

test("show cart badge when cart has items", () => {
    render(
        <MemoryRouter>
            <Header {...defaultProps} cart={[1, 2]} />
        </MemoryRouter>
    );

    expect(screen.getByText("2")).toBeInTheDocument();
});


test("hide cart badge when empty", () => {
    render(
        <MemoryRouter>
            <Header {...defaultProps} cart={[]} />
        </MemoryRouter>
    );

    const badge = screen.getByLabelText("badge")
    expect(badge).toHaveClass("d-none");

});

test("can't click logout while loading", async () => {
    const pendingPromise = new Promise(() => { }); // giữ pending

    mockLogout.mockReturnValueOnce(pendingPromise);

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

    const btn = screen.getByText("Đăng xuất");

    fireEvent.click(btn);

    expect(screen.getByText("Đang đăng xuất...")).toBeInTheDocument();

    fireEvent.click(btn);

    await waitFor(() => {
        expect(mockLogout).toHaveBeenCalledTimes(1);
    });
});