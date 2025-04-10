import { render, screen } from "@testing-library/react";
import Layout from "@/layouts/Layout";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

describe("Layout", () => {
  it("Header, children, Footer が表示される", () => {
    render(
      <BrowserRouter>
        <Layout>
          <p>これはテスト用の子要素です</p>
        </Layout>
      </BrowserRouter>
    );

    expect(screen.getByText("工場管理くん")).toBeInTheDocument();
    expect(screen.getByText("これはテスト用の子要素です")).toBeInTheDocument();
    expect(
      screen.getByText("© 2025 工場管理くん制作委員会")
    ).toBeInTheDocument();
  });
});
