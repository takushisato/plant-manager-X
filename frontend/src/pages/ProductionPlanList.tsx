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
import React, { useEffect } from "react";
import { useProductionStore } from "@/hooks/useProductionStore";
const ProductionPlanList = () => {
  const {
    productionPlanList,
    totalDays,
    chartStartDate,
    getProductionPlanList,
    dateToDayIndex,
    addProductionPlanRecord,
    taskTitle,
    taskStartDate,
    taskEndDate,
    setTaskTitle,
    setTaskStartDate,
    setTaskEndDate,
  } = useProductionStore();

  useEffect(() => {
    getProductionPlanList();
  }, [getProductionPlanList]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  /**
   * タスクを追加する
   * 追加のロジックはuseProductionStoreに記載
   */
  const handleAddTask = () => {
    if (!taskTitle || !taskStartDate || !taskEndDate) return;

    addProductionPlanRecord();

    setTaskTitle("");
    setTaskStartDate("");
    setTaskEndDate("");
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
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
              </Box>
              <Box mb={4}>
                <Text fontSize="sm" mb={1}>
                  開始日
                </Text>
                <Input
                  type="date"
                  value={taskStartDate}
                  onChange={(e) => setTaskStartDate(e.target.value)}
                />
              </Box>
              <Box mb={4}>
                <Text fontSize="sm" mb={1}>
                  終了日
                </Text>
                <Input
                  type="date"
                  value={taskEndDate}
                  onChange={(e) => setTaskEndDate(e.target.value)}
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
