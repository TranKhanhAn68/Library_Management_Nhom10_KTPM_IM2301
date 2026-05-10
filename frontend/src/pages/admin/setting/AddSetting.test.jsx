import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import React from "react";
import AddSetting from "./AddSetting";
import { MemoryRouter } from "react-router-dom";
import { AuthContent } from "../../../utils/AuthContext";
import userEvent from "@testing-library/user-event";

vi.mock("../../../services/SettingAPI", () => ({
    PostSetting: vi.fn(),
}));

vi.mock("../../../components/Loading", () => ({
    default: () => <div>Loading...</div>,
}));
vi.mock("../../../utils/GetError", () => ({
    getError: (err) => err.message
}));
vi.mock("../../../components/BaseModal", () => ({
    default: ({ children, open, close }) =>
        open ? <div role="dialog" onClick={close}>
            {children}
        </div> : null,
}));


const renderWithProviders = (ui) => {
    return render(
        <MemoryRouter>
            <AuthContent.Provider value={{ token: "fake-token" }}>
                {ui}
            </AuthContent.Provider>
        </MemoryRouter>
    );
};

import { PostSetting } from "../../../services/SettingAPI";

test("render AddSetting form", () => {
    renderWithProviders(<AddSetting />);

    expect(screen.getByText("Add Setting")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nhập số ngày...")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nhập số tiền...")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nhập tiền phạt...")).toBeInTheDocument();
});

test("user can fill form", () => {
    renderWithProviders(<AddSetting />);

    fireEvent.change(screen.getByPlaceholderText("Nhập số ngày..."), {
        target: { value: "30" },
    });

    fireEvent.change(screen.getByPlaceholderText("Nhập số tiền..."), {
        target: { value: "10000" },
    });

    fireEvent.change(screen.getByPlaceholderText("Nhập tiền phạt..."), {
        target: { value: "5000" },
    });

    expect(screen.getByDisplayValue("30")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5000")).toBeInTheDocument();
});

test("submit success shows success modal", async () => {
    PostSetting.mockResolvedValueOnce({ success: true });

    const user = userEvent.setup();

    renderWithProviders(<AddSetting />);

    await user.type(screen.getByPlaceholderText("Nhập số ngày..."), "30");
    await user.type(screen.getByPlaceholderText("Nhập số tiền..."), "10000");
    await user.type(screen.getByPlaceholderText("Nhập tiền phạt..."), "5000");

    await user.click(screen.getByText("Tạo cài đặt"));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(
        screen.getByText("Thêm cài đặt mới thành công!")
    ).toBeInTheDocument();
});

test("submit fail shows error modal", async () => {
    PostSetting.mockRejectedValueOnce(new Error("Lỗi server"));

    const user = userEvent.setup();

    renderWithProviders(<AddSetting />);

    await user.type(screen.getByPlaceholderText("Nhập số ngày..."), "30");
    await user.type(screen.getByPlaceholderText("Nhập số tiền..."), "10000");
    await user.type(screen.getByPlaceholderText("Nhập tiền phạt..."), "5000");

    await user.click(screen.getByText("Tạo cài đặt"));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    expect(screen.getByText("Lỗi server")).toBeInTheDocument();
});

test("user can toggle active checkbox", async () => {
    const user = userEvent.setup();

    renderWithProviders(<AddSetting />);

    const checkbox = screen.getByRole("checkbox", {
        name: /kích hoạt cài đặt này/i,
    });

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
});

test("modal closes when close is triggered", async () => {
    PostSetting.mockRejectedValueOnce(new Error("Lỗi server"));

    const user = userEvent.setup();

    renderWithProviders(<AddSetting />);

    await user.type(screen.getByPlaceholderText("Nhập số ngày..."), "30");
    await user.type(screen.getByPlaceholderText("Nhập số tiền..."), "10000");
    await user.type(screen.getByPlaceholderText("Nhập tiền phạt..."), "5000");

    await user.click(screen.getByText("Tạo cài đặt"));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    const dialog = screen.getByRole("dialog");
    await user.click(dialog);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});