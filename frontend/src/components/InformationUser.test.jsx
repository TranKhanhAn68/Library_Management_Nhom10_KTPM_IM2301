import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import React from "react";
import InformationUser from "./InformationUser";

// ===== MOCK CONTEXT =====
const mockSetUser = vi.fn();

vi.mock("../utils/AuthContext", () => ({
    AuthContent: React.createContext({
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
    })
}));

// ===== MOCK getError =====
vi.mock("../utils/GetError", () => ({
    getError: (res) => res.errors || ["Lỗi server"]
}));

// ===== MOCK FETCH =====
global.fetch = vi.fn();

describe("InformationUser Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("render user info correctly", () => {
        render(<InformationUser />);

        expect(screen.getByText("Thông tin cá nhân")).toBeInTheDocument();
        expect(screen.getByText("An Tran")).toBeInTheDocument();
        expect(screen.getByText("test@gmail.com")).toBeInTheDocument();
    });

    it("shows validation errors when submit empty form", async () => {
        render(<InformationUser />);

        const submitBtn = screen.getByRole("button", { name: /lưu thay đổi/i });

        fireEvent.click(submitBtn);

        expect(await screen.findByText("Họ không được để trống")).toBeInTheDocument();
    });

    it("submits form successfully", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                first_name: "Updated",
                last_name: "User"
            })
        });

        render(<InformationUser />);

        const submitBtn = screen.getByRole("button", { name: /lưu thay đổi/i });

        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
            expect(mockSetUser).toHaveBeenCalled();
        });

        expect(await screen.findByText("Cập nhật thành công!")).toBeInTheDocument();
    });

    it("shows API error when request fails", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({
                errors: ["Số điện thoại không hợp lệ"]
            })
        });

        render(<InformationUser />);

        const submitBtn = screen.getByRole("button", { name: /lưu thay đổi/i });

        fireEvent.click(submitBtn);

        expect(await screen.findByText("Số điện thoại không hợp lệ")).toBeInTheDocument();
    });
});