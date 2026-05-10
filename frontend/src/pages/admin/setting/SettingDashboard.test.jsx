import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import React from "react";
import SettingDashboard from "./SettingDashboard";
import { MemoryRouter } from "react-router-dom";
import { AuthContent } from "../../../utils/AuthContext";

// MOCK API
vi.mock("../../../services/SettingAPI", () => ({
    SettingListAPI: vi.fn(),
    UpdateSetting: vi.fn(),
}));

// MOCK COMPONENT
vi.mock("../../../components/Loading", () => ({
    default: () => <div>Loading...</div>
}));

vi.mock("../../../components/BaseModal", () => ({
    default: ({ children, open, close }) =>
        open ? (
            <div>
                {children}
                <button onClick={close}>Close</button>
            </div>
        ) : null
}));

// MOCK ERROR
vi.mock("../../../utils/GetError", () => ({
    getError: vi.fn(() => ["Lỗi server"])
}));

import {
    SettingListAPI,
    UpdateSetting
} from "../../../services/SettingAPI";

const mockSettings = [
    {
        id: 1,
        borrowing_days: 7,
        borrowing_fee: 10000,
        borrowing_overdue_fine: 5000,
        active: true
    },
    {
        id: 2,
        borrowing_days: 14,
        borrowing_fee: 20000,
        borrowing_overdue_fine: 10000,
        active: false
    }
];

const renderWithProvider = () => {
    return render(
        <AuthContent.Provider value={{ token: "fake-token" }}>
            <MemoryRouter>
                <SettingDashboard />
            </MemoryRouter>
        </AuthContent.Provider>
    );
};


beforeEach(() => {
    vi.clearAllMocks();

    SettingListAPI.mockReturnValue(mockSettings);
});

test("render setting list", () => {
    renderWithProvider();

    expect(screen.getByText("Setting")).toBeInTheDocument();

    expect(
        screen.getAllByText("7, 10000, 5000").length
    ).toBeGreaterThan(0);

    expect(
        screen.getAllByText("14, 20000, 10000").length
    ).toBeGreaterThan(0);
});

test("render active setting section", () => {
    renderWithProvider();

    expect(
        screen.getByText("Các cài đặt đã được thực hiện")
    ).toBeInTheDocument();

    expect(
        screen.getAllByText("7, 10000, 5000").length
    ).toBeGreaterThan(0);
});

test("render detail information", async () => {
    const user = userEvent.setup();

    renderWithProvider();

    const button = screen.getAllByText("7, 10000, 5000")[0];

    await user.click(button);

    expect(
        screen.getByText("Chi tiết cài đặt")
    ).toBeInTheDocument();

    expect(
        screen.getByText(/ID:/)
    ).toBeInTheDocument();

    expect(
        screen.getByText(/Số ngày mượn:/)
    ).toBeInTheDocument();

    expect(
        screen.getByText(/7 ngày/)
    ).toBeInTheDocument();

    expect(
        screen.getByText(/10,000 đ/)
    ).toBeInTheDocument();

    expect(
        screen.getByText(/5,000 đ/)
    ).toBeInTheDocument();
});

test("update setting success", async () => {
    UpdateSetting.mockResolvedValueOnce({
        message: "Cập nhật thành công"
    });

    const user = userEvent.setup();

    renderWithProvider();

    const checkbox = screen.getAllByRole("checkbox")[0];

    await user.click(checkbox);

    await waitFor(() => {
        expect(UpdateSetting).toHaveBeenCalled();
    });

    expect(
        screen.getByText("Cập nhật thành công")
    ).toBeInTheDocument();
});

test("update setting fail", async () => {
    UpdateSetting.mockRejectedValueOnce(new Error("fail"));

    const user = userEvent.setup();

    renderWithProvider();

    const checkbox = screen.getAllByRole("checkbox")[0];

    await user.click(checkbox);

    await waitFor(() => {
        expect(UpdateSetting).toHaveBeenCalled();
    });

    expect(
        screen.getByText("Lỗi server")
    ).toBeInTheDocument();
});

test("close message modal", async () => {
    UpdateSetting.mockResolvedValueOnce({
        message: "Cập nhật thành công"
    });

    const user = userEvent.setup();

    renderWithProvider();

    const checkbox = screen.getAllByRole("checkbox")[0];

    await user.click(checkbox);

    expect(
        screen.getByText("Cập nhật thành công")
    ).toBeInTheDocument();

    const closeButtons = screen.getAllByText("Close");

    await user.click(closeButtons[0]);

    await waitFor(() => {
        expect(
            screen.queryByText("Cập nhật thành công")
        ).not.toBeInTheDocument();
    });
});

test("render empty data", () => {
    SettingListAPI.mockReturnValue([]);

    renderWithProvider();

    expect(
        screen.getAllByText("Không có dữ liệu").length
    ).toBeGreaterThan(0);
});

test("close detail modal", async () => {
    const user = userEvent.setup();
    renderWithProvider();
    const button = screen.getAllByText("7, 10000, 5000")[0];
    await user.click(button);
    expect(
        screen.getByText("Chi tiết cài đặt")
    ).toBeInTheDocument();
    const closeBtn = screen.getByText("Đóng");
    await user.click(closeBtn);
    await waitFor(() => {
        expect(
            screen.queryByText("Chi tiết cài đặt")
        ).not.toBeInTheDocument();
    });
});

test("close detail modal with X button", async () => {
    const user = userEvent.setup();

    renderWithProvider();

    const button = screen.getAllByText("7, 10000, 5000")[0];

    await user.click(button);

    expect(
        screen.getByText("Chi tiết cài đặt")
    ).toBeInTheDocument();

    const closeXBtn = screen.getByText("✕");

    await user.click(closeXBtn);

    await waitFor(() => {
        expect(
            screen.queryByText("Chi tiết cài đặt")
        ).not.toBeInTheDocument();
    });
});


test("render active setting item", () => {
    renderWithProvider();
    expect(
        screen.getByText("Các cài đặt đã được thực hiện")
    ).toBeInTheDocument();
    const activeItems = screen.getAllByText("7, 10000, 5000");
    expect(activeItems.length).toBeGreaterThan(0);
    const inactiveItems = screen.getAllByText("14, 20000, 10000");
    expect(inactiveItems.length).toBe(1);
});

