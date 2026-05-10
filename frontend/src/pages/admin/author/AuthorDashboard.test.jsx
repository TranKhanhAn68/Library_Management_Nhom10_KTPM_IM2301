import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthorDashboard from "./AuthorDashboard";
import { AuthContent } from "../../../utils/AuthContext";
import {
    AuthorListAPI,
    DeleteAuthor,
    PostAuthor,
} from "../../../services/AuthorAPI";

vi.mock("../../../services/AuthorAPI", () => ({
    AuthorListAPI: vi.fn(),
    DeleteAuthor: vi.fn(),
    PostAuthor: vi.fn(),
}));

vi.mock("../../../components/Loading", () => ({
    default: () => <div>Loading...</div>,
}));

vi.mock("./AddAuthor", () => ({
    default: ({
        authorData,
        handleChange,
        handleSubmit,
        errors,
        success,
        loading,
    }) => (
        <form onSubmit={handleSubmit}>
            <input
                placeholder="name"
                name="name"
                value={authorData.name}
                onChange={handleChange}
            />

            <input
                type="date"
                name="date_of_birth"
                value={authorData.date_of_birth}
                onChange={handleChange}
            />

            <input
                type="date"
                name="date_of_death"
                value={authorData.date_of_death}
                onChange={handleChange}
            />

            <textarea
                placeholder="biography"
                name="biography"
                value={authorData.biography}
                onChange={handleChange}
            />

            <textarea
                placeholder="description"
                name="description"
                value={authorData.description}
                onChange={handleChange}
            />

            <input
                type="file"
                name="image"
                onChange={handleChange}
            />

            <button type="submit">
                {loading ? "Loading..." : "Submit"}
            </button>

            {success && <p>Success</p>}

            {errors.map((err, index) => (
                <p key={index}>{err}</p>
            ))}
        </form>
    ),
}));

const mockAuthors = [
    {
        id: 1,
        name: "Nguyen Du",
        date_of_birth: "1765-01-03",
        date_of_death: "1820-09-16",
        description: "Tac gia Truyen Kieu",
        image: "test.jpg",
    },
];

beforeEach(() => {
    vi.clearAllMocks();

    AuthorListAPI.mockReturnValue([mockAuthors]);

    window.alert = vi.fn();
});

const renderUI = () => {
    return render(
        <AuthContent.Provider value={{ token: "fake-token" }}>
            <AuthorDashboard />
        </AuthContent.Provider>
    );
};

test("render authors list", () => {
    renderUI();

    expect(screen.getByText("Quản lý tác giả")).toBeInTheDocument();
    expect(screen.getByText("Nguyen Du")).toBeInTheDocument();
    expect(screen.getByText("Tac gia Truyen Kieu")).toBeInTheDocument();
});

test("show validation errors when submit empty form", async () => {
    renderUI();

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
        expect(
            screen.getByText("Tên tác giả không được để trống")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Vui lòng chọn ngày sinh")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Tiểu sử không được để trống")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Mô tả không được để trống")
        ).toBeInTheDocument();
    });
});

test("submit author successfully", async () => {
    PostAuthor.mockResolvedValue({
        data: {
            id: 1,
        },
    });

    renderUI();

    fireEvent.change(screen.getByPlaceholderText("name"), {
        target: {
            value: "New Author",
        },
    });

    const dobInput = document.querySelector(
        'input[name="date_of_birth"]'
    );

    fireEvent.change(dobInput, {
        target: {
            value: "2020-01-01",
        },
    });

    fireEvent.change(screen.getByPlaceholderText("biography"), {
        target: {
            value: "Biography test",
        },
    });

    fireEvent.change(screen.getByPlaceholderText("description"), {
        target: {
            value: "Description test",
        },
    });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
        expect(PostAuthor).toHaveBeenCalled();
        expect(screen.getByText("Success")).toBeInTheDocument();
    });
});

test("show error when post author failed", async () => {
    PostAuthor.mockRejectedValue("Create failed");

    renderUI();

    fireEvent.change(screen.getByPlaceholderText("name"), {
        target: {
            value: "New Author",
        },
    });

    const dobInput = document.querySelector(
        'input[name="date_of_birth"]'
    );

    fireEvent.change(dobInput, {
        target: {
            value: "2000-01-01",
        },
    });

    fireEvent.change(screen.getByPlaceholderText("biography"), {
        target: {
            value: "Biography test",
        },
    });

    fireEvent.change(screen.getByPlaceholderText("description"), {
        target: {
            value: "Description test",
        },
    });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
        expect(PostAuthor).toHaveBeenCalled();
        expect(screen.getByText("Create failed")).toBeInTheDocument();
    });
});


test("delete author successfully", async () => {
    DeleteAuthor.mockResolvedValue({});

    renderUI();

    const deleteBtn = screen.getByRole("button", {
        name: "",
    });

    fireEvent.click(deleteBtn);

    await waitFor(() => {
        expect(DeleteAuthor).toHaveBeenCalledWith(
            "fake-token",
            1
        );

        expect(window.alert).toHaveBeenCalledWith(
            "Xóa thành công!"
        );
    });
});

test("show alert when delete failed", async () => {
    DeleteAuthor.mockRejectedValue("Delete failed");

    renderUI();

    const deleteBtn = screen.getByRole("button", {
        name: "",
    });

    fireEvent.click(deleteBtn);

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
            "Delete failed"
        );
    });
});

