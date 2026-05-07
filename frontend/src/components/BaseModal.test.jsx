import { render, screen, fireEvent } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import React from "react";
import BaseModal from "./BaseModal";

// ===== 1. render children =====
test("render children when open", () => {
    render(
        <BaseModal open={true} close={vi.fn()}>
            <div>Modal Content</div>
        </BaseModal>
    );

    expect(screen.getByText("Modal Content")).toBeInTheDocument();
});

test("modal is hidden when open = false", () => {
    render(
        <BaseModal open={false} close={vi.fn()}>
            <div>Modal Content</div>
        </BaseModal>
    );

    const overlay = screen.getByText("Modal Content").parentElement.parentElement;

    expect(overlay).toHaveClass("invisible");
});

test("click overlay calls close", () => {
    const mockClose = vi.fn();

    render(
        <BaseModal open={true} close={mockClose}>
            <div>Modal Content</div>
        </BaseModal>
    );

    const overlay = screen.getByText("Modal Content").parentElement.parentElement;

    fireEvent.click(overlay);

    expect(mockClose).toHaveBeenCalled();
});