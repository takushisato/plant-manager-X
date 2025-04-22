import { render, screen, fireEvent } from "@testing-library/react";
import { useOrderStore } from "@/hooks/useOrderStore";
import OrderCreate from "@/pages/OrderCreate";
import { BrowserRouter } from "react-router-dom";

jest.mock("@/hooks/useOrderStore");

jest.mock("@/hooks/useAuthStore", () => ({
  __esModule: true,
  useAuthStore: jest.fn(() => ({
    user: {
      name: "テストユーザー",
      permission: {
        material_access: true,
        staff_hub_access: false,
        can_manage_own_attendance: false,
        can_manage_all_attendance: false,
        can_view_production_plan: false,
        can_edit_production_plan: false,
        can_view_order: false,
        can_edit_order: false,
        can_view_defect: false,
        can_edit_defect: false,
      },
    },
    logout: jest.fn(),
    restoreSession: jest.fn(),
  })),
}));

describe("OrderForm", () => {
  const createOrderMock = jest.fn();
  const setMock = {
    setCustomerName: jest.fn(),
    setOrderNumber: jest.fn(),
    setOrderDate: jest.fn(),
    setProductName: jest.fn(),
    setQuantity: jest.fn(),
    setPrice: jest.fn(),
    setDeadline: jest.fn(),
    setNote: jest.fn(),
    createOrder: createOrderMock,
    getOrder: jest.fn(),
    customer_name: "",
    order_number: "",
    order_date: "",
    product_name: "",
    quantity: 0,
    price: 0,
    deadline: "",
    note: "",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useOrderStore as unknown as jest.Mock).mockReturnValue(setMock);
  });

  it("フォームが正しく表示される", () => {
    render(
      <BrowserRouter>
        <OrderCreate />
      </BrowserRouter>
    );

    expect(screen.getByLabelText("顧客名")).toBeInTheDocument();
    expect(screen.getByLabelText("注文番号")).toBeInTheDocument();
    expect(screen.getByLabelText("注文日")).toBeInTheDocument();
    expect(screen.getByLabelText("商品名")).toBeInTheDocument();
    expect(screen.getByLabelText("数量")).toBeInTheDocument();
    expect(screen.getByLabelText("価格")).toBeInTheDocument();
    expect(screen.getByLabelText("納期")).toBeInTheDocument();
    expect(screen.getByLabelText("備考")).toBeInTheDocument();
  });

  it("作成ボタンを押すと createOrder が呼ばれる", () => {
    render(
      <BrowserRouter>
        <OrderCreate />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: "作成" }));

    expect(createOrderMock).toHaveBeenCalled();
  });
});