test("validate date_of_death smaller than date_of_birth", async () => {
    renderUI();

    fireEvent.change(screen.getByPlaceholderText("name"), {
        target: {
            value: "Author",
        },
    });

    const dobInput = document.querySelector(
        'input[name="date_of_birth"]'
    );

    const dodInput = document.querySelector(
        'input[name="date_of_death"]'
    );

    fireEvent.change(dobInput, {
        target: {
            value: "2020-01-01",
        },
    });

    fireEvent.change(dodInput, {
        target: {
            value: "2010-01-01",
        },
    });

    fireEvent.change(screen.getByPlaceholderText("biography"), {
        target: {
            value: "Bio",
        },
    });

    fireEvent.change(screen.getByPlaceholderText("description"), {
        target: {
            value: "Desc",
        },
    });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
        expect(
            screen.getByText("Ngày mất phải lớn hơn ngày sinh")
        ).toBeInTheDocument();
    });
});

vi.mock("../../../components/Loading", () => ({
    default: () => <div>Loading...</div>,
}));

test("render authors list", () => {
    renderUI();

    expect(screen.getByText("Quản lý tác giả")).toBeInTheDocument();
    expect(screen.getByText("Nguyen Du")).toBeInTheDocument();
    expect(screen.getByText("Tac gia Truyen Kieu")).toBeInTheDocument();
});

test("show validation errors when submit empty form", async () => {
    renderUI();

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
        expect(
            screen.getByText("Tên tác giả không được để trống")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Vui lòng chọn ngày sinh")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Tiểu sử không được để trống")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Mô tả không được để trống")
        ).toBeInTheDocument();
    });
});

test("submit author successfully", async () => {
    PostAuthor.mockResolvedValue({
        data: {
            id: 1,
        },
    });

    renderUI();

    fireEvent.change(screen.getByPlaceholderText("name"), {
        target: {
            value: "New Author",
        },
    });

    const dobInput = document.querySelector(
        'input[name="date_of_birth"]'
    );

    fireEvent.change(dobInput, {
        target: {
            value: "2020-01-01",
        },
    });

    fireEvent.change(screen.getByPlaceholderText("biography"), {
        target: {
            value: "Biography test",
        },
    });

    fireEvent.change(screen.getByPlaceholderText("description"), {
        target: {
            value: "Description test",
        },
    });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
        expect(PostAuthor).toHaveBeenCalled();
        expect(screen.getByText("Success")).toBeInTheDocument();
    });
});

test("show error when post author failed", async () => {
    PostAuthor.mockRejectedValue("Create failed");

    renderUI();

    fireEvent.change(screen.getByPlaceholderText("name"), {
        target: {
            value: "New Author",
        },
    });

    const dobInput = document.querySelector(
        'input[name="date_of_birth"]'
    );

    fireEvent.change(dobInput, {
        target: {
            value: "2000-01-01",
        },
    });

    fireEvent.change(screen.getByPlaceholderText("biography"), {
        target: {
            value: "Biography test",
        },
    });

    fireEvent.change(screen.getByPlaceholderText("description"), {
        target: {
            value: "Description test",
        },
    });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
        expect(PostAuthor).toHaveBeenCalled();
        expect(screen.getByText("Create failed")).toBeInTheDocument();
    });
});


test("delete author successfully", async () => {
    DeleteAuthor.mockResolvedValue({});

    renderUI();

    const deleteBtn = screen.getByRole("button", {
        name: "",
    });

    fireEvent.click(deleteBtn);

    await waitFor(() => {
        expect(DeleteAuthor).toHaveBeenCalledWith(
            "fake-token",
            1
        );

        expect(window.alert).toHaveBeenCalledWith(
            "Xóa thành công!"
        );
    });
});

test("show alert when delete failed", async () => {
    DeleteAuthor.mockRejectedValue("Delete failed");

    renderUI();

    const deleteBtn = screen.getByRole("button", {
        name: "",
    });

    fireEvent.click(deleteBtn);

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
            "Delete failed"
        );
    });
});

test("validate date_of_death smaller than date_of_birth", async () => {
    renderUI();

    fireEvent.change(screen.getByPlaceholderText("name"), {
        target: {
            value: "Author",
        },
    });

    const dobInput = document.querySelector(
        'input[name="date_of_birth"]'
    );

    const dodInput = document.querySelector(
        'input[name="date_of_death"]'
    );

    fireEvent.change(dobInput, {
        target: {
            value: "2020-01-01",
        },
    });

    fireEvent.change(dodInput, {
        target: {
            value: "2010-01-01",
        },
    });

    fireEvent.change(screen.getByPlaceholderText("biography"), {
        target: {
            value: "Bio",
        },
    });

    fireEvent.change(screen.getByPlaceholderText("description"), {
        target: {
            value: "Desc",
        },
    });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
        expect(
            screen.getByText("Ngày mất phải lớn hơn ngày sinh")
        ).toBeInTheDocument();
    });
});

test("submit author with image", async () => {
    PostAuthor.mockResolvedValue({
        data: {
            id: 1,
        },
    });

    renderUI();

    fireEvent.change(screen.getByPlaceholderText("name"), {
        target: {
            value: "Author Image",
        },
    });

    const dobInput = document.querySelector(
        'input[name="date_of_birth"]'
    );

    fireEvent.change(dobInput, {
        target: {
            value: "2000-01-01",
        },
    });

    fireEvent.change(screen.getByPlaceholderText("biography"), {
        target: {
            value: "Biography",
        },
    });

    fireEvent.change(screen.getByPlaceholderText("description"), {
        target: {
            value: "Description",
        },
    });

    const file = new File(
        ["dummy image"],
        "author.png",
        { type: "image/png" }
    );

    const imageInput = document.querySelector(
        'input[name="image"]'
    );

    fireEvent.change(imageInput, {
        target: {
            files: [file],
        },
    });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
        expect(PostAuthor).toHaveBeenCalled();
    });
});