// ChangePassword.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, test, expect, beforeEach } from "vitest";
import React from "react";
import ChangePassword from "./ChangePassword";
import { AuthContent } from "../utils/AuthContext";

vi.mock("../utils/GetError", () => ({
    getError: vi.fn(() => "Lỗi từ server")
}));

global.fetch = vi.fn();

const renderComponent = () => {
    return render(
        <AuthContent.Provider value={{ token: "fake-token" }}>
            <ChangePassword />
        </AuthContent.Provider>
    );
};

beforeEach(() => {
    vi.clearAllMocks();
});

test("render input fields", () => {
    renderComponent();

    expect(screen.getByLabelText(/Mật khẩu hiện tại/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mật khẩu mới/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Xác nhận mật khẩu/i)).toBeInTheDocument();
});


test("show error when submit empty", async () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /Đổi mật khẩu/i }));

    expect(await screen.findByText(/Vui lòng nhập mật khẩu hiện tại/i)).toBeInTheDocument();
    expect(await screen.findByText(/Vui lòng nhập mật khẩu mới/i)).toBeInTheDocument();
    expect(await screen.findByText(/Vui lòng xác nhận mật khẩu/i)).toBeInTheDocument();

});


test("show error when password not match", async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Mật khẩu hiện tại/i), {
        target: { value: "123456" }
    });

    fireEvent.change(screen.getByLabelText(/Mật khẩu mới/i), {
        target: { value: "12345678" }
    });

    fireEvent.change(screen.getByLabelText(/Xác nhận mật khẩu/i), {
        target: { value: "abc" }
    });

    fireEvent.click(screen.getByRole("button", { name: /Đổi mật khẩu/i }));

    expect(await screen.findByText(/Mật khẩu không khớp/i)).toBeInTheDocument();
});

test("not show error ", async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Mật khẩu hiện tại/i), {
        target: { value: "abcxyz123" }
    });

    fireEvent.change(screen.getByLabelText(/Mật khẩu mới/i), {
        target: { value: "12345678" }
    });

    fireEvent.change(screen.getByLabelText(/Xác nhận mật khẩu/i), {
        target: { value: "12345678" }
    });

    fireEvent.click(screen.getByRole("button", { name: /Đổi mật khẩu/i }));
    expect(
        screen.queryByLabelText("errors")
    ).not.toBeInTheDocument();
});

test("show success message", async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Đổi mật khẩu thành công" })
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Mật khẩu hiện tại/i), {
        target: { value: "old123" }
    });

    fireEvent.change(screen.getByLabelText(/Mật khẩu mới/i), {
        target: { value: "new12345" }
    });

    fireEvent.change(screen.getByLabelText(/Xác nhận mật khẩu/i), {
        target: { value: "new12345" }
    });

    fireEvent.click(screen.getByRole("button", { name: /Đổi mật khẩu/i }));

    expect(
        await screen.findByText(/Đổi mật khẩu thành công/i)
    ).toBeInTheDocument();

    expect(
        screen.queryByRole("alert", { name: /errors/i })
    ).not.toBeInTheDocument();

    await waitFor(() => {
        expect(screen.getByLabelText(/Mật khẩu hiện tại/i).value).toBe("");
    });
});

test("toggle show/hide old password", () => {
    renderComponent();
    const input = screen.getByLabelText("Mật khẩu hiện tại");
    expect(input.type).toBe("password");
    const toggleBtn = input.parentElement.querySelector("span");

    fireEvent.click(toggleBtn);

    expect(input.type).toBe("text");

    fireEvent.click(toggleBtn);

    expect(input.type).toBe("password");
})

test("show server error", async () => {
    fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
            detail: "Sai mật khẩu"
        })
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Mật khẩu hiện tại/i), {
        target: { value: "old123" }
    });

    fireEvent.change(screen.getByLabelText(/Mật khẩu mới/i), {
        target: { value: "new12345" }
    });

    fireEvent.change(screen.getByLabelText(/Xác nhận mật khẩu/i), {
        target: { value: "new12345" }
    });

    fireEvent.click(screen.getByRole("button", {
        name: /Đổi mật khẩu/i
    }));

    expect(
        await screen.findByText(/Lỗi từ server/i)
    ).toBeInTheDocument();
});

test("show loading state", async () => {
    fetch.mockImplementationOnce(() =>
        new Promise(resolve =>
            setTimeout(() =>
                resolve({
                    ok: true,
                    json: async () => ({
                        message: "Success"
                    })
                }), 100)
        )
    );
    renderComponent();
    fireEvent.change(screen.getByLabelText(/Mật khẩu hiện tại/i), {
        target: { value: "old123" }
    });

    fireEvent.change(screen.getByLabelText(/Mật khẩu mới/i), {
        target: { value: "new12345" }
    });

    fireEvent.change(screen.getByLabelText(/Xác nhận mật khẩu/i), {
        target: { value: "new12345" }
    });

    fireEvent.click(screen.getByRole("button", {
        name: /Đổi mật khẩu/i
    }));

    expect(
        screen.getByText(/Đang xử lý/i)
    ).toBeInTheDocument();
});
