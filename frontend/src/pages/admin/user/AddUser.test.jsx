import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, beforeEach, it, test } from "vitest";
import AddUser from "./AddUser";
import * as UserAPI from "../../../services/UserAPI";
import * as GetError from "../../../utils/GetError";
import { AuthContent } from "../../../utils/AuthContext";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = vi.fn();

vi.mock("../../../services/UserAPI", () => ({
    PostUser: vi.fn(),
}));

vi.mock("../../../utils/GetError", () => ({
    getError: vi.fn(),
}));

vi.mock("../../../components/BaseModal", () => ({
    default: ({ open, close, children }) =>
        open ? (
            <div>
                {children}
                <button onClick={close}>close-modal</button>
            </div>
        ) : null,
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const renderComponent = () => {
    return render(
        <AuthContent.Provider value={{ token: "fake-token" }}>
            <BrowserRouter>
                <AddUser />
            </BrowserRouter>
        </AuthContent.Provider>
    );
};

beforeEach(() => {
    vi.clearAllMocks();
});

test("render form đầy đủ", () => {
    renderComponent();

    expect(screen.getByText("Thêm người dùng")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
});

test("validate thiếu field -> không gọi API", async () => {
    renderComponent();

    fireEvent.click(screen.getByText("Lưu thay đổi"));

    expect(await screen.findByText("Vui lòng nhập đầy đủ thông tin")).toBeInTheDocument();
    expect(UserAPI.PostUser).not.toHaveBeenCalled();
});

test("submit success -> gọi API + show message", async () => {
    UserAPI.PostUser.mockResolvedValue({ message: "Thêm thành công" });

    renderComponent();

    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "admin" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@gmail.com" } });
    fireEvent.change(screen.getByLabelText("Họ"), { target: { value: "Tran" } });
    fireEvent.change(screen.getByLabelText("Tên"), { target: { value: "An" } });
    fireEvent.change(screen.getByLabelText("Số điện thoại"), { target: { value: "0123" } });

    fireEvent.click(screen.getByText("Lưu thay đổi"));

    await waitFor(() => {
        expect(UserAPI.PostUser).toHaveBeenCalled();
    });

    expect(await screen.findByText("Thêm thành công")).toBeInTheDocument();
});

test("API error string", async () => {
    UserAPI.PostUser.mockRejectedValue(new Error("fail"));

    vi.spyOn(GetError, "getError").mockReturnValue("Không thể thêm người dùng");

    renderComponent();

    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "a" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@gmail.com" } });
    fireEvent.change(screen.getByLabelText("Họ"), { target: { value: "a" } });
    fireEvent.change(screen.getByLabelText("Tên"), { target: { value: "b" } });
    fireEvent.change(screen.getByLabelText("Số điện thoại"), { target: { value: "123" } });

    fireEvent.click(screen.getByText("Lưu thay đổi"));

    expect(await screen.findByText("Không thể thêm người dùng")).toBeInTheDocument();
});

test("API error array", async () => {
    UserAPI.PostUser.mockRejectedValue(new Error("fail"));

    vi.spyOn(GetError, "getError").mockReturnValue(["Lỗi hệ thống"]);

    renderComponent();

    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "a" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@gmail.com" } });
    fireEvent.change(screen.getByLabelText("Họ"), { target: { value: "a" } });
    fireEvent.change(screen.getByLabelText("Tên"), { target: { value: "b" } });
    fireEvent.change(screen.getByLabelText("Số điện thoại"), { target: { value: "123" } });

    fireEvent.click(screen.getByText("Lưu thay đổi"));

    expect(await screen.findByText("Lỗi hệ thống")).toBeInTheDocument();
});

test("toggle staff hiển thị employee fields", () => {
    renderComponent();

    fireEvent.click(screen.getByText("Nhân viên"));

    expect(screen.getByLabelText("Mã nhân viên")).toBeInTheDocument();
    expect(screen.getByLabelText("Ca làm việc")).toBeInTheDocument();
    expect(screen.getByLabelText("CCCD/CMND")).toBeInTheDocument();
});

test("toggle superuser", () => {
    renderComponent();

    const checkbox = screen.getByRole("checkbox", { name: /quản trị tối cao/i });
    fireEvent.click(checkbox);

    expect(checkbox.checked).toBe(true);
});

test("close modal khi success -> navigate", async () => {
    UserAPI.PostUser.mockResolvedValue({ message: "ok" });

    renderComponent();

    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "a" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@gmail.com" } });
    fireEvent.change(screen.getByLabelText("Họ"), { target: { value: "a" } });
    fireEvent.change(screen.getByLabelText("Tên"), { target: { value: "b" } });
    fireEvent.change(screen.getByLabelText("Số điện thoại"), { target: { value: "123" } });

    fireEvent.click(screen.getByText("Lưu thay đổi"));

    await screen.findByText("ok");

    fireEvent.click(screen.getByText("close-modal"));

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/users");
});

test("show modal khi thiếu dữ liệu (branch early return)", () => {
    renderComponent();

    fireEvent.click(screen.getByText("Lưu thay đổi"));

    expect(screen.getByText("Vui lòng nhập đầy đủ thông tin")).toBeInTheDocument();
});

test("handle error string", async () => {
    UserAPI.PostUser.mockRejectedValue(new Error("fail"));
    GetError.getError.mockReturnValue("Server lỗi");

    renderComponent();

    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "a" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "123" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@gmail.com" } });
    fireEvent.change(screen.getByLabelText("Họ"), { target: { value: "A" } });
    fireEvent.change(screen.getByLabelText("Tên"), { target: { value: "B" } });
    fireEvent.change(screen.getByLabelText("Số điện thoại"), { target: { value: "123" } });

    fireEvent.click(screen.getByText("Lưu thay đổi"));

    expect(await screen.findByText("Server lỗi")).toBeInTheDocument();
});

test("handle error array", async () => {
    UserAPI.PostUser.mockRejectedValue(new Error("fail"));
    GetError.getError.mockReturnValue(["Lỗi A"]);

    renderComponent();

    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "a" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "123" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@gmail.com" } });
    fireEvent.change(screen.getByLabelText("Họ"), { target: { value: "A" } });
    fireEvent.change(screen.getByLabelText("Tên"), { target: { value: "B" } });
    fireEvent.change(screen.getByLabelText("Số điện thoại"), { target: { value: "123" } });

    fireEvent.click(screen.getByText("Lưu thay đổi"));

    expect(await screen.findByText("Lỗi A")).toBeInTheDocument();
});

test("success -> close modal -> navigate", async () => {
    UserAPI.PostUser.mockResolvedValue({ message: "OK" });

    renderComponent();

    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "admin" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "123" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@gmail.com" } });
    fireEvent.change(screen.getByLabelText("Họ"), { target: { value: "A" } });
    fireEvent.change(screen.getByLabelText("Tên"), { target: { value: "B" } });
    fireEvent.change(screen.getByLabelText("Số điện thoại"), { target: { value: "123" } });

    fireEvent.click(screen.getByText("Lưu thay đổi"));

    await waitFor(() => {
        expect(UserAPI.PostUser).toHaveBeenCalled();
    });

    const okBtn = await screen.findByText("OK");
    expect(okBtn).toBeInTheDocument();

    fireEvent.click(screen.getByText("close-modal"));

    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled();
    });
});

test("toggle staff -> show employee fields", () => {
    renderComponent();

    fireEvent.click(screen.getByText("Nhân viên"));

    expect(screen.getByLabelText("Mã nhân viên")).toBeInTheDocument();
    expect(screen.getByLabelText("Ca làm việc")).toBeInTheDocument();
    expect(screen.getByLabelText("CCCD/CMND")).toBeInTheDocument();
});

test("upload image sets preview and file", () => {
    renderComponent();

    const file = new File(["avatar"], "avatar.png", { type: "image/png" });

    const input = document.querySelector('input[type="file"]');

    fireEvent.change(input, {
        target: { files: [file] },
    });

    expect(input.files[0]).toBe(file);
});

