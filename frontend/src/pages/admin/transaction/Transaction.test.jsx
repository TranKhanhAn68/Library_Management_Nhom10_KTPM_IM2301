import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

vi.mock("../../../services/BorrowAPI", () => ({
    BorrowListAPI: vi.fn(),
    BorrowChange: vi.fn(),
    BorrowChangeStatus: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
    Link: ({ children }) => <a>{children}</a>
}));

vi.mock("../../../components/BaseModal", () => ({
    default: ({ children, open, close }) =>
        open ? (
            <div>
                {children}
                <button onClick={close}>Close Modal</button>
            </div>
        ) : null
}));

vi.mock("../../../components/Input", () => ({
    default: ({ value, onChange, placeholder }) => (
        <input value={value} onChange={onChange} placeholder={placeholder} />
    )
}));

vi.mock("../../../components/Pagination", () => ({
    default: ({ goPage }) => (
        <button onClick={() => goPage(2)}>Next Page</button>
    )
}));

vi.mock("./DetailTransaction", () => ({
    default: ({ selected, handleUpdateNote }) =>
        selected ? (
            <div>
                <p>Detail Transaction</p>
                <button onClick={handleUpdateNote}>
                    Save Note
                </button>
            </div>
        ) : null
}));

import Transaction from "./Transaction";
import {
    BorrowListAPI,
    BorrowChange,
    BorrowChangeStatus
} from "../../../services/BorrowAPI";
import { AuthContent } from "../../../utils/AuthContext";

const renderUI = () => {
    return render(
        <AuthContent.Provider value={{ token: "fake-token" }}>
            <Transaction />
        </AuthContent.Provider>
    );
};

beforeEach(() => {
    BorrowListAPI.mockReturnValue({
        count: 1,
        results: [
            {
                id: 1,
                status: "BORROWING",
                price: 100000,
                created_at: "2025-01-01T10:00:00Z",
                borrowing_book_date: "2025-01-02",

                user: {
                    first_name: "A",
                    last_name: "B",
                    email: "a@gmail.com",
                    image: "img.jpg"
                },

                book: {
                    name: "Book A",
                    image: "book.jpg"
                }
            }
        ]
    });
});

test("render transaction list", () => {
    renderUI();

    expect(screen.getByText("Quản lý sách đã đặt")).toBeInTheDocument();
    expect(screen.getByText("Book A")).toBeInTheDocument();
});

test("render empty data", async () => {
    BorrowListAPI.mockReturnValue({
        count: 0,
        results: []
    });

    renderUI();

    expect(
        await screen.findByText("Không có dữ liệu")
    ).toBeInTheDocument();
});

test("open detail transaction", async () => {
    const user = userEvent.setup();
    renderUI();

    await user.click(screen.getByLabelText("view-detail"));

    expect(screen.getByText("Detail Transaction")).toBeInTheDocument();
});

test("change search inputs", async () => {
    const user = userEvent.setup();
    renderUI();

    const inputs = screen.getAllByRole("textbox");

    await user.type(inputs[0], "Nguyen Van A");
    await user.type(inputs[1], "Harry Potter");

    expect(inputs[0]).toHaveValue("Nguyen Van A");
    expect(inputs[1]).toHaveValue("Harry Potter");
});

test("click search button", async () => {
    const user = userEvent.setup();
    renderUI();

    await user.click(screen.getByText("Tìm kiếm"));

    expect(BorrowListAPI).toHaveBeenCalled();
});

test("change page", async () => {
    const user = userEvent.setup();
    renderUI();

    await user.click(screen.getByText("Next Page"));

    expect(BorrowListAPI).toHaveBeenCalled();
});

test("open status modal", async () => {
    const user = userEvent.setup();
    renderUI();

    await user.click(screen.getByText(/Đang mượn/i));

    expect(screen.getByText("Cập nhật trạng thái")).toBeInTheDocument();
});

test("change status select", async () => {
    const user = userEvent.setup();
    renderUI();

    await user.click(screen.getByText(/Đang mượn/i));

    const select = screen.getByRole("combobox");

    fireEvent.change(select, {
        target: { value: "RETURNED" }
    });

    expect(select.value).toBe("RETURNED");
});

test("update status success", async () => {
    BorrowChangeStatus.mockResolvedValueOnce({
        status: 200,
        data: { message: "OK" }
    });

    const user = userEvent.setup();
    renderUI();

    await user.click(screen.getByText(/Đang mượn/i));
    await user.click(screen.getByText("Xác nhận"));

    expect(await screen.findByText("OK")).toBeInTheDocument();
});

test("update status fail", async () => {
    BorrowChangeStatus.mockRejectedValueOnce(new Error("Server Error"));

    const user = userEvent.setup();
    renderUI();

    await user.click(screen.getByText(/Đang mượn/i));
    await user.click(screen.getByText("Xác nhận"));

    await waitFor(() => {
        expect(screen.getByText("Server không phản hồi")).toBeInTheDocument();
    });
});

test("update note success", async () => {
    BorrowChange.mockResolvedValueOnce({
        data: { message: "Update note success" }
    });

    const user = userEvent.setup();
    renderUI();

    await user.click(screen.getByLabelText("view-detail"));
    await user.click(screen.getByText("Save Note"));

    await waitFor(() => {
        expect(screen.getByText("Update note success")).toBeInTheDocument();
    });
});

test("update note fail", async () => {
    BorrowChange.mockRejectedValueOnce(new Error("Server Error"));

    const user = userEvent.setup();
    renderUI();

    await user.click(screen.getByLabelText("view-detail"));
    await user.click(screen.getByText("Save Note"));

    await waitFor(() => {
        expect(screen.getByText("Server Error")).toBeInTheDocument();
    });
});

test("close message modal", async () => {
    BorrowChangeStatus.mockResolvedValueOnce({
        status: 200,
        data: { message: "OK" }
    });

    const user = userEvent.setup();
    renderUI();

    await user.click(screen.getByText(/Đang mượn/i));
    await user.click(screen.getByText("Xác nhận"));

    expect(await screen.findByText("OK")).toBeInTheDocument();

    await user.click(screen.getAllByText("Close Modal")[0]);

    await waitFor(() => {
        expect(screen.queryByText("OK")).not.toBeInTheDocument();
    });
});