import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { vi } from "vitest"
import EditCategory from "./EditCategory"

const mockNavigate = vi.fn()

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: "1" })
    }
})



vi.mock("../../../services/CategoryAPI", () => ({
    CategoryByIDAPI: vi.fn(),
    UpdateCategory: vi.fn()
}))

import { CategoryByIDAPI, UpdateCategory } from "../../../services/CategoryAPI"

vi.mock("../../../utils/AuthContext", async () => {
    const React = await import("react")
    return {
        AuthContent: React.createContext()
    }
})


import { AuthContent } from "../../../utils/AuthContext"

const renderComponent = () => {
    return render(
        <AuthContent.Provider value={{ token: "fake-token" }}>
            <MemoryRouter initialEntries={["/dashboard/categories/edit/1"]}>
                <Routes>
                    <Route
                        path="/dashboard/categories/edit/:id"
                        element={<EditCategory />}
                    />
                </Routes>
            </MemoryRouter>
        </AuthContent.Provider>
    )
}

vi.mock("../../../components/BaseModal", () => ({
    default: ({ open, children, close }) =>
        open ? (
            <div data-testid="modal">
                {children}
                <button onClick={close}>Close</button>
            </div>
        ) : null
}))

vi.mock("../../../utils/GetError", () => ({
    getError: vi.fn(() => "Error")
}))

beforeEach(() => {
    CategoryByIDAPI.mockReturnValue([
        {
            id: 1,
            name: "Category A",
            active: true
        }
    ])
})


afterEach(() => {
    vi.clearAllMocks()
})



test("render category data", async () => {
    renderComponent()

    expect(await screen.findByDisplayValue("Category A")).toBeInTheDocument()
    expect(screen.getByRole("checkbox")).toBeChecked()
})

test("update category success", async () => {
    UpdateCategory.mockResolvedValue(true)

    const user = userEvent.setup()
    renderComponent()

    const btn = screen.getByRole("button", { name: /cập nhật/i })
    await user.click(btn)

    await screen.findByText("Cập nhật thành công")

    expect(screen.getByText("Cập nhật thành công")).toBeInTheDocument()
})

test("update category fail", async () => {
    const user = userEvent.setup()

    UpdateCategory.mockRejectedValueOnce(new Error("fail"))

    renderComponent()

    const btn = screen.getByRole("button", { name: /cập nhật/i })
    await user.click(btn)

    expect(await screen.findByText("Error")).toBeInTheDocument()
})

test("name empty validation", async () => {
    const user = userEvent.setup()
    renderComponent()

    const input = screen.getByPlaceholderText("Nhập vào tên Category")

    await user.clear(input)

    const btn = screen.getByRole("button", { name: /cập nhật/i })
    await user.click(btn)

    expect(
        screen.getByText("Không được để trống")
    ).toBeInTheDocument()

    expect(UpdateCategory).not.toHaveBeenCalled()
})

test("toggle active checkbox", async () => {
    const user = userEvent.setup()
    renderComponent()

    const checkbox = screen.getByRole("checkbox")

    expect(checkbox).toBeChecked()

    await user.click(checkbox)

    expect(checkbox).not.toBeChecked()
})

test("click cancel navigate", async () => {
    const user = userEvent.setup()
    renderComponent()

    const btn = screen.getByRole("button", { name: /hủy bỏ/i })
    await user.click(btn)

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/categories")
})

test("close modal success navigate", async () => {
    UpdateCategory.mockResolvedValue(true)

    const user = userEvent.setup()
    renderComponent()

    const btn = screen.getByRole("button", { name: /cập nhật/i })
    await user.click(btn)

    await waitFor(() => {
        expect(screen.getByText("Cập nhật thành công")).toBeInTheDocument()
    })

    const closeBtn = screen.getByText("Close")
    await user.click(closeBtn)

    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard/categories")
    })
})