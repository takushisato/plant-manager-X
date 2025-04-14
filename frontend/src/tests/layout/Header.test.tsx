import { render, screen, fireEvent, act } from "@testing-library/react";
import Header from "@/layouts/block/Header";
import { useAuthStore } from "@/hooks/useAuthStore";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

Object.assign(global, { TextEncoder, TextDecoder });

Object.defineProperty(window, "scrollTo", {
  value: jest.fn(),
  writable: true,
});

jest.mock("@/hooks/useAuthStore");

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Header Accordion Menu", () => {
  const mockLogout = jest.fn();
  const mockRestoreSession = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: {
        name: "テストユーザー",
        permission: { master_data_access: true },
      },
      logout: mockLogout,
      restoreSession: mockRestoreSession,
    });
  });

  it("ログイン状態が表示される", () => {
    renderWithRouter(<Header />);
    expect(
      screen.getByText("ログイン中: テストユーザーさん")
    ).toBeInTheDocument();
  });

  it("アコーディオンタイトルが表示される（資材管理など）", async () => {
    renderWithRouter(<Header />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });

    expect(await screen.findByText("資材管理")).toBeInTheDocument();
    expect(screen.getByText("受注管理")).toBeInTheDocument();
    expect(screen.getByText("生産計画管理")).toBeInTheDocument();
  });

  it("資材管理を開くと小項目（資材一覧など）が表示される", async () => {
    renderWithRouter(<Header />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
      fireEvent.click(await screen.findByText("資材管理"));
    });

    expect(await screen.findByText("資材一覧")).toBeInTheDocument();
    expect(screen.getByText("資材登録")).toBeInTheDocument();
  });

  it("小項目をクリックで画面遷移（ダミーURLで検証）", async () => {
    renderWithRouter(<Header />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
      fireEvent.click(await screen.findByText("資材管理"));
    });

    const link = await screen.findByRole("link", { name: "資材一覧" });
    expect(link).toHaveAttribute("href", "/material");
  });

  it("ログアウトボタン押下で確認ダイアログが出る", async () => {
    renderWithRouter(<Header />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
      fireEvent.click(await screen.findByText("ログアウト"));
    });

    expect(await screen.findByText("ログアウトしますか？")).toBeInTheDocument();
  });

  it("確認ダイアログでログアウトを押すと関数が呼ばれる", async () => {
    renderWithRouter(<Header />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
      fireEvent.click(await screen.findByText("ログアウト"));
    });

    const confirmButton = await screen.findByRole("button", {
      name: "ログアウト",
    });
    await act(async () => {
      await fireEvent.click(confirmButton);
    });

    expect(mockLogout).toHaveBeenCalled();
    expect(mockRestoreSession).toHaveBeenCalled();
  });
});
