import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import React from "react";

vi.mock("../../../components/BaseModal", () => ({
    default: ({ children, open, close }) =>
        open ? (
            <div>
                {children}
                <button onClick={close}>Close Modal</button>
            </div>
        ) : null
}));

import DetailTransaction from "./DetailTransaction";

const mockProps = {
    selected: {
        updated_at: "2025-01-01T10:00:00Z",
        borrowing_book_date: "2025-01-01",
        due_date: "2025-01-10",
        returning_book_date: "2025-01-12",
        borrowing_quantity: 2,
        price: 100000,
        status: "BORROWING",
        note: "Ghi chú cũ",

        fine: {
            late_dates: 2,
            setting: {
                borrowing_days: 7,
                borrowing_fee: 10000,
                borrowing_overdue_fine: 5000
            }
        },

        user: {
            first_name: "A",
            last_name: "B",
            email: "a@gmail.com",
            image: "img.jpg"
        },

        book: {
            name: "Harry Potter",
            image: "book.jpg"
        }
    },

    openModal: true,
    handleClose: vi.fn(),

    editNote: false,
    setEditNote: vi.fn(),

    note: "Ghi chú cũ",
    setNote: vi.fn(),

    handleUpdateNote: vi.fn()
};

test("render detail transaction", () => {
    render(<DetailTransaction {...mockProps} />);

    expect(
        screen.getByText("Chi tiết giao dịch")
    ).toBeInTheDocument();

    expect(
        screen.getByText("Harry Potter")
    ).toBeInTheDocument();

    expect(
        screen.getByText("A B")
    ).toBeInTheDocument();
});

test("close modal", async () => {
    render(<DetailTransaction {...mockProps} />);

    fireEvent.click(screen.getByText("Close Modal"));

    expect(mockProps.handleClose).toHaveBeenCalled();
});

test("render note text", () => {
    render(<DetailTransaction {...mockProps} />);

    expect(
        screen.getByText("Ghi chú cũ")
    ).toBeInTheDocument();
});

test("render no note", () => {
    render(
        <DetailTransaction
            {...mockProps}
            note=""
        />
    );

    expect(
        screen.getByText("Không có ghi chú")
    ).toBeInTheDocument();
});

test("open edit note", () => {
    render(<DetailTransaction {...mockProps} />);

    fireEvent.click(screen.getByText("Chỉnh sửa"));

    expect(mockProps.setEditNote).toHaveBeenCalledWith(true);
});

test("render textarea when edit", () => {
    render(
        <DetailTransaction
            {...mockProps}
            editNote={true}
        />
    );

    expect(
        screen.getByPlaceholderText("Nhập ghi chú...")
    ).toBeInTheDocument();
});

test("change textarea", () => {
    render(
        <DetailTransaction
            {...mockProps}
            editNote={true}
        />
    );

    const textarea = screen.getByPlaceholderText("Nhập ghi chú...");

    fireEvent.change(textarea, {
        target: {
            value: "Note mới"
        }
    });

    expect(mockProps.setNote).toHaveBeenCalled();
});

test("save note", () => {
    render(
        <DetailTransaction
            {...mockProps}
            editNote={true}
        />
    );

    fireEvent.click(screen.getByText("Lưu"));

    expect(
        mockProps.handleUpdateNote
    ).toHaveBeenCalled();
});

test("cancel edit note", () => {
    render(
        <DetailTransaction
            {...mockProps}
            editNote={true}
        />
    );

    fireEvent.click(screen.getByText("Hủy bỏ"));

    expect(
        mockProps.setEditNote
    ).toHaveBeenCalledWith(false);
});

test("useEffect setNote", () => {
    render(<DetailTransaction {...mockProps} />);

    expect(mockProps.setNote)
        .toHaveBeenCalledWith("Ghi chú cũ");
});

test("render fallback date", () => {
    render(
        <DetailTransaction
            {...mockProps}
            selected={{
                ...mockProps.selected,
                borrowing_book_date: null,
                due_date: null,
                returning_book_date: null
            }}
        />
    );

    expect(screen.getAllByText("—").length)
        .toBeGreaterThan(0);

    expect(
        screen.getByText("Chưa trả")
    ).toBeInTheDocument();
});