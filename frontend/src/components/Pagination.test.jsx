import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import Pagination from "./Pagination";

describe("Pagination", () => {
    const goPage = vi.fn();

    const defaultProps = {
        currentPage: 2,
        totalPages: 5,
        item: [],
        goPage
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ================= RENDER =================
    it("renders pagination buttons", () => {
        render(<Pagination {...defaultProps} />);

        expect(screen.getByText("Trang đầu")).toBeInTheDocument();
        expect(screen.getByText("Prev")).toBeInTheDocument();
        expect(screen.getByText("Next")).toBeInTheDocument();
        expect(screen.getByText("Trang cuối")).toBeInTheDocument();
    });

    // ================= CLICK ACTIONS =================
    it("calls goPage when clicking first page", () => {
        render(<Pagination {...defaultProps} />);

        fireEvent.click(screen.getByText("Trang đầu"));

        expect(goPage).toHaveBeenCalledWith(1);
    });

    it("calls goPage when clicking Prev", () => {
        render(<Pagination {...defaultProps} />);

        fireEvent.click(screen.getByText("Prev"));

        expect(goPage).toHaveBeenCalledWith(1); // 2 - 1
    });

    it("calls goPage when clicking Next", () => {
        render(<Pagination {...defaultProps} />);

        fireEvent.click(screen.getByText("Next"));

        expect(goPage).toHaveBeenCalledWith(3); // 2 + 1
    });

    it("calls goPage when clicking last page", () => {
        render(<Pagination {...defaultProps} />);

        fireEvent.click(screen.getByText("Trang cuối"));

        expect(goPage).toHaveBeenCalledWith(5);
    });

    // ================= DISABLED =================
    it("disables Prev button on first page", () => {
        render(<Pagination {...defaultProps} currentPage={1} />);

        expect(screen.getByText("Prev")).toBeDisabled();
    });

    it("disables Next button on last page", () => {
        render(<Pagination {...defaultProps} currentPage={5} />);

        expect(screen.getByText("Next")).toBeDisabled();
    });
});