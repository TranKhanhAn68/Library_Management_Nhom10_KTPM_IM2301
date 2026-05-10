import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React from "react";
import Page404 from "./Page404";

describe("Page404", () => {
    it("renders UI correctly", () => {
        render(<Page404 />);

        expect(screen.getByText("404")).toBeInTheDocument();
        expect(
            screen.getByText("Không tìm thấy! Vui lòng quay lại")
        ).toBeInTheDocument();
    });

    it("has correct home link and can click", () => {
        render(<Page404 />);

        const link = screen.getByRole("link", {
            name: /quay về trang chủ/i
        });

        expect(link).toHaveAttribute("href", "/");

        fireEvent.click(link);
    });
});