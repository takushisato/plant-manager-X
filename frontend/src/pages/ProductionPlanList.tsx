import Layout from "@/layouts/Layout";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useProductionStore } from "@/hooks/useProductionStore";

const ProductionPlanList = () => {
  const {
    productionPlanList,
    totalDays,
    chartStartDate,
    getProductionPlanList,
    dateToDayIndex,
    addProductionPlanRecord,
  } = useProductionStore();

  useEffect(() => {
    getProductionPlanList();
  }, [getProductionPlanList]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const parseLocalDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day + 1);
  };

  const handleAddTask = () => {
    if (!title || !startDate || !endDate) return;

    const newRecord = {
      id: productionPlanList.records.length + 1,
      title: title,
      planned_start_date: parseLocalDate(startDate),
      planned_end_date: parseLocalDate(endDate),
      actual_start_date: null,
      actual_end_date: null,
      sort: productionPlanList.records.length + 1,
      note: "",
    };

    addProductionPlanRecord(newRecord);

    // 入力リセット
    setTitle("");
    setStartDate("");
    setEndDate("");
    onClose();
  };

  return (
    <Layout>
      <Box p={8}>
        <Heading mb={6}>
          {productionPlanList.organization.organization_name}{" "}
          生産計画ガントチャート
        </Heading>

        {/* 追加ボタン */}
        <Box mb={8}>
          <Button colorScheme="teal" onClick={onOpen}>
            タスク追加
          </Button>
        </Box>

        {/* モーダル */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>新しいタスクを追加</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box mb={4}>
                <Text fontSize="sm" mb={1}>
                  タイトル
                </Text>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Box>
              <Box mb={4}>
                <Text fontSize="sm" mb={1}>
                  開始日
                </Text>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Box>
              <Box mb={4}>
                <Text fontSize="sm" mb={1}>
                  終了日
                </Text>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Box>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="teal" mr={3} onClick={handleAddTask}>
                保存
              </Button>
              <Button onClick={onClose}>キャンセル</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* スクロール可能エリア */}
        <Box overflowX="auto">
          <Grid
            templateColumns={`200px repeat(${totalDays}, 50px)`}
            gap={0}
            minWidth="800px"
          >
            {/* ヘッダー */}
            <GridItem
              p={2}
              borderBottom="1px"
              borderRight="1px"
              borderColor="gray.200"
            >
              <Text fontWeight="bold">タスク</Text>
            </GridItem>
            {Array.from({ length: totalDays }, (_, i) => {
              const currentDate = new Date(chartStartDate);
              currentDate.setDate(chartStartDate.getDate() + i);
              return (
                <GridItem
                  key={i}
                  p={2}
                  borderBottom="1px"
                  borderRight="1px"
                  borderColor="gray.200"
                >
                  <Text fontSize="xs" textAlign="center">
                    {currentDate.getMonth() + 1}/{currentDate.getDate()}
                  </Text>
                </GridItem>
              );
            })}

            {/* レコード一覧 */}
            {productionPlanList.records.map((record, index) => (
              <React.Fragment key={record.id}>
                {/* タイトル */}
                <GridItem
                  p={2}
                  borderBottom="1px"
                  borderRight="1px"
                  borderColor="gray.200"
                  bg={index % 2 === 1 ? "green.50" : "white"}
                >
                  <Text>{record.title}</Text>
                </GridItem>

                {/* ガントバー */}
                {Array.from({ length: totalDays }, (_, i) => {
                  const plannedStart = dateToDayIndex(
                    new Date(record.planned_start_date)
                  );
                  const plannedEnd = dateToDayIndex(
                    new Date(record.planned_end_date)
                  );
                  const actualStart = record.actual_start_date
                    ? dateToDayIndex(new Date(record.actual_start_date))
                    : null;
                  const actualEnd = record.actual_end_date
                    ? dateToDayIndex(new Date(record.actual_end_date))
                    : null;

                  const isPlanned =
                    plannedStart !== null &&
                    plannedEnd !== null &&
                    i >= plannedStart &&
                    i <= plannedEnd;
                  const isActual =
                    actualStart !== null &&
                    actualEnd !== null &&
                    i >= actualStart &&
                    i <= actualEnd;

                  return (
                    <GridItem
                      key={`${record.id}-${i}`}
                      p={2}
                      borderBottom="1px"
                      borderRight="1px"
                      borderColor="gray.200"
                      display="flex"
                      alignItems="center"
                      bg={index % 2 === 1 ? "green.50" : "white"}
                    >
                      {isActual ? (
                        <Box
                          bg="blue.400"
                          height="8px"
                          borderRadius="full"
                          width="100%"
                        />
                      ) : isPlanned ? (
                        <Box
                          bg="green.400"
                          height="8px"
                          borderRadius="full"
                          width="100%"
                        />
                      ) : (
                        <Box height="8px" width="100%" />
                      )}
                    </GridItem>
                  );
                })}
              </React.Fragment>
            ))}
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
};

export default ProductionPlanList;
