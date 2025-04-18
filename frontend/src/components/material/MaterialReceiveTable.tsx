import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useState } from "react";
import { GenericTableProps } from "@/domain/common/generic-table";
import { MaterialReceiveStock } from "@/domain/material/list";
import GenericModal from "@/components/common/GenericModal";

type MaterialReceiveTableProps = GenericTableProps<MaterialReceiveStock>;

function MaterialReceiveTable({ columns, data }: MaterialReceiveTableProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState("");

  const handleReceiveStock = (id: number) => {
    setSelectedId(id);
    onOpen();
  };

  const handleSubmit = () => {
    alert(`資材ID: ${selectedId}, 数量: ${quantity}`);
    onClose();
    setQuantity("");
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
                        <Button
                          size="sm"
                          colorScheme="teal"
                          onClick={() => handleReceiveStock(row.id)}
                        >
                          受け入れ
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
          <FormLabel>数量</FormLabel>
          <Input
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
