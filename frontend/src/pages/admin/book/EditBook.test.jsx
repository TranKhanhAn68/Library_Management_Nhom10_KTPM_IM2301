import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { vi } from "vitest"
import EditBook from "./EditBook"

// ===== MOCK CONTEXT =====
const mockContext = React.createContext()
const mockNavigate = vi.fn()
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")

    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: "1" })
    }
})

vi.mock("../../../utils/AuthContext", async () => {
    const React = await import("react")

    return {
        AuthContent: React.createContext()
    }
})

// ===== MOCK API =====
vi.mock("../../../services/BookAPI", () => ({
    BookIDAPI: vi.fn(),
    UpdateBook: vi.fn()
}))

vi.mock("../../../services/AuthorAPI", () => ({
    AuthorListAPI: vi.fn()
}))

vi.mock("../../../services/PublisherAPI", () => ({
    PublisherListAPI: vi.fn()
}))

vi.mock("../../../services/CategoryAPI", () => ({
    CategoryListAPI: vi.fn()
}))

// ===== MOCK COMPONENT =====
vi.mock("../../../components/Loading", () => ({
    default: () => <div>Loading...</div>
}))

vi.mock("../../../components/BaseModal", () => ({
    default: ({ open, children, close }) =>
        open ? (
            <div data-testid="modal">
                {children}

                <button onClick={close}>
                    Close
                </button>
            </div>
        ) : null
}))

// ===== MOCK UTILS =====
vi.mock("../../../utils/GetError", () => ({
    getError: vi.fn(() => "Error")
}))

// ===== IMPORT =====
import { AuthContent } from "../../../utils/AuthContext"
import { BookIDAPI, UpdateBook } from "../../../services/BookAPI"
import { AuthorListAPI } from "../../../services/AuthorAPI"
import { PublisherListAPI } from "../../../services/PublisherAPI"
import { CategoryListAPI } from "../../../services/CategoryAPI"


const renderComponent = () => {
    return render(
        <AuthContent.Provider value={{ token: "fake-token" }}>
            <MemoryRouter initialEntries={["/dashboard/books/edit/1"]}>
                <Routes>
                    <Route
                        path="/dashboard/books/edit/:id"
                        element={<EditBook />}
                    />
                </Routes>
            </MemoryRouter>
        </AuthContent.Provider>
    )
}

beforeEach(() => {

    BookIDAPI.mockReturnValue([
        {
            id: 1,
            name: "Book A",
            description: "Description A",
            image: "test.jpg",
            total_quantity: 10,
            book_id: "B001",
            active: true,
            category: { id: 1 },
            author: { id: 1 },
            publisher: { id: 1 }
        }
    ])

    AuthorListAPI.mockReturnValue([
        [
            { id: 1, name: "Author A" }
        ]
    ])

    PublisherListAPI.mockReturnValue([
        [
            { id: 1, name: "Publisher A" }
        ]
    ])

    CategoryListAPI.mockReturnValue([
        [
            { id: 1, name: "Category A" }
        ]
    ])
})

afterEach(() => {
    vi.clearAllMocks()
})

test("render data book", async () => {

    renderComponent()

    expect(
        await screen.findByDisplayValue("Book A")
    ).toBeInTheDocument()

    expect(
        screen.getByDisplayValue("Description A")
    ).toBeInTheDocument()

    expect(
        screen.getByDisplayValue("B001")
    ).toBeInTheDocument()

    expect(
        screen.getByDisplayValue("10")
    ).toBeInTheDocument()
})

test("submit form thành công", async () => {

    const user = userEvent.setup()

    UpdateBook.mockResolvedValue({
        message: "Cập nhật thành công"
    })

    renderComponent()

    const submitBtn = await screen.findByRole("button", {
        name: /lưu/i
    })

    await user.click(submitBtn)

    await waitFor(() => {
        expect(UpdateBook).toHaveBeenCalledWith(
            "fake-token",
            "1",
            expect.any(FormData)
        )
    })

    expect(
        screen.getByTestId("modal")
    ).toBeInTheDocument()

    expect(
        screen.getByText("Cập nhật thành công")
    ).toBeInTheDocument()
})

test("submit form thất bại", async () => {

    const user = userEvent.setup()

    UpdateBook.mockRejectedValue(new Error("Failed"))

    renderComponent()

    const submitBtn = await screen.findByRole("button", {
        name: /lưu/i
    })

    await user.click(submitBtn)

    await waitFor(() => {
        expect(
            screen.getByTestId("modal")
        ).toBeInTheDocument()
    })

    expect(
        screen.getByText("Error")
    ).toBeInTheDocument()
})

