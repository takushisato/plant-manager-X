import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import LoginForm from "@/components/login/LoginForm";
import { BrowserRouter } from "react-router-dom";
import { useAuthStore } from "@/hooks/useAuthStore";

jest.mock("@/hooks/useAuthStore", () => ({
  useAuthStore: jest.fn(),
}));

jest.mock("@chakra-ui/react", () => {
  const original = jest.requireActual("@chakra-ui/react");
  return {
    ...original,
    useToast: () => jest.fn(),
  };
});

const mockLogin = jest.fn();

beforeEach(() => {
  (useAuthStore as unknown as jest.Mock).mockReturnValue({ login: mockLogin });
});

const renderComponent = () =>
  render(
    <BrowserRouter>
      <LoginForm />
    </BrowserRouter>
  );

describe("LoginForm", () => {
  it("フォーム項目が表示される", () => {
    renderComponent();
    expect(screen.getByLabelText(/メールアドレス/)).toBeInTheDocument();
    expect(screen.getByLabelText(/パスワード/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ログイン" })).toBeDisabled();
  });

  it("メールとパスワードを入力するとボタンが有効になる", () => {
    renderComponent();
    fireEvent.change(screen.getByLabelText(/メールアドレス/), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/パスワード/), {
      target: { value: "password123" },
    });
    expect(screen.getByRole("button", { name: "ログイン" })).toBeEnabled();
  });

  it("ログイン成功時に login が呼ばれる", async () => {
    mockLogin.mockResolvedValueOnce({});
    renderComponent();

    fireEvent.change(screen.getByLabelText(/メールアドレス/), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/パスワード/), {
      target: { value: "password123" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "ログイン" }));
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  it("ログイン失敗時にエラーログが出る", async () => {
    console.error = jest.fn();
    mockLogin.mockRejectedValueOnce(new Error("invalid credentials"));

    renderComponent();

    fireEvent.change(screen.getByLabelText(/メールアドレス/), {
      target: { value: "fail@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/パスワード/), {
      target: { value: "wrong" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "ログイン" }));
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });
});
