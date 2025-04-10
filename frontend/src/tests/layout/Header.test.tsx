import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/layouts/block/Header";
import { useAuthStore } from "@/hooks/useAuthStore";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

Object.assign(global, { TextEncoder, TextDecoder });

jest.mock("@/hooks/useAuthStore");

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Header", () => {
  const mockLogout = jest.fn();
  const mockRestoreSession = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { name: "テストユーザー" },
      logout: mockLogout,
      restoreSession: mockRestoreSession,
    });
  });

  it("ログイン状態が表示される", () => {
    renderWithRouter(<Header />);
    expect(
      screen.getByText("ログイン中: テストユーザーさん")
    ).toBeInTheDocument();
    expect(screen.getByText("ログアウト")).toBeInTheDocument();
  });

  it("ハンバーガーメニューを押下するとメニューが表示される", async () => {
    renderWithRouter(<Header />);

    const menuButton = screen.getByRole("button");
    fireEvent.click(menuButton);

    expect(screen.getByText("資材管理")).toBeInTheDocument();
  });

  it("「工場管理くん」を押下でトップ画面に遷移する", async () => {
    renderWithRouter(<Header />);

    const menuButton = screen.getByRole("button");
    fireEvent.click(menuButton);

    const factoryMenu = screen.getByText("工場管理くん");
    fireEvent.click(factoryMenu);

    expect(window.location.pathname).toBe("/");
  });

  it("資材管理を押下で資材管理画面に遷移する", async () => {
    renderWithRouter(<Header />);

    fireEvent.click(screen.getByRole("button"));
    const materialMenu = await screen.findByRole("menuitem", {
      name: "資材管理",
    });
    fireEvent.click(materialMenu);

    expect(window.location.pathname).toBe("/");
  });

  it("受注管理を押下で受注管理画面に遷移する", async () => {
    renderWithRouter(<Header />);

    fireEvent.click(screen.getByRole("button"));
    const orderMenu = await screen.findByRole("menuitem", {
      name: "受注管理",
    });
    fireEvent.click(orderMenu);

    expect(window.location.pathname).toBe("/");
  });

  it("生産計画を押下で生産計画画面に遷移する", async () => {
    renderWithRouter(<Header />);

    fireEvent.click(screen.getByRole("button"));
    const productionMenu = await screen.findByRole("menuitem", {
      name: "生産計画",
    });
    fireEvent.click(productionMenu);

    expect(window.location.pathname).toBe("/");
  });

  it("勤怠管理を押下で勤怠管理画面に遷移する", async () => {
    renderWithRouter(<Header />);

    fireEvent.click(screen.getByRole("button"));
    const attendanceMenu = await screen.findByRole("menuitem", {
      name: "勤怠管理",
    });
    fireEvent.click(attendanceMenu);

    expect(window.location.pathname).toBe("/");
  });

  it("不具合情報を押下で不具合情報画面に遷移する", async () => {
    renderWithRouter(<Header />);

    fireEvent.click(screen.getByRole("button"));
    const orderMenu = await screen.findByRole("menuitem", {
      name: "不具合情報",
    });
    fireEvent.click(orderMenu);

    expect(window.location.pathname).toBe("/");
  });

  it("社内メールを押下で社内メール画面に遷移する", async () => {
    renderWithRouter(<Header />);

    fireEvent.click(screen.getByRole("button"));
    const orderMenu = await screen.findByRole("menuitem", {
      name: "社内メール",
    });
    fireEvent.click(orderMenu);

    expect(window.location.pathname).toBe("/");
  });

  it("ログアウトを押すと確認ダイアログが表示される", async () => {
    renderWithRouter(<Header />);

    const menuButton = screen.getByRole("button");
    fireEvent.click(menuButton);

    const logoutMenu = await screen.findByRole("menuitem", {
      name: "ログアウト",
    });
    fireEvent.click(logoutMenu);

    expect(screen.getByText("ログアウトしますか？")).toBeInTheDocument();
  });

  it("ダイアログでログアウトを押すと logout と restoreSession が呼ばれる", async () => {
    const mockLogout = jest.fn();
    const mockRestoreSession = jest.fn();

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { name: "テストユーザー" },
      logout: mockLogout,
      restoreSession: mockRestoreSession,
    });

    renderWithRouter(<Header />);

    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("ログアウト"));

    const confirmDialog = await screen.findByText("ログアウトしますか？");
    expect(confirmDialog).toBeInTheDocument();

    const logoutButtons = screen.getAllByText("ログアウト");
    fireEvent.click(logoutButtons[1]);

    expect(mockRestoreSession).toHaveBeenCalled();
  });
});
