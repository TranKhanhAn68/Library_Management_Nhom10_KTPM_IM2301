import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React from "react";
import Loading from "./Loading";

describe("Loading component", () => {

    // ================= NOT SHOW =================
    test("does not render when loading = false", () => {
        render(<Loading loading={false} />);

        expect(screen.queryByText("Đang tải dữ liệu...")).not.toBeInTheDocument();
    });

    // ================= SHOW LOADING =================
    test("renders loading UI when loading = true", () => {
        render(<Loading loading={true} />);

        // text
        expect(screen.getByText("Đang tải dữ liệu...")).toBeInTheDocument();

        // spinner (check by class)
        const spinner = document.querySelector(".tw-animate-spin");
        expect(spinner).toBeInTheDocument();

        // overlay
        const overlay = spinner.closest(".tw-absolute");
        expect(overlay).toHaveClass("tw-absolute");
    });

});