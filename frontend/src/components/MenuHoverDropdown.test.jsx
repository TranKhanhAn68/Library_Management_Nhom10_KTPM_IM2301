import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React from "react";
import MenuHoverDropdown from "./MenuHoverDropdown";

describe("MenuHoverDropdown", () => {

    // ================= OPEN =================
    it("renders children when open = true", () => {
        render(
            <MenuHoverDropdown open={true}>
                <div>Menu Item</div>
            </MenuHoverDropdown>
        );

        expect(screen.getByText("Menu Item")).toBeInTheDocument();

        const dropdown = screen.getByText("Menu Item").parentElement;

        expect(dropdown).toHaveClass("dropdown-menu");
        expect(dropdown).toHaveClass("show");
        expect(dropdown).toHaveClass("tw-bg-gray-800");
    });

    // ================= CLOSE =================
    test("does not render when open = false", () => {
        render(
            <MenuHoverDropdown open={false}>
                <div>Menu Item</div>
            </MenuHoverDropdown>
        );

        expect(screen.queryByText("Menu Item")).not.toBeInTheDocument();
    });

});