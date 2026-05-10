import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Navbar from "./Navbar";
import { MemoryRouter } from "react-router-dom";
import { AuthContent } from "../../utils/AuthContext";

const mockNavigate = vi.fn();
const mockLogout = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        Link: ({ children, onClick }) => (
            <a onClick={onClick}>{children}</a>
        ),
    };
});

const renderNavbar = (user = { username: "An" }) => {
    return render(
        <AuthContent.Provider value={{ user, logout: mockLogout }}>
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        </AuthContent.Provider>
    );
};

beforeEach(() => {
    vi.clearAllMocks();
});


test("render username đúng", () => {
    renderNavbar({ username: "AnDepTrai" });

    expect(screen.getByText("AnDepTrai")).toBeInTheDocument();
});

test("active logout and handle logout returning admin login", async () => {
    mockLogout.mockResolvedValueOnce();

    renderNavbar();

    const btn = screen.getByText("Đăng xuất");
    fireEvent.click(btn);

    // loading state
    expect(screen.getByText("Đang đăng xuất...")).toBeInTheDocument();

    await waitFor(() => {
        expect(mockLogout).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
});

test("click Trang chủ open new page at new tag", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => { });

    renderNavbar();

    const homeBtn = screen.getByText("Trang chủ");
    fireEvent.click(homeBtn);

    expect(openSpy).toHaveBeenCalledWith("/", "_blank");

    openSpy.mockRestore();
});

test("can't click logout while loading", async () => {
    mockLogout.mockResolvedValueOnce(() => new Promise(() => { }));

    renderNavbar();

    const btn = screen.getByText("Đăng xuất");

    fireEvent.click(btn);

    expect(screen.getByText("Đang đăng xuất...")).toBeInTheDocument();

    fireEvent.click(btn);

    await waitFor(() => {
        expect(mockLogout).toHaveBeenCalledTimes(1);
    });
});