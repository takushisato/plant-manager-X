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
import { ReactNode } from "react";
import { Link } from "react-router-dom";

function GenericTable<T extends Record<string, ReactNode>>({
  columns,
  data,
}: GenericTableProps<T>) {
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
                const isUrl =
                  typeof cellValue === "string" && cellValue.startsWith("http");

                return (
                  <Td key={col.accessor as string}>
                    {isUrl ? (
                      <Link to={new URL(cellValue).pathname}>
                        <Button size="sm" colorScheme="teal">
                          移動
                        </Button>
                      </Link>
                    ) : (
                      cellValue
                    )}
                    {col.accessor === "detail" && (
                      <Link to={`/attendance/${row.id}`}>
                        <Button size="sm" colorScheme="teal">
                          詳細
                        </Button>
                      </Link>
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

export default GenericTable;
