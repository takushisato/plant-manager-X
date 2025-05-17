import { render, screen, waitFor } from "@testing-library/react";
import Materials from "@/pages/Materials";
import { BrowserRouter } from "react-router-dom";
import { useMaterialStore } from "@/hooks/useMaterialStore";

jest.mock("js-cookie", () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockReturnValue(undefined),
    set: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock("@/hooks/useMaterialStore", () => ({
  useMaterialStore: jest.fn(),
}));

const mockGetMaterialList = jest.fn();

const mockMaterialList = [
  {
    id: 1,
    material_name: "テスト資材A",
    stock_qty: 100,
    material_price: 500,
    order_suggestion_qty: 20,
  },
  {
    id: 2,
    material_name: "テスト資材B",
    stock_qty: 50,
    material_price: 300,
    order_suggestion_qty: 10,
  },
];

beforeEach(() => {
  (useMaterialStore as unknown as jest.Mock).mockReturnValue({
    materialList: mockMaterialList,
    getMaterialList: mockGetMaterialList,
  });
});

const renderComponent = () =>
  render(
    <BrowserRouter>
      <Materials />
    </BrowserRouter>
  );

describe("Materials page", () => {
  it("初回レンダリング時に getMaterialList が呼ばれる", async () => {
    renderComponent();
    await waitFor(() => {
      expect(mockGetMaterialList).toHaveBeenCalled();
    });
  });

  it("資材名などのテーブル項目が表示される", async () => {
    renderComponent();

    expect(await screen.findByText("テスト資材A")).toBeInTheDocument();
    expect(screen.getByText("テスト資材B")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("300")).toBeInTheDocument();
  });

  it("テーブルのカラムが表示される", () => {
    renderComponent();

    expect(screen.getByText("資材名")).toBeInTheDocument();
    expect(screen.getByText("在庫数")).toBeInTheDocument();
    expect(screen.getByText("価格")).toBeInTheDocument();
    expect(screen.getByText("発注在庫数")).toBeInTheDocument();
  });
});
