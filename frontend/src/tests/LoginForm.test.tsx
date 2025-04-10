import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "@/components/login/LoginForm";
import { useAuthStore } from "@/hooks/useAuthStore";
import "@testing-library/jest-dom";

jest.mock("@/hooks/useAuthStore", () => ({
  useAuthStore: jest.fn(() => ({
    login: jest.fn(),
  })),
}));

describe("LoginForm", () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockImplementation(() => ({
      login: mockLogin,
    }));
  });

  it("フォームが正しく表示される", () => {
    render(<LoginForm />);

    expect(
      screen.getByRole("heading", { name: "ログイン" })
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("メールアドレス", { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("パスワード", { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "ログイン" })
    ).toBeInTheDocument();
  });

  it("メールアドレスとパスワードを入力できる", () => {
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("email@example.com");
    const passwordInput = screen.getByPlaceholderText("登録済みのパスワード");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("フォーム送信時に login が呼び出される", () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("email@example.com"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("登録済みのパスワード"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "ログイン" }));

    expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
  });
});
