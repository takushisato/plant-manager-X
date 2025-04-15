import { render, screen, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import "@testing-library/jest-dom";

jest.mock("js-cookie", () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockReturnValue(undefined),
    set: jest.fn(),
    remove: jest.fn(),
  },
}));

describe("404 NotFound Page", () => {
  it("存在しないパスにアクセスすると404ページが表示される", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/non-existent-route"]}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(await screen.findByText("404")).toBeInTheDocument();
    expect(
      await screen.findByText("ページが見つかりません")
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: "トップに戻る" })
    ).toBeInTheDocument();
  });
});
