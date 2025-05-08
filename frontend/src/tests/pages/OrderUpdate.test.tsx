import { render, screen } from "@testing-library/react";
import { useOrderStore } from "@/hooks/useOrderStore";
import OrderUpdate from "@/pages/OrderUpdate";
import { MemoryRouter, Routes, Route } from "react-router-dom";
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
    getOrder: jest.fn(() => Promise.resolve()),
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
    (useOrderStore as unknown as jest.Mock).mockReturnValue({
      ...setMock,
      order: {
        id: 123,
        customer_name: "モック顧客",
        order_number: "MOCK-123",
        order_date: "2025-04-22",
        product_name: "モック商品",
        quantity: 10,
        price: 5000,
        deadline: "2025-05-01",
        note: "メモ",
      },
    });
  });

  describe("OrderUpdate", () => {
    it("URLパラメータから取得したidをOrderFormに渡す", () => {
      render(
        <MemoryRouter initialEntries={["/order/123/update"]}>
          <Routes>
            <Route path="/order/:id/update" element={<OrderUpdate />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId("order-form")).toBeInTheDocument();
    });
  });

  it("ページが表示される", () => {
    render(
      <BrowserRouter>
        <OrderUpdate />
      </BrowserRouter>
    );
    expect(screen.getByText("顧客名")).toBeInTheDocument();
    expect(screen.getByText("注文番号")).toBeInTheDocument();
    expect(screen.getByText("注文日")).toBeInTheDocument();
    expect(screen.getByText("商品名")).toBeInTheDocument();
    expect(screen.getByText("数量")).toBeInTheDocument();
    expect(screen.getByText("価格")).toBeInTheDocument();
    expect(screen.getByText("納期")).toBeInTheDocument();
  });
});
