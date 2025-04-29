import Layout from "@/layouts/Layout";
import { Box, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useProductionStore } from "@/hooks/useProductionStore";

const ProductionPlanList = () => {
  const {
    productionPlanList,
    totalDays,
    chartStartDate,
    getProductionPlanList,
    dateToDayIndex,
  } = useProductionStore();

  useEffect(() => {
    getProductionPlanList();
  }, [getProductionPlanList]);

  return (
    <Layout>
      <Box p={8}>
        <Heading mb={6}>
          {productionPlanList.organization.organization_name}{" "}
          生産計画ガントチャート
        </Heading>

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
            {productionPlanList.records.map((record) => (
              <React.Fragment key={record.id}>
                {/* タイトル */}
                <GridItem
                  p={2}
                  borderBottom="1px"
                  borderRight="1px"
                  borderColor="gray.200"
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
