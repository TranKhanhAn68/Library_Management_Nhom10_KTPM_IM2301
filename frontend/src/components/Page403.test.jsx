import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React from "react";
import Page403 from "./Page403";

describe("Page403", () => {

    test("renders 403 page correctly", () => {
        render(<Page403 />);

        expect(screen.getByText("403")).toBeInTheDocument();

        expect(
            screen.getByText("Bạn không có quyền truy cập trang này.")
        ).toBeInTheDocument();
    });

    test("has correct home link and can click", () => {
        render(<Page403 />);

        const link = screen.getByRole("link", {
            name: /quay về trang chủ/i
        });

        expect(link).toHaveAttribute("href", "/");

        fireEvent.click(link);
    });

});