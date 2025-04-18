import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useState } from "react";
import { GenericTableProps } from "@/domain/common/generic-table";
import { MaterialUseStock } from "@/domain/material/list";

type MaterialUseStockTableProps = GenericTableProps<MaterialUseStock>;

function MaterialUseStockTable({ columns, data }: MaterialUseStockTableProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState("");

  const handleUseStock = (id: number) => {
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
                      {col.accessor === "use_stock" ? (
                        <Button
                          size="sm"
                          colorScheme="teal"
                          onClick={() => handleUseStock(row.id)}
                        >
                          払い出し
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>在庫の払い出し</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>数量</FormLabel>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="数量を入力"
              />
            </FormControl>
            <Button colorScheme="teal" onClick={handleSubmit}>
              登録
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default MaterialUseStockTable;