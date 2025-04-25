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
import { GenericTableProps } from "@/types/common/generic-table";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

function GenericTable<T extends Record<string, ReactNode>>({
  columns,
  data,
  onRowClick,
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
            <Tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              cursor={onRowClick ? "pointer" : "default"}
              _hover={onRowClick ? { bg: "teal.50" } : undefined}
            >
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
                      <Button
                        as="a"
                        href={`/attendance/${row.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        colorScheme="teal"
                      >
                        詳細
                      </Button>
                    )}
                    {col.accessor === "order_update_button" && (
                      <Button
                        as="a"
                        href={`/order/${row.id}/update`}
                        rel="noopener noreferrer"
                        size="sm"
                        colorScheme="teal"
                      >
                        更新
                      </Button>
                    )}
                    {col.accessor === "defect_detail_button" && (
                      <Button
                        as="a"
                        href={`/defect/${row.id}`}
                        rel="noopener noreferrer"
                        size="sm"
                        colorScheme="teal"
                      >
                        詳細
                      </Button>
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
