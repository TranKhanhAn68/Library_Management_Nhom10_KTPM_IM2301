import React from "react"
import {
    render,
    screen,
    waitFor,
    fireEvent
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { vi, beforeEach, describe, test, expect } from "vitest"

import AddBook from "./AddBook"
import { AuthContent } from "../../../utils/AuthContext"

import * as BookAPI from "../../../services/BookAPI"

const mockNavigate = vi.fn()

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")

    return {
        ...actual,
        useNavigate: () => mockNavigate
    }
})

vi.mock("../../../services/BookAPI", () => ({
    PostBook: vi.fn(),
    BookIDAPI: vi.fn()
}))

vi.mock("../../../services/AuthorAPI", () => ({
    AuthorListAPI: () => [[
        { id: 1, name: "Author A" }
    ]]
}))

vi.mock("../../../services/PublisherAPI", () => ({
    PublisherListAPI: () => [[
        { id: 1, name: "Publisher A" }
    ]]
}))

vi.mock("../../../services/CategoryAPI", () => ({
    CategoryListAPI: () => [[
        { id: 1, name: "Category A" }
    ]]
}))

vi.mock("../../../components/Loading", () => ({
    default: () => <div>Loading...</div>
}))

vi.mock("../../../components/BaseModal", () => ({
    default: ({ open, children, close }) =>
        open && (
            <div>
                {children}
                <button onClick={close}>
                    close
                </button>
            </div>
        )
}))

vi.mock("../../../utils/GetError", () => ({
    getError: vi.fn(() => ["Server Error"])
}))

const renderComponent = () => {
    render(
        <AuthContent.Provider value={{
            token: "fake-token"
        }}>
            <MemoryRouter>
                <AddBook />
            </MemoryRouter>
        </AuthContent.Provider>
    )
}

beforeEach(() => {
    vi.clearAllMocks()
})

describe("AddBook", () => {

    test("render component", async () => {
        renderComponent()

        expect(
            await screen.findByText("Cập nhật sách")
        ).toBeInTheDocument()
    })

    test("change input", async () => {
        const user = userEvent.setup()

        renderComponent()

        const input = screen.getByPlaceholderText("Tên sách")

        await user.type(input, "Book ABC")

        expect(input).toHaveValue("Book ABC")
    })

    test("change checkbox active", async () => {
        const user = userEvent.setup()

        renderComponent()

        const checkbox = screen.getByRole("checkbox")

        expect(checkbox).not.toBeChecked()

        await user.click(checkbox)

        expect(checkbox).toBeChecked()
    })

    test("upload image preview", async () => {
        const user = userEvent.setup()

        renderComponent()

        const file = new File(
            ["hello"],
            "a.png",
            { type: "image/png" }
        )

        const input =
            screen.getByLabelText(/nhấn để chọn tệp/i)

        await user.upload(input, file)

        expect(
            screen.getByText("a.png")
        ).toBeInTheDocument()

        expect(
            screen.getByRole("img")
        ).toBeInTheDocument()
    })

    test("remove uploaded image", async () => {
        const user = userEvent.setup()

        renderComponent()

        const file = new File(
            ["hello"],
            "a.png",
            { type: "image/png" }
        )

        const input =
            screen.getByLabelText(/nhấn để chọn tệp/i)

        await user.upload(input, file)

        const removeBtn =
            screen.getByRole("button", {
                name: ""
            })

        await user.click(removeBtn)

        expect(
            screen.queryByRole("img")
        ).not.toBeInTheDocument()
    })

    test("submit empty form", async () => {
        const user = userEvent.setup()

        renderComponent()

        await user.click(
            screen.getByRole("button", {
                name: "Lưu"
            })
        )

        expect(
            await screen.findByText(
                "Vui lòng nhập đầy đủ thông tin"
            )
        ).toBeInTheDocument()
    })

    test("submit success", async () => {
        const user = userEvent.setup()

        BookAPI.PostBook.mockResolvedValue({
            message: "Tạo thành công"
        })

        renderComponent()

        await user.type(
            screen.getByPlaceholderText("Tên sách"),
            "Book test"
        )

        await user.type(
            screen.getByPlaceholderText("Mô tả"),
            "Description"
        )

        await user.type(
            screen.getByPlaceholderText("Mã sách"),
            "BOOK001"
        )

        await user.type(
            screen.getByPlaceholderText("Tổng số lượng"),
            "10"
        )

        const selects =
            screen.getAllByRole("combobox")

        await user.selectOptions(selects[0], "1")
        await user.selectOptions(selects[1], "1")
        await user.selectOptions(selects[2], "1")

        const file = new File(
            ["hello"],
            "a.png",
            { type: "image/png" }
        )

        const fileInput =
            screen.getByLabelText(/nhấn để chọn tệp/i)

        await user.upload(fileInput, file)

        await user.click(
            screen.getByRole("button", {
                name: "Lưu"
            })
        )

        await waitFor(() => {
            expect(BookAPI.PostBook)
                .toHaveBeenCalled()
        })

        const formData =
            BookAPI.PostBook.mock.calls[0][1]

        expect(formData.get("name"))
            .toBe("Book test")

        expect(formData.get("image"))
            .toEqual(file)

        expect(
            await screen.findByText(
                "Tạo thành công"
            )
        ).toBeInTheDocument()
    })

    test("submit fail api", async () => {
        const user = userEvent.setup()

        BookAPI.PostBook.mockRejectedValue(
            new Error("Error")
        )

        renderComponent()

        await user.type(
            screen.getByPlaceholderText("Tên sách"),
            "Book test"
        )

        await user.type(
            screen.getByPlaceholderText("Mô tả"),
            "Description"
        )

        await user.type(
            screen.getByPlaceholderText("Mã sách"),
            "BOOK001"
        )

        await user.type(
            screen.getByPlaceholderText("Tổng số lượng"),
            "10"
        )

        const selects =
            screen.getAllByRole("combobox")

        await user.selectOptions(selects[0], "1")
        await user.selectOptions(selects[1], "1")
        await user.selectOptions(selects[2], "1")

        await user.click(
            screen.getByRole("button", {
                name: "Lưu"
            })
        )

        expect(
            await screen.findByText("Server Error")
        ).toBeInTheDocument()
    })

    test("click cancel button", async () => {
        const user = userEvent.setup()

        renderComponent()

        await user.click(
            screen.getByRole("button", {
                name: "Hủy"
            })
        )

        expect(mockNavigate)
            .toHaveBeenCalledWith(
                "/dashboard/books"
            )
    })

    test("close modal success redirect", async () => {
        const user = userEvent.setup()

        BookAPI.PostBook.mockResolvedValue({
            message: "Success"
        })

        renderComponent()

        await user.type(
            screen.getByPlaceholderText("Tên sách"),
            "Book test"
        )

        await user.type(
            screen.getByPlaceholderText("Mô tả"),
            "Description"
        )

        await user.type(
            screen.getByPlaceholderText("Mã sách"),
            "BOOK001"
        )

        await user.type(
            screen.getByPlaceholderText("Tổng số lượng"),
            "10"
        )

        const selects =
            screen.getAllByRole("combobox")

        await user.selectOptions(selects[0], "1")
        await user.selectOptions(selects[1], "1")
        await user.selectOptions(selects[2], "1")

        await user.click(
            screen.getByRole("button", {
                name: "Lưu"
            })
        )

        const closeBtn =
            await screen.findByText("close")

        await user.click(closeBtn)

        expect(mockNavigate)
            .toHaveBeenCalledWith(
                "/dashboard/books"
            )
    })
})