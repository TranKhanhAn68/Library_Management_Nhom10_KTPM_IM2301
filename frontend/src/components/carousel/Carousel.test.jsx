import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import React from "react";

import Carousel from "./Carousel";

// mock image import
vi.mock("../../assets/logo.png", () => ({
    default: "test-logo.png"
}));

test("should render carousel", () => {
    render(<Carousel />);

    // container
    const carousel = document.querySelector("#demo");
    expect(carousel).toBeInTheDocument();
});

test("should render 3 images", () => {
    render(<Carousel />);

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(3);
});

test("Render arousel-indicators", () => {
    render(<Carousel />);

    const buttons = document.querySelectorAll('[data-bs-slide-to]');
    expect(buttons).toHaveLength(3);
});

test("Render navigation buttons", () => {
    render(<Carousel />);

    const prevBtn = document.querySelector(".carousel-control-prev");
    const nextBtn = document.querySelector(".carousel-control-next");

    expect(prevBtn).toBeInTheDocument();
    expect(nextBtn).toBeInTheDocument();
});