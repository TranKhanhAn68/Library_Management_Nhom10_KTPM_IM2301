import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import StatusSelect from "./StatusSelect";

// mock config
vi.mock("../config", () => ({
    STATUS_CONFIG: {
        ACTIVE: { value: "active", label: "Hoạt động" },
        INACTIVE: { value: "inactive", label: "Không hoạt động" }
    }
}));

describe("StatusSelect", () => {
    it("renders default option and config options", () => {
        render(<StatusSelect value="" onChange={() => { }} />);

        expect(screen.getByText("Tất cả")).toBeInTheDocument();
        expect(screen.getByText("Hoạt động")).toBeInTheDocument();
        expect(screen.getByText("Không hoạt động")).toBeInTheDocument();
    });

    it("calls onChange when selecting option", () => {
        const onChange = vi.fn();

        render(<StatusSelect value="" onChange={onChange} />);

        fireEvent.change(screen.getByRole("combobox"), {
            target: { value: "active" }
        });

        expect(onChange).toHaveBeenCalled();
    });

    it("shows selected value", () => {
        render(
            <StatusSelect
                value="inactive"
                onChange={() => { }}
            />
        );

        const select = screen.getByRole("combobox");
        expect(select.value).toBe("inactive");
    });
});