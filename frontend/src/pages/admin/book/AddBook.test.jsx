import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import AddBook from "./AddBook"

// mock API
import * as BookAPI from "../../../services/BookAPI"
import * as AuthorAPI from "../../../services/AuthorAPI"
import * as PublisherAPI from "../../../services/PublisherAPI"
import * as CategoryAPI from "../../../services/CategoryAPI"

// mock context
import { AuthContent } from "../../../utils/AuthContext"

// mock navigate
const mockNavigate = vi.fn()

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        useNavigate: () => mockNavigate
    }
})

vi.mock("../../../components/BaseModal", () => ({
    default: ({ children, open, close }) =>
        open ? (
            <div>
                {children}
                <button onClick={close}>close</button>
            </div>
        ) : null
}))

// mock APIs
vi.mock("../../../services/BookAPI")
vi.mock("../../../services/AuthorAPI")
vi.mock("../../../services/PublisherAPI")
vi.mock("../../../services/CategoryAPI")


beforeEach(() => {
    vi.clearAllMocks()

    AuthorAPI.AuthorListAPI.mockReturnValue([[{ id: 1, name: "Author A" }]])
    PublisherAPI.PublisherListAPI.mockReturnValue([[{ id: 1, name: "Publisher A" }]])
    CategoryAPI.CategoryListAPI.mockReturnValue([[{ id: 1, name: "Category A" }]])
})

const renderComponent = () => {
    return render(
        <AuthContent.Provider value={{ token: "fake-token" }}>
            <MemoryRouter>
                <AddBook />
            </MemoryRouter>
        </AuthContent.Provider>
    )
}

test("render all form", () => {
    renderComponent()

    expect(screen.getByPlaceholderText("Tên sách")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Mô tả")).toBeInTheDocument()
    expect(screen.getByText("Lưu")).toBeInTheDocument()
})

test("submit missing select -> show error modal", async () => {
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText("Tên sách"), {
        target: { value: "Book test" }
    })

    fireEvent.click(screen.getByText("Lưu"))

    expect(await screen.findByText(/Vui lòng chọn đầy đủ/i)).toBeInTheDocument()
})

test("submit success", async () => {
    BookAPI.PostBook.mockResolvedValue({
        message: "Tạo sách thành công"
    })

    renderComponent()

    fireEvent.change(screen.getByPlaceholderText("Tên sách"), {
        target: { value: "Book test" }
    })

    fireEvent.change(screen.getByPlaceholderText("Mã sách"), {
        target: { value: "B001" }
    })

    fireEvent.change(screen.getByPlaceholderText("Tổng số lượng"), {
        target: { value: "10" }
    })

    fireEvent.change(document.querySelector("#choose_category"), {
        target: { value: "1" }
    })

    fireEvent.change(document.querySelector("#choose_author"), {
        target: { value: "1" }
    })

    fireEvent.change(document.querySelector("#choose_publisher"), {
        target: { value: "1" }
    })

    fireEvent.click(screen.getByText("Lưu"))

    await waitFor(() => {
        expect(BookAPI.PostBook).toHaveBeenCalled()
    })
})


test("missing author only triggers modal", async () => {
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText("Tên sách"), {
        target: { value: "Book" }
    })

    fireEvent.change(document.querySelector("#choose_category"), {
        target: { value: "1" }
    })

    fireEvent.change(document.querySelector("#choose_publisher"), {
        target: { value: "1" }
    })

    fireEvent.click(screen.getByText("Lưu"))

    expect(await screen.findByText(/Vui lòng chọn đầy đủ/i)).toBeInTheDocument()
})

test("submit fails shows error modal", async () => {
    BookAPI.PostBook.mockRejectedValue(new Error("API failed"))

    renderComponent()

    fireEvent.change(screen.getByPlaceholderText("Tên sách"), {
        target: { value: "Book test" }
    })

    fireEvent.change(document.querySelector("#choose_category"), {
        target: { value: "1" }
    })

    fireEvent.change(document.querySelector("#choose_author"), {
        target: { value: "1" }
    })

    fireEvent.change(document.querySelector("#choose_publisher"), {
        target: { value: "1" }
    })

    fireEvent.click(screen.getByText("Lưu"))

    expect(await screen.findByText(/API failed/i)).toBeInTheDocument()
})

test("success modal triggers navigate on close", async () => {
    BookAPI.PostBook.mockResolvedValue({
        message: "OK"
    })

    renderComponent()

    fireEvent.change(screen.getByPlaceholderText("Tên sách"), {
        target: { value: "Book test" }
    })

    fireEvent.change(document.querySelector("#choose_category"), { target: { value: "1" } })
    fireEvent.change(document.querySelector("#choose_author"), { target: { value: "1" } })
    fireEvent.change(document.querySelector("#choose_publisher"), { target: { value: "1" } })

    fireEvent.click(screen.getByText("Lưu"))

    await waitFor(() => {
        expect(screen.getByText("OK")).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText("close"))

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/books")
})

test("submit includes image file", async () => {
    BookAPI.PostBook.mockResolvedValue({ message: "OK" })

    renderComponent()

    fireEvent.change(screen.getByPlaceholderText("Tên sách"), {
        target: { value: "Book test" }
    })

    const file = new File(["img"], "a.png", { type: "image/png" })

    const input = document.querySelector('input[type="file"]')

    fireEvent.change(input, {
        target: { files: [file] }
    })

    fireEvent.change(document.querySelector("#choose_category"), { target: { value: "1" } })
    fireEvent.change(document.querySelector("#choose_author"), { target: { value: "1" } })
    fireEvent.change(document.querySelector("#choose_publisher"), { target: { value: "1" } })

    fireEvent.click(screen.getByText("Lưu"))

    await waitFor(() => {
        expect(BookAPI.PostBook).toHaveBeenCalled()
    })
})