test("change checkbox active", async () => {

    const user = userEvent.setup()

    renderComponent()

    const checkbox = await screen.findByRole("checkbox")

    expect(checkbox).toBeChecked()

    await user.click(checkbox)

    expect(checkbox).not.toBeChecked()
})



test("change select", async () => {

    const user = userEvent.setup()

    renderComponent()

    const categorySelect = screen.getByDisplayValue(
        "Category A"
    )
    const publisherSelect = screen.getByDisplayValue(
        "Publisher A"
    )
    const authorSelect = screen.getByDisplayValue(
        "Author A"
    )

    await user.selectOptions(categorySelect, "1")
    await user.selectOptions(publisherSelect, "1")
    await user.selectOptions(authorSelect, "1")

    expect(categorySelect.value).toBe("1")
    expect(publisherSelect.value).toBe("1")
    expect(authorSelect.value).toBe("1")

})

test("navigate khi click hủy", async () => {

    const user = userEvent.setup()

    renderComponent()

    const cancelBtn = screen.getByRole("button", {
        name: /hủy/i
    })

    await user.click(cancelBtn)

    expect(mockNavigate).toHaveBeenCalledWith(
        "/dashboard/books"
    )
})

test("close modal và navigate success", async () => {

    const user = userEvent.setup()

    UpdateBook.mockResolvedValue({
        message: "Success"
    })

    renderComponent()

    const submitBtn = screen.getByRole("button", {
        name: /lưu/i
    })

    await user.click(submitBtn)

    await screen.findByText("Success")

    const closeBtn = screen.getByText("Close")

    await user.click(closeBtn)

    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
            "/dashboard/books"
        )
    })
})
test("loading render", () => {

    UpdateBook.mockImplementation(() => {
        throw new Error()
    })

    renderComponent()

    expect(
        screen.queryByText("Loading...")
    ).not.toBeInTheDocument()
})

test("submit có image file", async () => {

    const user = userEvent.setup()

    UpdateBook.mockResolvedValue({
        message: "Success"
    })

    renderComponent()

    const file = new File(
        ["hello"],
        "book.png",
        { type: "image/png" }
    )

    const fileInput = document.querySelector(
        'input[type="file"]'
    )

    await user.upload(fileInput, file)

    const submitBtn = screen.getByRole("button", {
        name: /lưu/i
    })

    await user.click(submitBtn)

    await waitFor(() => {
        expect(UpdateBook).toHaveBeenCalled()
    })

    const formData =
        UpdateBook.mock.calls[0][2]

    expect(
        formData.get("image")
    ).toEqual(file)
})


test("không có dữ liệu book", () => {

    BookIDAPI.mockReturnValue([null])

    renderComponent()

    expect(
        screen.getByPlaceholderText(
            "Tên sách"
        )
    ).toHaveValue("")
})

test("upload file với file hợp lệ", async () => {

    const user = userEvent.setup()

    renderComponent()

    const file = new File(
        ["abc"],
        "book.png",
        { type: "image/png" }
    )

    const input = document.querySelector(
        'input[type="file"]'
    )

    await user.upload(input, file)

    expect(
        screen.getByText("book.png")
    ).toBeInTheDocument()

    expect(
        screen.getByRole("img")
    ).toBeInTheDocument()
})

test("upload and delete preview image", async () => {

    const user = userEvent.setup()

    renderComponent()

    const file = new File(
        ["hello"],
        "book.png",
        { type: "image/png" }
    )

    const input = document.querySelector(
        'input[type="file"]'
    )

    await user.upload(input, file)

    expect(
        screen.getByText("book.png")
    ).toBeInTheDocument()

    expect(
        screen.getByRole("img")
    ).toBeInTheDocument()

    const deleteBtn =
        screen.getByLabelText(
            "delete_preview"
        )

    await user.click(deleteBtn)

    expect(
        screen.queryByRole("img")
    ).not.toBeInTheDocument()
})

test("render category options", () => {

    renderComponent()

    expect(
        screen.getByText("Category A")
    ).toBeInTheDocument()
})

test("render author options", () => {

    renderComponent()

    expect(
        screen.getByText("Author A")
    ).toBeInTheDocument()
})

