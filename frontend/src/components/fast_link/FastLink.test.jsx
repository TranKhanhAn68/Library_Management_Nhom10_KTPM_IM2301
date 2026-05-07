import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import React from "react";
import FastLink from "./FastLink";
import { MemoryRouter } from "react-router-dom";

test("Render fast link title", () => {
    render(
        <MemoryRouter>
            <FastLink />
        </MemoryRouter>
    );

    expect(screen.getByText("Liên Kết Nhanh")).toBeInTheDocument();
});

test("Render all links", () => {
    render(
        <MemoryRouter>
            <FastLink />
        </MemoryRouter>
    );

    expect(screen.getByText("Trang chủ")).toBeInTheDocument();
    expect(screen.getByText("Lịch sử mượn")).toBeInTheDocument();
    expect(screen.getByText("Danh sách đặt trước")).toBeInTheDocument();
    expect(screen.getByText("Quy tắc mượn sách tại thư viện")).toBeInTheDocument();
    expect(screen.getByText("Danh sách tác giả")).toBeInTheDocument();
});

test("Links have correct href", () => {
    render(
        <MemoryRouter>
            <FastLink />
        </MemoryRouter>
    );

    expect(screen.getByText("Trang chủ").closest("a"))
        .toHaveAttribute("href", "/");

    expect(screen.getByText("Lịch sử mượn").closest("a"))
        .toHaveAttribute("href", "/current_user/borrowing-history");

    expect(screen.getByText("Danh sách đặt trước").closest("a"))
        .toHaveAttribute("href", "/current_user/orders");

    expect(screen.getByText("Quy tắc mượn sách tại thư viện").closest("a"))
        .toHaveAttribute("href", "/library_rules");

    expect(screen.getByText("Danh sách tác giả").closest("a"))
        .toHaveAttribute("href", "/authors");
});