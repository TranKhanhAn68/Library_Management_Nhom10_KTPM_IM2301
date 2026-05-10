import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, beforeEach, test, expect } from "vitest";
import React from "react";
import InformationUser from "./InformationUser";
import { AuthContent } from "../utils/AuthContext";

const mockSetUser = vi.fn();

global.fetch = vi.fn();

vi.mock("./BaseModal", () => ({
    default: ({ children, open }) =>
        open ? <div>{children}</div> : null
}));

const contextValue = {
    user: {
        first_name: "An",
        last_name: "Tran",
        gender: "Nam",
        dob: "2000-01-01",
        phone_number: "0123456789",
        email: "test@gmail.com",
        is_active: true,
        image: ""
    },
    token: "fake-token",
    setUser: mockSetUser
};

const renderUI = () =>
    render(
        <AuthContent.Provider value={contextValue}>
            <InformationUser />
        </AuthContent.Provider>
    );

beforeEach(() => {
    vi.clearAllMocks();
});


test("render UI correctly", () => {
    renderUI();

    expect(screen.getByText("Thông tin cá nhân")).toBeInTheDocument();
    expect(screen.getByText("An Tran")).toBeInTheDocument();
    expect(screen.getByText("test@gmail.com")).toBeInTheDocument();
});

test("opens modal", () => {
    renderUI();

    fireEvent.click(screen.getByText("Chỉnh sửa hồ sơ"));

    expect(screen.getByText("Cập nhật thông tin")).toBeInTheDocument();
});

test("validation shows errors", async () => {
    renderUI();

    fireEvent.click(screen.getByText("Chỉnh sửa hồ sơ"));

    fireEvent.change(screen.getByPlaceholderText("Nguyễn"), {
        target: { value: "" }
    });

    fireEvent.click(screen.getByRole("button", { name: /lưu thay đổi/i }));

    expect(
        await screen.findByText("Họ không được để trống")
    ).toBeInTheDocument();
});

test("shows multiple validation errors", async () => {
    renderUI();

    fireEvent.click(screen.getByText("Chỉnh sửa hồ sơ"));

    fireEvent.change(screen.getByPlaceholderText("Nguyễn"), {
        target: { value: "" }
    });

    fireEvent.change(screen.getByPlaceholderText("Văn An"), {
        target: { value: "" }
    });

    fireEvent.click(screen.getByRole("button", { name: /lưu thay đổi/i }));

    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
});

test("calls API when valid", async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ first_name: "Updated" })
    });

    renderUI();

    fireEvent.click(screen.getByText("Chỉnh sửa hồ sơ"));
    fireEvent.click(screen.getByRole("button", { name: /lưu thay đổi/i }));

    await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});

test("PATCH API called correctly", async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
    });

    renderUI();

    fireEvent.click(screen.getByText("Chỉnh sửa hồ sơ"));
    fireEvent.click(screen.getByRole("button", { name: /lưu thay đổi/i }));

    await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("/users/current_user/"),
            expect.objectContaining({ method: "PATCH" })
        );
    });
});

test("error API response shows list errors", async () => {
    fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
            message: "Server error"
        })
    });

    renderUI();

    fireEvent.click(screen.getByText("Chỉnh sửa hồ sơ"));
    fireEvent.click(screen.getByRole("button", { name: /lưu thay đổi/i }));

    // ❗ FIX: KHÔNG tìm role="alert"
    expect(
        await screen.findByText("Server error")
    ).toBeInTheDocument();
});

test("loading disables button", async () => {
    let resolve;
    fetch.mockReturnValueOnce(
        new Promise(r => (resolve = r))
    );

    renderUI();

    fireEvent.click(screen.getByText("Chỉnh sửa hồ sơ"));
    fireEvent.click(screen.getByRole("button", { name: /lưu thay đổi/i }));

    expect(
        screen.getByRole("button", { name: /đang lưu/i })
    ).toBeDisabled();

    resolve({
        ok: true,
        json: async () => ({})
    });
});

test("setUser called after success", async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ first_name: "NewName" })
    });

    renderUI();

    fireEvent.click(screen.getByText("Chỉnh sửa hồ sơ"));
    fireEvent.click(screen.getByRole("button", { name: /lưu thay đổi/i }));

    await waitFor(() => {
        expect(mockSetUser).toHaveBeenCalled();
    });
});

test("rejects file > 2MB", () => {
    renderUI();

    window.alert = vi.fn();

    fireEvent.click(screen.getByText("Chỉnh sửa hồ sơ"));

    const bigFile = new File(
        [new ArrayBuffer(3 * 1024 * 1024)],
        "big.png",
        { type: "image/png" }
    );

    const input = document.querySelector('input[type="file"]');

    fireEvent.change(input, { target: { files: [bigFile] } });

    expect(window.alert).toHaveBeenCalled();
});



