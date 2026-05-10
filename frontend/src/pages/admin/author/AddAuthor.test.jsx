import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import AddAuthor from "./AddAuthor";
import userEvent from "@testing-library/user-event";

const mockHandleChange = vi.fn();
const mockHandleSubmit = vi.fn();

const defaultProps = {
    authorData: {
        name: "Nguyễn Nhật Ánh",
        image: null,
        date_of_birth: "1955-05-07",
        date_of_death: "",
        biography: "Tiểu sử tác giả",
        description: "Mô tả tác giả"
    },
    handleChange: mockHandleChange,
    handleSubmit: mockHandleSubmit,
    errors: [],
    success: false,
    loading: false
};

const mockAuthorData = {
    name: "Nguyễn Nhật Ánh",
    image: null,
    date_of_birth: "1955-05-07",
    date_of_death: "",
    biography: "Tiểu sử tác giả",
    description: "Mô tả tác giả",
};

const handleChange = vi.fn();
const handleSubmit = vi.fn();

const renderUI = (props = {}) => {
    return render(
        <AddAuthor
            {...defaultProps}
            {...props}
        />
    );
};


test("render all fields", () => {
    renderUI();

    expect(
        screen.getByDisplayValue("Nguyễn Nhật Ánh")
    ).toBeInTheDocument();

    expect(
        screen.getByDisplayValue("1955-05-07")
    ).toBeInTheDocument();

    expect(
        screen.getByDisplayValue("Tiểu sử tác giả")
    ).toBeInTheDocument();

    expect(
        screen.getByDisplayValue("Mô tả tác giả")
    ).toBeInTheDocument();
});

test("change text input", () => {
    renderUI();

    const input = screen.getByPlaceholderText("Nguyễn Nhật Ánh");

    fireEvent.change(input, {
        target: {
            value: "Tô Hoài"
        }
    });

    expect(mockHandleChange).toHaveBeenCalled();
});

test("change file input", async () => {
    const user = userEvent.setup();

    render(
        <AddAuthor
            authorData={mockAuthorData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            errors={[]}
            success={false}
            loading={false}
        />
    );

    const file = new File(
        ["image"],
        "avatar.png",
        { type: "image/png" }
    );

    const input = screen.getByLabelText("Hình ảnh");

    await user.upload(input, file);

    expect(input.files[0]).toBe(file);
    expect(input.files).toHaveLength(1);
});


test("change biography textarea", () => {
    renderUI();

    const textarea = screen.getByPlaceholderText(
        "Nhập tiểu sử tác giả..."
    );

    fireEvent.change(textarea, {
        target: {
            value: "Tiểu sử mới"
        }
    });

    expect(mockHandleChange).toHaveBeenCalled();
});

test("change description textarea", () => {
    renderUI();

    const textarea = screen.getByPlaceholderText(
        "Nhập mô tả ngắn..."
    );

    fireEvent.change(textarea, {
        target: {
            value: "Mô tả mới"
        }
    });

    expect(mockHandleChange).toHaveBeenCalled();
});

test("render errors", () => {
    renderUI({
        errors: [
            "Tên không hợp lệ",
            "Thiếu hình ảnh"
        ]
    });

    expect(
        screen.getByText("Tên không hợp lệ")
    ).toBeInTheDocument();

    expect(
        screen.getByText("Thiếu hình ảnh")
    ).toBeInTheDocument();
});

test("render success message", () => {
    renderUI({
        success: true
    });

    expect(
        screen.getByText("Thêm tác giả thành công")
    ).toBeInTheDocument();
});

test("submit button click", () => {
    renderUI();

    const button = screen.getByRole("button", {
        name: /thêm tác giả/i
    });

    fireEvent.click(button);

    expect(mockHandleSubmit).toHaveBeenCalled();
});

test("render loading state", () => {
    renderUI({
        loading: true
    });

    expect(
        screen.getByText("Đang thêm...")
    ).toBeInTheDocument();

    expect(
        screen.getByRole("button")
    ).toBeDisabled();
});

test("render empty errors", () => {
    renderUI({
        errors: []
    });

    expect(
        screen.queryByText("Tên không hợp lệ")
    ).not.toBeInTheDocument();
});
