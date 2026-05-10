import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { vi } from "vitest"

import CategoryDashboard from "./CategoryDashboard"
import { AuthContent } from "../../../utils/AuthContext"

vi.mock("../../../services/CategoryAPI", () => ({
    CategoryListAPI: vi.fn(),
    DeleteCategory: vi.fn()
}))

vi.mock("../../../components/Loading", () => ({
    default: () => <div>Loading...</div>
}))

vi.mock("../../../components/Input", () => ({
    default: (props) => (
        <input {...props} />
    )
}))

vi.mock("../../../components/BaseModal", () => ({
    default: ({ open, children, close }) =>
        open ? (
            <div>
                {children}
                <button onClick={close} aria-label="close-modal">
                    Close
                </button>
            </div>
        ) : null
}))

vi.mock("../../../utils/GetError", () => ({
    getError: vi.fn(() => "Lỗi server")
}))

const mockCategories = [
    {
        id: 1,
        name: "Category A",
        active: true,
        created_at: "2025-01-01",
        updated_at: "2025-01-02"
    },
    {
        id: 2,
        name: "Category B",
        active: false,
        created_at: "2025-01-01",
        updated_at: null
    }
]

import {
    CategoryListAPI,
    DeleteCategory
} from "../../../services/CategoryAPI"

beforeEach(() => {
    vi.clearAllMocks()

    CategoryListAPI.mockReturnValue([
        mockCategories
    ])
})

const renderComponent = () => {
    render(
        <AuthContent.Provider value={{
            token: "fake-token"
        }}>
            <MemoryRouter>
                <CategoryDashboard />
            </MemoryRouter>
        </AuthContent.Provider>
    )
}

test("render component", async () => {
    renderComponent()

    expect(
        await screen.findByText("Category")
    ).toBeInTheDocument()
})

test("render category list", async () => {
    renderComponent()

    expect(
        await screen.findByText("Category A")
    ).toBeInTheDocument()

    expect(
        screen.getByText("Category B")
    ).toBeInTheDocument()
})

test("render empty data", async () => {
    CategoryListAPI.mockReturnValue([[]])

    renderComponent()

    expect(
        await screen.findByText(
            "Không có dữ liệu"
        )
    ).toBeInTheDocument()
})

test("open delete modal", async () => {
    const user = userEvent.setup()

    renderComponent()

    const deleteButtons =
        await screen.findAllByLabelText("delete_button")

    await user.click(deleteButtons[1])

    expect(
        await screen.findByText(
            "Xác nhận xóa?"
        )
    ).toBeInTheDocument()
})

test("close delete modal", async () => {
    const user = userEvent.setup()

    renderComponent()

    const deleteButtons =
        await screen.findAllByLabelText("delete_button")

    await user.click(deleteButtons[1])

    const cancelButton =
        await screen.findByText("Hủy")

    await user.click(cancelButton)

    expect(
        screen.queryByText("Xác nhận xóa?")
    ).not.toBeInTheDocument()
})

test("delete category success", async () => {
    const user = userEvent.setup()

    DeleteCategory.mockResolvedValue({
        message: "Xóa dữ liệu thành công!"
    })

    renderComponent()

    const deleteButtons =
        await screen.findAllByLabelText("delete_button")

    await user.click(deleteButtons[1])

    const confirmButton =
        await screen.findByText("Xóa")

    await user.click(confirmButton)

    await waitFor(() => {
        expect(DeleteCategory)
            .toHaveBeenCalledWith(
                2,
                "fake-token"
            )
    })
})

test("show message after delete success", async () => {
    const user = userEvent.setup()

    DeleteCategory.mockResolvedValue({
        message: "Xóa dữ liệu thành công!"
    })

    renderComponent()

    const deleteButtons =
        await screen.findAllByLabelText("delete_button")

    await user.click(deleteButtons[1])

    const confirmButton =
        await screen.findByText("Xóa")

    await user.click(confirmButton)

    expect(
        await screen.findByText(
            "Xóa dữ liệu thành công!"
        )
    ).toBeInTheDocument()
})

test("delete category failed", async () => {
    const user = userEvent.setup()

    DeleteCategory.mockRejectedValue(
        new Error("Error")
    )

    renderComponent()

    const deleteButtons =
        await screen.findAllByLabelText("delete_button")

    await user.click(deleteButtons[1])

    const confirmButton =
        await screen.findByText("Xóa")

    await user.click(confirmButton)

    expect(
        await screen.findByText(
            "Lỗi server"
        )
    ).toBeInTheDocument()
})

test("handleClose closes delete modal", async () => {
    const user = userEvent.setup()

    renderComponent()

    const deleteButtons =
        await screen.findAllByLabelText("delete_button")

    await user.click(deleteButtons[1])

    expect(
        await screen.findByText("Xác nhận xóa?")
    ).toBeInTheDocument()

    const closeButton = screen.getByText("Close")

    await user.click(closeButton)

    expect(
        screen.queryByText("Xác nhận xóa?")
    ).not.toBeInTheDocument()
})

test("handleClose closes message modal", async () => {
    const user = userEvent.setup()

    DeleteCategory.mockResolvedValue({
        message: "Xóa thành công"
    })

    renderComponent()

    const deleteButtons =
        await screen.findAllByLabelText("delete_button")

    await user.click(deleteButtons[0])

    const confirmButton =
        await screen.findByText("Xóa")

    await user.click(confirmButton)

    const msg = await screen.findByText("Xóa dữ liệu thành công!")
    expect(msg).toBeInTheDocument()

    const closeButton = screen.getByLabelText("close-modal")
    await user.click(closeButton)

    expect(
        screen.queryByText("Xóa thành công")
    ).not.toBeInTheDocument()
})