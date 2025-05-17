import { render, screen, fireEvent } from "@testing-library/react";
import MaterialsReceive from "@/pages/MaterialsReceive";
import { useMaterialStore } from "@/hooks/useMaterialStore";
import { BrowserRouter } from "react-router-dom";

const mockData = [
  {
    id: 1,
    material_name: "テスト資材A",
    stock_qty: 10,
    material_price: 100,
    order_suggestion_qty: 5,
  },
];

const mockGetMaterialList = jest.fn();
const mockPutMaterialReceiveStock = jest.fn();

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

const renderComponent = () =>
  render(
    <BrowserRouter>
      <MaterialsReceive />
    </BrowserRouter>
  );

describe("MaterialsReceive page", () => {
  beforeEach(() => {
    (useMaterialStore as unknown as jest.Mock).mockReturnValue({
      materialList: mockData,
      getMaterialList: mockGetMaterialList,
      putMaterialReceiveStock: mockPutMaterialReceiveStock,
    });
  });

  it("初回レンダリング時に getMaterialList が呼ばれる", () => {
    renderComponent();
    expect(mockGetMaterialList).toHaveBeenCalled();
  });

  it("テーブルに資材名が表示される", () => {
    renderComponent();
    expect(screen.getByText("テスト資材A")).toBeInTheDocument();
  });

  it("「処理」ボタンを押すとモーダルが表示される", () => {
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: "処理" }));
    expect(screen.getByText("資材の受け入れ")).toBeInTheDocument();
  });

  it("数量を入力して「受け入れ」ボタンを押すと putMaterialReceiveStock が呼ばれる", () => {
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: "処理" }));

    const input = screen.getByPlaceholderText("数量を入力");
    fireEvent.change(input, { target: { value: "3" } });

    const submitButton = screen.getByRole("button", { name: "受け入れ" });
    fireEvent.click(submitButton);

    expect(mockPutMaterialReceiveStock).toHaveBeenCalledWith(1, 3);
  });
});
