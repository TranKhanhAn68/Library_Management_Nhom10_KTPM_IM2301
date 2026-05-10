import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import AddCategory from "./AddCategory"
import { AuthContent } from "../../../utils/AuthContext"
import { vi } from "vitest"

vi.mock("../../../services/CategoryAPI", () => ({
    PostCategory: vi.fn()
}))

vi.mock("../../../components/Loading", () => ({
    default: () => <div>Loading...</div>
}))

vi.mock("../../../components/BaseModal", () => ({
    default: ({ open, children, close }) =>
        open &&
        <div>
            {children}
            <button onClick={close}>
                Close
            </button>
        </div>
}))

vi.mock("../../../utils/GetError", () => ({
    getError: vi.fn(() => "Lỗi server")
}))

const mockNavigate = vi.fn()

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        useNavigate: () => mockNavigate
    }
})

import { PostCategory } from "../../../services/CategoryAPI"

const renderComponent = () => {
    render(
        <AuthContent.Provider value={{ token: "fake-token" }}>
            <MemoryRouter>
                <AddCategory />
            </MemoryRouter>
        </AuthContent.Provider>
    )
}

beforeEach(() => {
    vi.clearAllMocks()
})

test("render component", async () => {
    renderComponent()

    expect(
        await screen.findByText("Thêm danh mục sách mới")
    ).toBeInTheDocument()
})

test("input change", async () => {
    const user = userEvent.setup()

    renderComponent()

    const input = await screen.findByPlaceholderText(
        "Nhập vào tên Category"
    )

    await user.type(input, "Category mới")

    expect(input).toHaveValue("Category mới")
})

test("checkbox change", async () => {
    const user = userEvent.setup()

    renderComponent()

    const checkbox = await screen.findByRole("checkbox")

    expect(checkbox).toBeChecked()

    await user.click(checkbox)

    expect(checkbox).not.toBeChecked()
})

test("submit empty name", async () => {
    const user = userEvent.setup()

    renderComponent()

    const button = await screen.findByRole("button", {
        name: "Thêm mới"
    })

    await user.click(button)

    expect(
        await screen.findByText("Không được để trống")
    ).toBeInTheDocument()
})

test("submit success", async () => {
    const user = userEvent.setup()

    PostCategory.mockResolvedValue(true)

    renderComponent()

    const input = await screen.findByPlaceholderText(
        "Nhập vào tên Category"
    )

    const button = screen.getByRole("button", {
        name: "Thêm mới"
    })

    await user.type(input, "Category A")
    await user.click(button)

    await waitFor(() => {
        expect(PostCategory).toHaveBeenCalledWith(
            "Category A",
            true,
            "fake-token"
        )
    })
    expect(
        await screen.findByText("Tạo thành công")
    ).toBeInTheDocument()
    const closeButton = screen.getByRole("button", {
        name: "Close"
    })
    await user.click(closeButton)

    expect(mockNavigate).toHaveBeenCalled()
})

test("submit failed then close modal does not redirect", async () => {
    const user = userEvent.setup()

    PostCategory.mockRejectedValue(
        new Error("Error")
    )

    renderComponent()

    const input = await screen.findByPlaceholderText(
        "Nhập vào tên Category"
    )

    const submitButton = screen.getByRole("button", {
        name: "Thêm mới"
    })

    await user.type(input, "Category lỗi")

    await user.click(submitButton)

    expect(
        await screen.findByText("Lỗi server")
    ).toBeInTheDocument()

    const closeButton = screen.getByRole("button", {
        name: "Close"
    })

    await user.click(closeButton)

    expect(mockNavigate).not.toHaveBeenCalled()
})

test("click cancel button", async () => {
    const user = userEvent.setup()

    renderComponent()

    const button = await screen.findByRole("button", {
        name: "Hủy bỏ"
    })

    await user.click(button)

    expect(mockNavigate).toHaveBeenCalledWith(
        "/dashboard/categories"
    )
})