test("no upload file", async () => {

    const user = userEvent.setup()

    renderComponent()

    const submitBtn = screen.getByRole("button", {
        name: /lưu/i
    })

    await user.click(submitBtn)

    await waitFor(() => {
        expect(UpdateBook).toHaveBeenCalled()
    })

    const formData =
        UpdateBook.mock.calls[0][2]

    expect(
        formData.get("image")
    ).toBe(null)
})

test("missing value book name", async () => {

    const user = userEvent.setup()

    renderComponent()

    const nameInput =
        screen.getByPlaceholderText(
            "Tên sách"
        )

    await user.clear(nameInput)

    const submitBtn =
        screen.getByRole("button", {
            name: /lưu/i
        })

    await user.click(submitBtn)

    expect(
        screen.getByText(
            "Tên sách không được để trống"
        )
    ).toBeInTheDocument()

    expect(UpdateBook)
        .not.toHaveBeenCalled()
});

test("missing value book code", async () => {

    const user = userEvent.setup()

    renderComponent()

    const bookCodeInput =
        screen.getByPlaceholderText(
            "Mã sách"
        )

    await user.clear(bookCodeInput)

    const submitBtn =
        screen.getByRole("button", {
            name: /lưu/i
        })

    await user.click(submitBtn)

    expect(
        screen.getByText(
            "Mã sách không được để trống"
        )
    ).toBeInTheDocument()

    expect(UpdateBook)
        .not.toHaveBeenCalled()
})

test("Total book less than 0", async () => {

    const user = userEvent.setup()

    renderComponent()

    const quantityInput =
        screen.getByPlaceholderText(
            "Tổng số lượng"
        )

    await user.clear(quantityInput)

    await user.type(quantityInput, "-1")

    const submitBtn = screen.getByRole("button", {
        name: /lưu/i
    })

    await user.click(submitBtn)
    expect(
        screen.getByText(
            "Số lượng phải lớn hơn 0"
        )
    ).toBeInTheDocument()

    expect(UpdateBook).not.toHaveBeenCalled()
})

test("missing category value", async () => {

    const user = userEvent.setup()
    BookIDAPI.mockReturnValue([
        {
            id: 1,
            name: "Book A",
            description: "Description A",
            image: "test.jpg",
            total_quantity: 10,
            book_id: "B001",
            active: true,
            category: null,
            author: { id: 1 },
            publisher: { id: 1 }
        }
    ])
    renderComponent()
    const submitBtn = screen.getByRole("button", {
        name: /lưu/i
    })

    await user.click(submitBtn)

    expect(
        screen.getByText(
            "Vui lòng chọn danh mục"
        )
    ).toBeInTheDocument()

    expect(UpdateBook).not.toHaveBeenCalled()
})

test("missing author value", async () => {
    const user = userEvent.setup()
    BookIDAPI.mockReturnValue([
        {
            id: 1,
            name: "Book A",
            description: "Description A",
            image: "test.jpg",
            total_quantity: 10,
            book_id: "B001",
            active: true,
            category: { id: 1 },
            author: null,
            publisher: { id: 1 }
        }
    ])
    renderComponent()

    const submitBtn = screen.getByRole("button", {
        name: /lưu/i
    })

    await user.click(submitBtn)

    expect(
        screen.getByText(
            "Vui lòng chọn tác giả"
        )
    ).toBeInTheDocument()

    expect(UpdateBook).not.toHaveBeenCalled()
})

test("missing publisher value", async () => {
    const user = userEvent.setup()
    BookIDAPI.mockReturnValue([
        {
            id: 1,
            name: "Book A",
            description: "Description A",
            image: "test.jpg",
            total_quantity: 10,
            book_id: "B001",
            active: true,
            category: { id: 1 },
            author: { id: 1 },
            publisher: null
        }
    ])

    renderComponent()

    const submitBtn = screen.getByRole("button", {
        name: /lưu/i
    })

    await user.click(submitBtn)

    expect(
        screen.getByText(
            "Vui lòng chọn nhà xuất bản"
        )
    ).toBeInTheDocument()

    expect(UpdateBook).not.toHaveBeenCalled()
})

test("bỏ trống description", async () => {

    const user = userEvent.setup()

    renderComponent()

    const descriptionInput =
        screen.getByPlaceholderText("Mô tả")

    await user.clear(descriptionInput)

    const submitBtn = screen.getByRole("button", {
        name: /lưu/i
    })

    await user.click(submitBtn)

    expect(UpdateBook).toHaveBeenCalled()
})