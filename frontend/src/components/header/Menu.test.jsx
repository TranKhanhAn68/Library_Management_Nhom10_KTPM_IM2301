import { render, screen, fireEvent } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import Menu from "./Menu";

// mock MenuHoverDropdown
vi.mock("../MenuHoverDropdown", () => ({
    default: ({ children }) => (
        <div data-testid="hover-dropdown">{children}</div>
    )
}));

// ===== DATA =====
const authors = [
    { id: 1, name: "Author A" },
    { id: 2, name: "Author B" }
];

const categories = [
    { id: 1, name: "Cat A" },
    { id: 2, name: "Cat B" }
];

// ===== DEFAULT PROPS =====
const defaultProps = {
    openMenuAuthorHover: false,
    setOpenMenuAuthorHover: vi.fn(),
    openMenuCategoryHover: false,
    setOpenMenuCategoryHover: vi.fn(),
    authors,
    categories
};

// ===== HELPER =====
const renderMenu = (props = {}) => {
    return render(
        <MemoryRouter>
            <Menu {...defaultProps} {...props} />
        </MemoryRouter>
    );
};

test("render menu basic", () => {
    renderMenu();

    expect(screen.getByText("Tác giả")).toBeInTheDocument();
    expect(screen.getByText("Thể loại")).toBeInTheDocument();
});

test("hover author triggers open", () => {
    const setOpen = vi.fn();

    renderMenu({ setOpenMenuAuthorHover: setOpen });

    const authorItem = screen.getByText("Tác giả");

    fireEvent.mouseEnter(authorItem);

    expect(setOpen).toHaveBeenCalledWith(true);

    fireEvent.mouseLeave(authorItem);

    expect(setOpen).toHaveBeenCalledWith(false);
});

test("show author dropdown when open", () => {
    renderMenu({ openMenuAuthorHover: true });

    expect(screen.getByTestId("hover-dropdown")).toBeInTheDocument();

    expect(screen.getByText("Author A")).toBeInTheDocument();
    expect(screen.getByText("Author B")).toBeInTheDocument();
});

test("hover category triggers open", () => {
    const setOpen = vi.fn();

    renderMenu({ setOpenMenuCategoryHover: setOpen });

    const categoryItem = screen.getByText("Thể loại");

    fireEvent.mouseEnter(categoryItem);

    expect(setOpen).toHaveBeenCalledWith(true);

    fireEvent.mouseLeave(categoryItem);

    expect(setOpen).toHaveBeenCalledWith(false);
});

test("hover category triggers open", () => {
    const setOpen = vi.fn();

    renderMenu({ setOpenMenuCategoryHover: setOpen });

    const categoryItem = screen.getByText("Thể loại");

    fireEvent.mouseEnter(categoryItem);

    expect(setOpen).toHaveBeenCalledWith(true);

    fireEvent.mouseLeave(categoryItem);

    expect(setOpen).toHaveBeenCalledWith(false);
});

test("hover category triggers open", () => {
    const setOpen = vi.fn();

    renderMenu({ setOpenMenuCategoryHover: setOpen });

    const categoryItem = screen.getByText("Thể loại");

    fireEvent.mouseEnter(categoryItem);

    expect(setOpen).toHaveBeenCalledWith(true);

    fireEvent.mouseLeave(categoryItem);

    expect(setOpen).toHaveBeenCalledWith(false);
});

test("category link has correct href", () => {
    renderMenu({ openMenuCategoryHover: true });

    const link = screen.getByText("Cat A").closest("a");

    expect(link).toHaveAttribute(
        "href",
        "/?category_id=1"
    );
});

test("category link has correct href", () => {
    renderMenu({ openMenuCategoryHover: true });

    const link = screen.getByText("Cat A").closest("a");

    expect(link).toHaveAttribute("href", "/?category_id=1");
});