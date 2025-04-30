import React, { useEffect, useState } from "react";
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
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useProductionStore } from "@/hooks/useProductionStore";
import { ProductionPlanRecord } from "@/types/production";

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
    setCurrentEditTaskId,
    currentEditTaskId,
    updateProductionPlanRecord,
    actualStartDate,
    actualEndDate,
    setActualStartDate,
    setActualEndDate,
    moveUp,
    moveDown,
    setChartStartDate,
    setChartEndDate,
  } = useProductionStore();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isPeriodModalOpen,
    onOpen: onPeriodModalOpen,
    onClose: onPeriodModalClose,
  } = useDisclosure();

  const [periodStartDate, setPeriodStartDate] = useState(
    chartStartDate.toISOString().slice(0, 10)
  );
  const [periodEndDate, setPeriodEndDate] = useState(
    (() => {
      const endDate = new Date(chartStartDate);
      endDate.setDate(endDate.getDate() + totalDays - 1);
      return endDate.toISOString().slice(0, 10);
    })()
  );

  useEffect(() => {
    getProductionPlanList();
  }, [getProductionPlanList]);

  /**
   * タスクを編集する
   * @param record 編集するタスク
   */
  const handleEditTask = (record: ProductionPlanRecord) => {
    setTaskTitle(record.title);
    setTaskStartDate(record.planned_start_date.toISOString().slice(0, 10));
    setTaskEndDate(record.planned_end_date.toISOString().slice(0, 10));
    setActualStartDate(
      record.actual_start_date
        ? record.actual_start_date.toISOString().slice(0, 10)
        : ""
    );
    setActualEndDate(
      record.actual_end_date
        ? record.actual_end_date.toISOString().slice(0, 10)
        : ""
    );
    setCurrentEditTaskId(record.id);
    onOpen();
  };

  /**
   * タスクを保存する
   */
  const handleSaveTask = () => {
    if (!taskTitle || !taskStartDate || !taskEndDate) return;

    if (currentEditTaskId === null) {
      // 新規追加モード
      addProductionPlanRecord();
    } else {
      // 編集モード
      updateProductionPlanRecord();
    }
  };

  /**
   * 値を初期化してモーダルを開く
   */
  const handleOpenModal = () => {
    setTaskTitle("");
    setTaskStartDate("");
    setTaskEndDate("");
    setActualStartDate("");
    setActualEndDate("");
    onOpen();
  };

  /**
   * タスクを削除する
   * TODO: 論理削除処理をAPIで実装する
   */
  const handleDeleteTask = () => {
    console.log("削除", currentEditTaskId);
    onClose();
  };

  /**
   * 表示期間変更モーダーを開く
   */
  const handleOpenChartPeriodModal = () => {
    onPeriodModalOpen();
  };

  /**
   * 表示期間を変更して生産計画を再取得する
   */
  const handleSaveChartPeriod = () => {
    const startDate = new Date(periodStartDate);
    const endDate = new Date(periodEndDate);
    setChartStartDate(startDate);
    setChartEndDate(endDate);
    onPeriodModalClose();
    getProductionPlanList();
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
          <Button colorScheme="teal" onClick={handleOpenModal} mr={4}>
            タスク追加
          </Button>
          <Button colorScheme="teal" onClick={handleOpenChartPeriodModal}>
            表示期間を変更
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
                  開始予定日
                </Text>
                <Input
                  type="date"
                  value={taskStartDate}
                  onChange={(e) => setTaskStartDate(e.target.value)}
                />
              </Box>
              <Box mb={4}>
                <Text fontSize="sm" mb={1}>
                  終了予定日
                </Text>
                <Input
                  type="date"
                  value={taskEndDate}
                  onChange={(e) => setTaskEndDate(e.target.value)}
                />
              </Box>
              {currentEditTaskId !== null && (
                <>
                  <Box mb={4}>
                    <Text fontSize="sm" mb={1}>
                      実績開始日
                    </Text>
                    <Input
                      type="date"
                      value={actualStartDate}
                      onChange={(e) => setActualStartDate(e.target.value)}
                    />
                  </Box>
                  <Box mb={4}>
                    <Text fontSize="sm" mb={1}>
                      実績終了日
                    </Text>
                    <Input
                      type="date"
                      value={actualEndDate}
                      onChange={(e) => setActualEndDate(e.target.value)}
                    />
                  </Box>
                </>
              )}
            </ModalBody>
            <ModalFooter display="flex" justifyContent="space-between">
              <Box>
                <Button colorScheme="teal" mr={3} onClick={handleSaveTask}>
                  保存
                </Button>
                <Button onClick={onClose}>キャンセル</Button>
              </Box>
              {currentEditTaskId !== null && (
                <Button colorScheme="red" onClick={handleDeleteTask}>
                  削除
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* 表示期間変更モーダル */}
        <Modal isOpen={isPeriodModalOpen} onClose={onPeriodModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>表示期間を変更</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mb={4}>
                <FormLabel>開始日</FormLabel>
                <Input
                  type="date"
                  value={periodStartDate}
                  onChange={(e) => setPeriodStartDate(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>終了日</FormLabel>
                <Input
                  type="date"
                  value={periodEndDate}
                  onChange={(e) => setPeriodEndDate(e.target.value)}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" mr={3} onClick={handleSaveChartPeriod}>
                保存
              </Button>
              <Button onClick={onPeriodModalClose}>キャンセル</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* スクロール可能エリア */}
        <Box overflowX="auto">
          <Grid
            templateColumns={`200px repeat(${totalDays}, 50px)`}
            templateRows={`repeat(${
              productionPlanList.records.length * 2
            }, auto)`}
            gap={0}
            minWidth="800px"
          >
            {/* ヘッダー */}
            <GridItem
              p={2}
              borderBottom="1px"
              borderRight="1px"
              borderColor="gray.200"
              rowSpan={2}
            >
              <Text fontWeight="bold">タスク</Text>
            </GridItem>
            {Array.from({ length: totalDays }, (_, i) => (
              <GridItem
                key={`header-${i}`}
                p={2}
                borderBottom="1px"
                borderRight="1px"
                borderColor="gray.200"
                colSpan={1}
                rowSpan={2}
              >
                <Text fontSize="xs" textAlign="center">
                  {(() => {
                    const currentDate = new Date(chartStartDate);
                    currentDate.setDate(chartStartDate.getDate() + i);
                    return `${
                      currentDate.getMonth() + 1
                    }/${currentDate.getDate()}`;
                  })()}
                </Text>
              </GridItem>
            ))}

            {/* レコード一覧 */}
            {productionPlanList.records.map((record, index) => (
              <React.Fragment key={record.id}>
                {/* タイトル（rowSpan=2） */}
                <GridItem
                  rowSpan={2}
                  p={2}
                  borderBottom="1px"
                  borderRight="1px"
                  borderColor="gray.200"
                  bg={index % 2 === 1 ? "green.50" : "white"}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Button size="xs" onClick={() => moveUp(record.id)} mb={1}>
                    ↑
                  </Button>
                  <Text
                    fontSize="sm"
                    textAlign="center"
                    cursor="pointer"
                    onClick={() => handleEditTask(record)}
                    _hover={{ bg: "gray.100" }}
                  >
                    {record.title}
                  </Text>
                  <Button size="xs" onClick={() => moveDown(record.id)} mt={1}>
                    ↓
                  </Button>
                </GridItem>

                {/* 予定ガントバー（1行目） */}
                {Array.from({ length: totalDays }, (_: unknown, i: number) => {
                  const plannedStart = dateToDayIndex(
                    new Date(record.planned_start_date)
                  );
                  const plannedEnd = dateToDayIndex(
                    new Date(record.planned_end_date)
                  );
                  const isPlanned =
                    plannedStart !== null &&
                    plannedEnd !== null &&
                    i >= plannedStart &&
                    i <= plannedEnd;
                  return (
                    <GridItem
                      key={`planned-${record.id}-${i}`}
                      p={2}
                      borderBottom="1px"
                      borderRight="1px"
                      borderColor="gray.200"
                      display="flex"
                      alignItems="center"
                      bg={index % 2 === 1 ? "green.50" : "white"}
                      _hover={{ bg: "gray.100" }}
                      cursor="pointer"
                      onClick={() => handleEditTask(record)}
                    >
                      {isPlanned ? (
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

                {/* 実績ガントバー（2行目） */}
                {Array.from({ length: totalDays }, (_: unknown, i: number) => {
                  const actualStart = record.actual_start_date
                    ? dateToDayIndex(new Date(record.actual_start_date))
                    : null;
                  const actualEnd = record.actual_end_date
                    ? dateToDayIndex(new Date(record.actual_end_date))
                    : null;
                  const isActual =
                    actualStart !== null &&
                    actualEnd !== null &&
                    i >= actualStart &&
                    i <= actualEnd;
                  return (
                    <GridItem
                      key={`actual-${record.id}-${i}`}
                      p={2}
                      borderBottom="1px"
                      borderRight="1px"
                      borderColor="gray.200"
                      display="flex"
                      alignItems="center"
                      bg={index % 2 === 1 ? "green.50" : "white"}
                      cursor="pointer"
                      onClick={() => handleEditTask(record)}
                      _hover={{ bg: "gray.100" }}
                    >
                      {isActual ? (
                        <Box
                          bg="blue.400"
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
