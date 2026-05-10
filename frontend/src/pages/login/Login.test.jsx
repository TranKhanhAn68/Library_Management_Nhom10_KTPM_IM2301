import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import { AuthContent } from "../../utils/AuthContext";
import { BrowserRouter } from "react-router-dom";

// mock navigate
const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockedNavigate,
    };
});

// mock Loading component
vi.mock("../../components/Loading", () => ({
    default: () => <div>Loading...</div>,
}));

// helper render
const renderUI = (authValue) => {
    return render(
        <AuthContent.Provider value={authValue}>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </AuthContent.Provider>
    );
};

let loginMock;
let setTokenMock;
let setReloadMock;

beforeEach(() => {
    loginMock = vi.fn();
    setTokenMock = vi.fn();
    setReloadMock = vi.fn();

    localStorage.clear();
    mockedNavigate.mockReset();
});

test("render đúng UI", () => {
    renderUI({
        login: loginMock,
        setToken: setTokenMock,
        setReload: setReloadMock,
    });

    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter the username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter the password/i)).toBeInTheDocument();
});

test("validate empty fields", async () => {
    renderUI({
        login: loginMock,
        setToken: setTokenMock,
        setReload: setReloadMock,
    });

    fireEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

    expect(await screen.findByText(/không được bỏ trống/i)).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
});

test("login success", async () => {
    loginMock.mockResolvedValue({ token: "abc123" });

    renderUI({
        login: loginMock,
        setToken: setTokenMock,
        setReload: setReloadMock,
    });

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
        target: { value: "admin" },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

    await waitFor(() => {
        expect(loginMock).toHaveBeenCalledWith("admin", "123456");
    });

    expect(localStorage.getItem("storedUsername")).toBe("admin");
    expect(localStorage.getItem("token")).toBe("abc123");

    expect(setTokenMock).toHaveBeenCalledWith("abc123");
    expect(setReloadMock).toHaveBeenCalled();

    expect(mockedNavigate).toHaveBeenCalledWith("/");
});

test("login fail hiển thị lỗi", async () => {
    loginMock.mockRejectedValue({ message: "Sai tài khoản" });

    renderUI({
        login: loginMock,
        setToken: setTokenMock,
        setReload: setReloadMock,
    });

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
        target: { value: "admin" },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: "wrong" },
    });

    fireEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

    expect(await screen.findByText(/sai tài khoản/i)).toBeInTheDocument();
});

test("focus input khi submit", () => {
    renderUI({
        login: loginMock,
        setToken: setTokenMock,
        setReload: setReloadMock,
    });

    const input = screen.getByPlaceholderText(/username/i);

    fireEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

    expect(document.activeElement).toBe(input);
});

test("set username từ localStorage nếu có storedUsername", () => {
    localStorage.setItem("storedUsername", "admin123");

    renderUI({
        login: loginMock,
        setToken: setTokenMock,
        setReload: setReloadMock,
    });

    const input = screen.getByPlaceholderText(/enter the username/i);

    expect(input.value).toBe("admin123");
});