test("handleChange avatar branch", () => {
    renderUI();

    fireEvent.click(screen.getByText("Chỉnh sửa hồ sơ"));

    const file = new File(["x"], "a.png", { type: "image/png" });

    const input = document.querySelector('input[type="file"]');

    fireEvent.change(input, {
        target: { name: "avatar", files: [file] }
    });
    expect(input.files[0]).toBe(file);
});

test("first_name whitespace is invalid", async () => {
    renderUI();

    fireEvent.click(screen.getByText("Chỉnh sửa hồ sơ"));

    fireEvent.change(screen.getByPlaceholderText("Nguyễn"), {
        target: { value: "   " }
    });

    fireEvent.click(screen.getByRole("button", { name: /lưu thay đổi/i }));

    expect(
        await screen.findByText("Họ không được để trống")
    ).toBeInTheDocument();
});

vi.mock("../utils/GetError", () => ({
    getError: vi.fn(() => ["Server error"])
}));

test("API error shows list errors", async () => {
    fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "fail" })
    });

    renderUI();

    fireEvent.click(screen.getByText("Chỉnh sửa hồ sơ"));
    fireEvent.click(screen.getByRole("button", { name: /lưu thay đổi/i }));

    expect(await screen.findByRole("list")).toBeInTheDocument();
});

test("updates user context", async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ first_name: "New" })
    });

    renderUI();

    fireEvent.click(screen.getByText("Chỉnh sửa hồ sơ"));
    fireEvent.click(screen.getByRole("button", { name: /lưu thay đổi/i }));

    await waitFor(() => {
        expect(mockSetUser).toHaveBeenCalledWith(
            expect.any(Function)
        );
    });
});

test("loading state disables button", async () => {
    let resolve;
    fetch.mockReturnValueOnce(new Promise(r => (resolve = r)));

    renderUI();

    fireEvent.click(screen.getByText("Chỉnh sửa hồ sơ"));
    fireEvent.click(screen.getByRole("button", { name: /lưu thay đổi/i }));

    expect(screen.getByRole("button", { name: /đang lưu/i })).toBeDisabled();

    resolve({
        ok: true,
        json: async () => ({})
    });
});

test("closes modal after success", async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
    });

    renderUI();

    fireEvent.click(screen.getByText("Chỉnh sửa hồ sơ"));
    fireEvent.click(screen.getByRole("button", { name: /lưu thay đổi/i }));

    await waitFor(() => {
        expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });
});


test("updates preview when file selected", () => {
    global.URL.createObjectURL = vi.fn(() => "blob:url");

    renderUI();

    fireEvent.click(screen.getByText("Chỉnh sửa hồ sơ"));

    const file = new File(["x"], "a.png", { type: "image/png" });

    const input = document.querySelector('input[type="file"]');

    fireEvent.change(input, {
        target: { files: [file] }
    });

    expect(global.URL.createObjectURL).toHaveBeenCalled();
});

test("renders fallback values correctly", () => {
    const userEmpty = {
        ...contextValue.user,
        phone_number: "",
        gender: "",
        dob: null
    };

    render(
        <AuthContent.Provider value={{ ...contextValue, user: userEmpty }}>
            <InformationUser />
        </AuthContent.Provider>
    );

    fireEvent.click(screen.getByText("Chỉnh sửa hồ sơ"));

    expect(screen.getAllByText("Chưa cập nhật").length).toBeGreaterThan(0);
});

test("sets preview when user has image", () => {
    const userWithImage = {
        ...contextValue.user,
        image: "avatar.png"
    };

    render(
        <AuthContent.Provider
            value={{
                ...contextValue,
                user: userWithImage
            }}
        >
            <InformationUser />
        </AuthContent.Provider>
    );

    const image = screen.getByAltText(/avatar/i);

    expect(image.getAttribute("src"))
        .toContain("avatar.png");
});

test("shows error when gender is empty", async () => {
    renderUI();

    fireEvent.click(screen.getByText("Chỉnh sửa hồ sơ"));

    const genderSelect = screen.getByDisplayValue("Nam");

    fireEvent.change(genderSelect, {
        target: {
            value: ""
        }
    });

    fireEvent.click(
        screen.getByRole("button", {
            name: /lưu thay đổi/i
        })
    );

    expect(
        await screen.findByText("Vui lòng chọn giới tính")
    ).toBeInTheDocument();
});


test("shows invalid phone number error", async () => {
    renderUI();

    fireEvent.click(screen.getByText("Chỉnh sửa hồ sơ"));

    const phoneInput = screen.getByDisplayValue("0123456789");

    fireEvent.change(phoneInput, {
        target: {
            value: "123"
        }
    });

    fireEvent.click(
        screen.getByRole("button", {
            name: /lưu thay đổi/i
        })
    );

    expect(
        await screen.findByText("Số điện thoại không hợp lệ")
    ).toBeInTheDocument();
});