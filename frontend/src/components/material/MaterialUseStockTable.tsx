import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
} from "@chakra-ui/react";
import { GenericTableProps } from "@/domain/common/generic-table";
import { MaterialUseStock } from "@/domain/material/list";

type MaterialUseStockTableProps = GenericTableProps<MaterialUseStock>;

const handleUseStock = (id: number) => {
  alert(id);
};

function MaterialUseStockTable({ columns, data }: MaterialUseStockTableProps) {
  return (
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
  );
}

export default MaterialUseStockTable;
