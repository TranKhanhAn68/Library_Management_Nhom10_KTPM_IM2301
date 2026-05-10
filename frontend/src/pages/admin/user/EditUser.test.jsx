import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Edituser from "./Edituser";
import { AuthContent } from "../../../utils/AuthContext";
import { UpdateUser, UserListByIDAPI } from "../../../services/UserAPI";

vi.mock("../../../services/UserAPI", () => ({
    UserListByIDAPI: vi.fn(),
    UpdateUser: vi.fn()
}));

vi.mock("../../../utils/GetError", () => ({
    getError: vi.fn(() => ["Update thất bại"])
}));

vi.mock("../../../components/Loading", () => ({
    default: ({ loading }) => <div>{loading && "Loading..."}</div>
}));

vi.mock("../../../components/BaseModal", () => ({
    default: ({ open, children, close }) =>
        open ? (
            <div>
                <div>{children}</div>
                <button onClick={close}>Close Modal</button>
            </div>
        ) : null
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");

    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({
            id: "1"
        })
    };
});


const mockUser = {
    username: "admin",
    email: "admin@gmail.com",
    first_name: "Tran",
    last_name: "An",
    phone_number: "0123456789",
    is_active: true,
    is_staff: true,
    is_superuser: false,
    employee_id: "EMP001",
    shift: "Morning",
    identity_card: "123456789",
    image: "test.jpg"
};

const renderUI = () => {
    return render(
        <AuthContent.Provider value={{ token: "fake-token" }}>
            <MemoryRouter initialEntries={["/dashboard/users/edit/1"]}>
                <Routes>
                    <Route path="/dashboard/users/edit/:id" element={<Edituser />} />
                </Routes>
            </MemoryRouter>
        </AuthContent.Provider>
    );
};

beforeEach(() => {
    vi.clearAllMocks();

    UserListByIDAPI.mockReturnValue([mockUser]);
});

