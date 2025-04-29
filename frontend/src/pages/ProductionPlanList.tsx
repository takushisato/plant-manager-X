import Layout from "@/layouts/Layout";
import { Box, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { productionPlanList } from "@/fixtures/production";

const today = new Date();
const chartStartDate = new Date(today);
chartStartDate.setDate(today.getDate() - 30);

const chartEndDate = new Date(today);
chartEndDate.setDate(today.getDate() + 30);

const displayEndDate = new Date(today);
displayEndDate.setDate(today.getDate() + 20);

const totalDays =
  (chartEndDate.getTime() - chartStartDate.getTime()) / (1000 * 60 * 60 * 24) +
  1;

const dateToDayIndex = (dateStr: string | null) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return Math.floor(
    (date.getTime() - chartStartDate.getTime()) / (1000 * 60 * 60 * 24)
  );
};

const ProductionPlanList = () => {
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
            templateColumns={`200px repeat(${totalDays}, 40px)`}
            gap={1}
            minWidth="800px"
          >
            {/* ヘッダー */}
            <GridItem>
              <Text fontWeight="bold">タスク</Text>
            </GridItem>
            {Array.from({ length: totalDays }, (_, i) => {
              const currentDate = new Date(chartStartDate);
              currentDate.setDate(chartStartDate.getDate() + i);
              return (
                <GridItem key={i}>
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
                <GridItem>
                  <Text>{record.title}</Text>
                </GridItem>

                {/* ガントバー */}
                {Array.from({ length: totalDays }, (_, i) => {
                  const plannedStart = dateToDayIndex(
                    record.planned_start_date.toISOString()
                  );
                  const plannedEnd = dateToDayIndex(
                    record.planned_end_date.toISOString()
                  );
                  const actualStart = dateToDayIndex(
                    record.actual_start_date?.toISOString() ?? null
                  );
                  const actualEnd = dateToDayIndex(
                    record.actual_end_date?.toISOString() ?? null
                  );

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
                    <GridItem key={`${record.id}-${i}`}>
                      {isActual ? (
                        <Box bg="blue.400" height="8px" borderRadius="full" />
                      ) : isPlanned ? (
                        <Box bg="green.400" height="8px" borderRadius="full" />
                      ) : (
                        <Box height="8px" />
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
