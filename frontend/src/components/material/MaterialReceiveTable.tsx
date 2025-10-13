import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button, useDisclosure, FormControl } from "@chakra-ui/react";
import { useState } from "react";
import { GenericTableProps } from "@/types/common/generic-table";
import { MaterialReceiveStock } from "@/types/material";
import GenericModal from "@/components/common/GenericModal";
import InputWithTooltip from "@/components/common/InputWithTooltip";

type MaterialReceiveTableProps = GenericTableProps<MaterialReceiveStock> & {
  putMaterialReceiveStock: (id: number, quantity: number) => void;
  getMaterialList: () => void;
};

function MaterialReceiveTable({ columns, data, putMaterialReceiveStock, getMaterialList }: MaterialReceiveTableProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState("");

  /**
   * 受け入れ処理を実行するモーダルを開く
   *
   * @param id 資材ID
   */
  const handleReceiveStock = (id: number) => {
    setSelectedId(id);
    onOpen();
  };

  /**
   * 受け入れ処理を実行する
   */
  const handleSubmit = async () => {
    if (selectedId) {
      await putMaterialReceiveStock(selectedId, Number(quantity));
    }
    setQuantity("");
    await getMaterialList();
    onClose();
  };

  return (
    <>
      <TableContainer maxW="1200px" mx="auto">
        <Table variant="striped" colorScheme="teal" size="sm">
          <Thead>
            <Tr>
              {columns.map((col) => (
                <Th key={col.accessor as string}>{col.header}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {columns.map((col) => {
                  const cellValue = row[col.accessor];
                  return (
                    <Td key={col.accessor as string}>
                      {col.accessor === "receive_stock" ? (
                        <Button size="sm" colorScheme="teal" onClick={() => handleReceiveStock(row.id)}>
                          処理
                        </Button>
                      ) : (
                        cellValue
                      )}
                    </Td>
                  );
                })}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <GenericModal
        isOpen={isOpen}
        onClose={onClose}
        title="資材の受け入れ"
        onSubmit={handleSubmit}
        submitLabel="受け入れ"
      >
        <FormControl mb={4}>
          <InputWithTooltip
            label="数量"
            name="quantity"
            tooltip="在庫として受け入れる数量を半角数字で入力してください"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="数量を入力"
          />
        </FormControl>
      </GenericModal>
    </>
  );
}

export default MaterialReceiveTable;