test("render loading", () => {
    UserListByIDAPI.mockReturnValue([null]);

    renderUI();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test("render user information", async () => {
    renderUI();

    await waitFor(() => {
        expect(screen.getByDisplayValue("admin@gmail.com")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("Tran")).toBeInTheDocument();
    expect(screen.getByDisplayValue("An")).toBeInTheDocument();
    expect(screen.getByDisplayValue("0123456789")).toBeInTheDocument();
});

test("change input value", async () => {
    renderUI();

    const emailInput = await screen.findByDisplayValue("admin@gmail.com");

    fireEvent.change(emailInput, {
        target: {
            value: "new@gmail.com"
        }
    });

    expect(emailInput.value).toBe("new@gmail.com");
});

test("submit success", async () => {
    UpdateUser.mockResolvedValue({
        message: "Cập nhật thành công"
    });

    renderUI();

    const emailInput = await screen.findByDisplayValue("admin@gmail.com");

    fireEvent.change(emailInput, {
        target: {
            value: "test@gmail.com"
        }
    });

    fireEvent.click(screen.getByText("Lưu thay đổi"));

    await waitFor(() => {
        expect(UpdateUser).toHaveBeenCalled();
    });

    expect(screen.getByText("Cập nhật thành công")).toBeInTheDocument();
});

test("submit failed", async () => {
    UpdateUser.mockRejectedValue(new Error("Failed"));

    renderUI();

    fireEvent.click(screen.getByText("Lưu thay đổi"));

    await waitFor(() => {
        expect(UpdateUser).toHaveBeenCalled();
    });

    expect(screen.getByText("Update thất bại")).toBeInTheDocument();
});

test("validate required fields", async () => {
    renderUI();

    const emailInput = await screen.findByDisplayValue("admin@gmail.com");

    fireEvent.change(emailInput, {
        target: {
            value: ""
        }
    });

    fireEvent.click(screen.getByText("Lưu thay đổi"));

    await waitFor(() => {
        expect(screen.getByText("Vui lòng nhập đầy đủ thông tin")).toBeInTheDocument();
    });

    expect(UpdateUser).not.toHaveBeenCalled();
});

test("navigate when click cancel", async () => {
    renderUI();

    const cancelBtn = await screen.findByText("Hủy");

    fireEvent.click(cancelBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/users");
});

test("toggle checkbox", async () => {
    renderUI();

    const checkbox = await screen.findByRole("checkbox", {
        name: /kích hoạt/i
    });

    expect(checkbox.checked).toBe(true);

    fireEvent.click(checkbox);

    expect(checkbox.checked).toBe(false);
});

test("show employee fields when isStaff checked", async () => {
    renderUI();

    await waitFor(() => {
        expect(screen.getByDisplayValue("EMP001")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("Morning")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123456789")).toBeInTheDocument();
});

test("upload image preview", async () => {
    global.URL.createObjectURL = vi.fn(() => "preview-image");

    renderUI();

    const file = new File(["hello"], "avatar.png", {
        type: "image/png"
    });

    const input = document.querySelector('input[type="file"]');

    fireEvent.change(input, {
        target: {
            files: [file]
        }
    });

    await waitFor(() => {
        expect(global.URL.createObjectURL).toHaveBeenCalled();
    });
});


test("append password into formData", async () => {
    UpdateUser.mockResolvedValue({
        message: "Success"
    });

    const appendSpy = vi.spyOn(FormData.prototype, "append");

    renderUI();

    const passwordInput = await screen.findByLabelText(/password/i);
    fireEvent.change(passwordInput, {
        target: {
            value: "123456"
        }
    });

    fireEvent.click(screen.getByText("Lưu thay đổi"));

    await waitFor(() => {
        expect(UpdateUser).toHaveBeenCalled();
    });

    expect(appendSpy).toHaveBeenCalledWith("password", "123456");
});

test("append image into formData", async () => {
    UpdateUser.mockResolvedValue({
        message: "Success"
    });

    global.URL.createObjectURL = vi.fn(() => "preview");

    const appendSpy = vi.spyOn(FormData.prototype, "append");

    renderUI();

    const file = new File(["hello"], "avatar.png", {
        type: "image/png"
    });

    const input = document.querySelector('input[type="file"]');

    fireEvent.change(input, {
        target: {
            files: [file]
        }
    });

    fireEvent.click(screen.getByText("Lưu thay đổi"));

    await waitFor(() => {
        expect(UpdateUser).toHaveBeenCalled();
    });

    expect(appendSpy).toHaveBeenCalledWith("image", file);
});

test("close success modal and navigate", async () => {
    UpdateUser.mockResolvedValue({
        message: "Cập nhật thành công"
    });

    renderUI();

    fireEvent.click(await screen.findByText("Lưu thay đổi"));

    await waitFor(() => {
        expect(screen.getByText("Cập nhật thành công")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Close Modal"));

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/users");
});

test("close error modal without navigate", async () => {
    UpdateUser.mockRejectedValue(new Error("Failed"));

    renderUI();

    fireEvent.click(await screen.findByText("Lưu thay đổi"));

    await waitFor(() => {
        expect(screen.getByText("Update thất bại")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Close Modal"));

    expect(mockNavigate).not.toHaveBeenCalled();
});

test("hide employee fields when uncheck isStaff", async () => {
    renderUI();

    const staffCheckbox = await screen.findByRole("checkbox", {
        name: /nhân viên/i
    });

    expect(screen.getByDisplayValue("EMP001")).toBeInTheDocument();

    fireEvent.click(staffCheckbox);

    await waitFor(() => {
        expect(screen.queryByDisplayValue("EMP001")).not.toBeInTheDocument();
    });
});

test("toggle superuser checkbox", async () => {
    renderUI();

    const checkbox = await screen.findByRole("checkbox", {
        name: /quản trị tối cao/i
    });

    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);

    expect(checkbox.checked).toBe(true);
});

test("toggle active checkbox multiple times", async () => {
    renderUI();

    const checkbox = await screen.findByRole("checkbox", {
        name: /kích hoạt/i
    });

    fireEvent.click(checkbox);

    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);

    expect(checkbox.checked).toBe(true);
});

test("change employee fields", async () => {
    renderUI();

    const employeeInput = await screen.findByDisplayValue("EMP001");
    const shiftInput = screen.getByDisplayValue("Morning");
    const identityInput = screen.getByDisplayValue("123456789");

    fireEvent.change(employeeInput, {
        target: {
            value: "EMP999"
        }
    });

    fireEvent.change(shiftInput, {
        target: {
            value: "Night"
        }
    });

    fireEvent.change(identityInput, {
        target: {
            value: "987654321"
        }
    });

    expect(employeeInput.value).toBe("EMP999");
    expect(shiftInput.value).toBe("Night");
    expect(identityInput.value).toBe("987654321");
});

test("render preview image", async () => {
    renderUI();

    const image = await screen.findByAltText("Avatar");

    expect(image).toHaveAttribute("src", "test.jpg");
});

test("change first name last name and phone", async () => {
    renderUI();

    const firstNameInput = await screen.findByLabelText(/họ/i);
    const lastNameInput = screen.getByLabelText(/tên/i);
    const phoneInput = screen.getByLabelText(/số điện thoại/i);

    fireEvent.change(firstNameInput, {
        target: {
            value: "Nguyen"
        }
    });

    fireEvent.change(lastNameInput, {
        target: {
            value: "Binh"
        }
    });

    fireEvent.change(phoneInput, {
        target: {
            value: "0999999999"
        }
    });

    expect(firstNameInput.value).toBe("Nguyen");
    expect(lastNameInput.value).toBe("Binh");
    expect(phoneInput.value).toBe("0999999999");
});

test("do nothing when no image file selected", async () => {
    global.URL.createObjectURL = vi.fn();

    renderUI();

    const input = document.querySelector('input[type="file"]');

    fireEvent.change(input, {
        target: {
            files: []
        }
    });

    expect(global.URL.createObjectURL).not.toHaveBeenCalled();
});