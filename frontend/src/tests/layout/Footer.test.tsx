import { render, screen } from "@testing-library/react";
import Footer from "@/layouts/block/Footer";
import "@testing-library/jest-dom";

describe("Footer", () => {
  it("フッターが正しく表示される", () => {
    render(<Footer />);

    // テキストが表示されているかを確認
    expect(
      screen.getByText("© 2025 工場管理くん制作委員会")
    ).toBeInTheDocument();

    // 追加: footer要素として存在するか
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
