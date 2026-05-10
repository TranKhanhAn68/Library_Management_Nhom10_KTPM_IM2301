import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserDashboard from "./UserDashboard";
import { AuthContent } from "../../../utils/AuthContext";
import { DeleteUser, UserListAPI } from "../../../services/UserAPI";

vi.mock("../../../services/UserAPI", () => ({
    UserListAPI: vi.fn(),
    DeleteUser: vi.fn()
}));

vi.mock("../../../utils/GetError", () => ({
    getError: vi.fn(() => "Delete failed")
}));

vi.mock("../../../components/Input", () => ({
    default: ({ value, onChange, placeholder }) => (
        <input
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    )
}));

vi.mock("../../../components/Pagination", () => ({
    default: ({ currentPage, totalPages, goPage }) => (
        <div>
            <span>
                Pagination {currentPage}/{totalPages}
            </span>

            <button
                aria-label="next-page"
                onClick={() => goPage(2)}
            >
                Next
            </button>
        </div>
    )
}));

vi.mock("../../../components/BaseModal", () => ({
    default: ({ open, close, children }) =>
        open ? (
            <div>
                {children}

                <button
                    aria-label="close-modal"
                    onClick={close}
                >
                    Close
                </button>
            </div>
        ) : null
}));


const mockUsers = {
    count: 1,
    results: [
        {
            id: 1,
            username: "admin",
            first_name: "Tran",
            last_name: "An",
            email: "admin@gmail.com",
            phone_number: "0123456789",
            image: "test.jpg",
            is_active: true,
            is_staff: true,
            is_superuser: false,
            last_login: "2024-01-01T10:00:00",
            date_joined: "2024-01-01T08:00:00"
        }
    ]
};

const renderUI = () => {
    return render(
        <AuthContent.Provider value={{ token: "fake-token" }}>
            <MemoryRouter>
                <UserDashboard />
            </MemoryRouter>
        </AuthContent.Provider>
    );
};

beforeEach(() => {
    vi.clearAllMocks();

    UserListAPI.mockReturnValue(mockUsers);

    window.alert = vi.fn();
    window.confirm = vi.fn(() => true);
});

test("render users", () => {
    renderUI();

    expect(screen.getByText("Tran")).toBeInTheDocument();
    expect(screen.getByText("An")).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
        return element.tagName.toLowerCase() === "span"
            && content === "Active";
    })).toBeInTheDocument();
});

test("render empty data", () => {
    UserListAPI.mockReturnValue({
        count: 0,
        results: []
    });

    renderUI();

    expect(screen.getByText("Không có dữ liệu")).toBeInTheDocument();
});

test("change search input", () => {
    renderUI();

    const input = screen.getByPlaceholderText(/tìm theo tên/i);

    fireEvent.change(input, {
        target: {
            value: "admin"
        }
    });

    expect(input.value).toBe("admin");
});

test("click search button", () => {
    renderUI();

    const button = screen.getByText("Tìm");

    fireEvent.click(button);

    expect(button).toBeInTheDocument();
});

test("open detail modal", async () => {
    renderUI();

    const detailBtn = screen.getByLabelText("detail-user-1");
    fireEvent.click(detailBtn);

    expect(screen.getByText("Chi tiết người dùng")).toBeInTheDocument();


});

test("close detail modal", async () => {
    renderUI();

    const detailBtn = screen.getByLabelText("detail-user-1");

    fireEvent.click(detailBtn);

    expect(screen.getByText("Chi tiết người dùng"))
        .toBeInTheDocument();

    const closeBtn = screen.getByLabelText("close-modal");

    fireEvent.click(closeBtn);

    await waitFor(() => {
        expect(screen.queryByText("Chi tiết người dùng"))
            .not.toBeInTheDocument();
    });
});

test("delete user success", async () => {
    DeleteUser.mockResolvedValue({});

    renderUI();

    const deleteBtn = screen.getByLabelText("delete-user-1");

    fireEvent.click(deleteBtn);

    await waitFor(() => {
        expect(DeleteUser).toHaveBeenCalled();
    });

    expect(window.alert).toHaveBeenCalledWith("Xóa thành công");
});

test("delete user failed", async () => {
    DeleteUser.mockRejectedValue(new Error("Failed"));

    renderUI();

    const deleteBtn = screen.getByLabelText("delete-user-1");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
        expect(DeleteUser).toHaveBeenCalled();
    });

    expect(window.alert).toHaveBeenCalledWith("Delete failed");
});

test("cancel delete user", () => {
    window.confirm = vi.fn(() => false);

    renderUI();

    const deleteBtn = screen.getByLabelText("delete-user-1");
    fireEvent.click(deleteBtn);

    expect(DeleteUser).not.toHaveBeenCalled();
});

test("render inactive user", () => {
    UserListAPI.mockReturnValue({
        count: 1,
        results: [
            {
                ...mockUsers.results[0],
                is_active: false
            }
        ]
    });

    renderUI();

    expect(screen.getByText("Inactive")).toBeInTheDocument();
});

test("render no last login", () => {
    UserListAPI.mockReturnValue({
        count: 1,
        results: [
            {
                ...mockUsers.results[0],
                last_login: null
            }
        ]
    });

    renderUI();

    expect(screen.getByText("Chưa từng đăng nhập")).toBeInTheDocument();
});

test("render admin role", () => {
    UserListAPI.mockReturnValue({
        count: 1,
        results: [
            {
                ...mockUsers.results[0],
                is_superuser: true
            }
        ]
    });

    renderUI();

    fireEvent.click(screen.getByText("Xem chi tiết"));

    expect(screen.getByText("Admin")).toBeInTheDocument();
});

test("render normal user role", () => {
    UserListAPI.mockReturnValue({
        count: 1,
        results: [
            {
                ...mockUsers.results[0],
                is_superuser: false,
                is_staff: false
            }
        ]
    });

    renderUI();

    fireEvent.click(screen.getByText("Xem chi tiết"));

    expect(screen.getByText("Người dùng")).toBeInTheDocument();
});

test("render default image in modal", () => {
    UserListAPI.mockReturnValue({
        count: 1,
        results: [
            {
                ...mockUsers.results[0],
                image: null
            }
        ]
    });

    renderUI();

    fireEvent.click(screen.getByText("Xem chi tiết"));

    const image = screen.getByAltText("admin");

    expect(image.getAttribute("src")).toContain("placeholder");
});

test("render pagination", () => {
    renderUI();

    expect(screen.getByText("Pagination 1/1")).toBeInTheDocument();
});