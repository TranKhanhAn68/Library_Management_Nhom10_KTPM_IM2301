import { render, screen, fireEvent, waitFor, within, findByLabelText, act } from "@testing-library/react";
import { vi } from "vitest";
import React from "react";

// MOCK FIRST
vi.mock("../../../services/ReservationAPI", () => ({
    ReservationListAPI: vi.fn(),
    OrderChangeStatus: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
    Link: ({ children }) => <a>{children}</a>,
    useNavigate: () => vi.fn(),
}));

import Order from "./Order";
import { ReservationListAPI, OrderChangeStatus } from "../../../services/ReservationAPI";
import { AuthContent } from "../../../utils/AuthContext";

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
        <input
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    )
}));

// wrapper
const renderUI = () => {
    return render(
        <AuthContent.Provider value={{ token: "fake-token" }}>
            <Order />
        </AuthContent.Provider>
    );
};

beforeEach(() => {
    ReservationListAPI.mockReturnValue({
        results: [
            {
                id: 1,
                status: "WAITING",
                created_at: "2025-01-01T10:00:00Z",
                updated_at: "2025-01-01T10:00:00Z",
                user: {
                    first_name: "A",
                    last_name: "B",
                    email: "a@gmail.com",
                    image: "img.jpg",
                },
                book: {
                    name: "Book A",
                    image: "book.jpg",
                },
            },
        ],
    });
});

test("render order list", () => {
    renderUI();

    expect(screen.getByText("Order Management")).toBeInTheDocument();
    expect(screen.getByText("Book A")).toBeInTheDocument();
    expect(screen.getByText("Chờ xác nhận")).toBeInTheDocument(); // label từ config
});

test("open detail modal", async () => {
    renderUI();

    fireEvent.click(screen.getByText("View"));

    const modal = await screen.findByTestId("order-modal");

    expect(within(modal).getByText("Chi tiết đơn")).toBeInTheDocument();
    expect(within(modal).getByText("A B")).toBeInTheDocument();
    expect(within(modal).getByText("Book A")).toBeInTheDocument();
});

test("open status modal", async () => {
    renderUI();

    fireEvent.click(screen.getByText("Chờ xác nhận"));

    expect(await screen.findByText("Cập nhật trạng thái")).toBeInTheDocument();
});

test("update status success", async () => {
    OrderChangeStatus.mockResolvedValue({
        status: 200,
        data: { message: "OK" },
    });

    renderUI();

    fireEvent.click(screen.getByText("Chờ xác nhận"));

    const btn = await screen.findByText("Xác nhận");
    fireEvent.click(btn);

    await waitFor(() => {
        expect(OrderChangeStatus).toHaveBeenCalledWith(
            expect.any(String),
            1,
            "fake-token"
        );
    });
});

test("update status fail", async () => {
    OrderChangeStatus.mockRejectedValueOnce(
        new Error("Server Error")
    );

    renderUI();

    fireEvent.click(screen.getByText("Chờ xác nhận"));

    const btn = await screen.findByText("Xác nhận");

    fireEvent.click(btn);

    await waitFor(() => {
        expect(
            screen.getByText("Server không phản hồi")
        ).toBeInTheDocument();
    });
});

test("close detail modal", async () => {
    renderUI();

    fireEvent.click(screen.getByText("View"));

    expect(
        await screen.findByText("Chi tiết đơn")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Đóng"));

    await waitFor(() => {
        expect(
            screen.queryByText("Chi tiết đơn")
        ).not.toBeInTheDocument();
    });
});

test("change search input", () => {
    renderUI();

    const userInput = screen.getByPlaceholderText("Tên người mượn");

    fireEvent.change(userInput, {
        target: { value: "Nguyen Van A" }
    });

    expect(userInput.value).toBe("Nguyen Van A");
});

test("change reservation status", async () => {
    renderUI();

    fireEvent.click(screen.getByText("Chờ xác nhận"));

    const select = await screen.findByRole("combobox");

    fireEvent.change(select, {
        target: { value: "CONFIRMED" }
    });

    expect(select.value).toBe("CONFIRMED");
});

test("close message modal", async () => {
    OrderChangeStatus.mockResolvedValue({
        status: 200,
        data: { message: "OK" },
    });

    renderUI();

    fireEvent.click(screen.getByText("Chờ xác nhận"));

    const btn = await screen.findByText("Xác nhận");

    fireEvent.click(btn);

    expect(await screen.findByText("OK")).toBeInTheDocument();

    fireEvent.click(screen.getAllByText("Close Modal")[0]);

    await waitFor(() => {
        expect(
            screen.queryByText("OK")
        ).not.toBeInTheDocument();
    });
});

test("close message modal", async () => {
    OrderChangeStatus.mockResolvedValue({
        status: 200,
        data: { message: "OK" },
    });

    renderUI();

    fireEvent.click(screen.getByText("Chờ xác nhận"));

    const btn = await screen.findByText("Xác nhận");

    fireEvent.click(btn);

    expect(await screen.findByText("OK")).toBeInTheDocument();

    fireEvent.click(screen.getAllByText("Close Modal")[0]);

    await waitFor(() => {
        expect(
            screen.queryByText("OK")
        ).not.toBeInTheDocument();
    });
});

import userEvent from "@testing-library/user-event";

test("handle search button", async () => {
    const user = userEvent.setup();

    renderUI();

    const inputs = screen.getAllByRole("textbox");

    await user.type(inputs[0], "Nguyen Van A");
    await user.type(inputs[1], "Harry Potter");

    await user.click(screen.getByText("Tìm kiếm"));

    expect(inputs[0]).toHaveValue("Nguyen Van A");
    expect(inputs[1]).toHaveValue("Harry Potter");

    expect(ReservationListAPI).toHaveBeenCalled();
});

test("update status non 2xx", async () => {
    OrderChangeStatus.mockResolvedValueOnce({
        status: 400,
        data: {
            message: "Lỗi cập nhật"
        }
    });

    const user = userEvent.setup();

    renderUI();

    await user.click(screen.getByText("Chờ xác nhận"));

    await user.click(screen.getByText("Xác nhận"));

    await waitFor(() => {
        expect(
            screen.getByText("Lỗi cập nhật")
        ).toBeInTheDocument();
    });

    expect(
        document.querySelector(".fa-circle-xmark")
    ).toBeInTheDocument();
});

test("close status modal with cancel button", async () => {
    const user = userEvent.setup();

    renderUI();

    await user.click(screen.getByText("Chờ xác nhận"));

    expect(
        screen.getByText("Cập nhật trạng thái")
    ).toBeInTheDocument();

    await user.click(screen.getByText("Hủy"));

    await waitFor(() => {
        expect(
            screen.queryByText("Cập nhật trạng thái")
        ).not.toBeInTheDocument();
    });
});

