import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import React from "react";
import PublisherDashboard from "./PublisherDashboard";
import { AuthContent } from "../../../utils/AuthContext";

vi.mock("../../../services/PublisherAPI", () => ({
    PublisherListAPI: vi.fn(),
    PostPublisher: vi.fn(),
    DeletePublisher: vi.fn(),
}));

vi.mock("../../../components/Loading", () => ({
    default: () => <div>Loading...</div>,
}));

import {
    PublisherListAPI,
    PostPublisher,
    DeletePublisher,
} from "../../../services/PublisherAPI";

const renderWithProvider = () => {
    return render(
        <AuthContent.Provider value={{ token: "fake-token" }}>
            <PublisherDashboard />
        </AuthContent.Provider>
    );
};


beforeEach(() => {
    vi.clearAllMocks();

    PublisherListAPI.mockReturnValue([
        [
            {
                id: 1,
                name: "NXB Kim Đồng",
            },
        ],
    ]);
});

test("render publishers", () => {
    renderWithProvider();

    expect(screen.getByText("Quản lý nhà xuất bản")).toBeInTheDocument();

    expect(screen.getByText("NXB Kim Đồng")).toBeInTheDocument();
});

test("validate empty name", async () => {
    const user = userEvent.setup();

    renderWithProvider();

    await user.click(
        screen.getByRole("button", {
            name: /thêm nhà xuất bản/i,
        })
    );

    expect(
        screen.getByText("Tên nhà xuất bản không được để trống")
    ).toBeInTheDocument();
});

test("create publisher success", async () => {
    const user = userEvent.setup();

    PostPublisher.mockResolvedValueOnce("Success");

    renderWithProvider();

    await user.type(
        screen.getByPlaceholderText("NXB Kim Đồng"),
        "NXB Trẻ"
    );

    await user.click(
        screen.getByRole("button", {
            name: /thêm nhà xuất bản/i,
        })
    );

    await waitFor(() => {
        expect(PostPublisher).toHaveBeenCalledWith(
            "fake-token",
            "NXB Trẻ"
        );
    });
});

test("create publisher fail", async () => {
    const user = userEvent.setup();

    PostPublisher.mockRejectedValueOnce("Lỗi server");

    renderWithProvider();

    await user.type(
        screen.getByPlaceholderText("NXB Kim Đồng"),
        "NXB Trẻ"
    );

    await user.click(
        screen.getByRole("button", {
            name: /thêm nhà xuất bản/i,
        })
    );

    await waitFor(() => {
        expect(PostPublisher).toHaveBeenCalled();
    });
});

test("delete publisher", async () => {
    const user = userEvent.setup();

    DeletePublisher.mockResolvedValueOnce("Deleted");

    renderWithProvider();

    const deleteButton = screen.getByRole("button", {
        name: "",
    });

    await user.click(deleteButton);

    await waitFor(() => {
        expect(DeletePublisher).toHaveBeenCalledWith(
            "fake-token",
            1
        );
    });
});

test("delete publisher fail", async () => {
    const user = userEvent.setup();

    window.alert = vi.fn();

    DeletePublisher.mockRejectedValueOnce("Delete failed");

    renderWithProvider();

    const deleteButton = screen.getByRole("button", {
        name: "",
    });

    await user.click(deleteButton);

    await waitFor(() => {
        expect(DeletePublisher).toHaveBeenCalled();
    });

    expect(window.alert).toHaveBeenCalledWith("Delete failed");
});