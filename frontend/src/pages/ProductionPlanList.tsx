import Layout from "@/layouts/Layout";
import { Box, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { productionPlanList } from "@/fixtures/production";

const chartStartDate = new Date("2025-05-01");
const chartEndDate = new Date("2025-05-20");
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
        <Grid templateColumns="200px repeat(20, 1fr)" gap={1}>
          <GridItem>
            <Text fontWeight="bold">タスク</Text>
          </GridItem>
          {Array.from({ length: totalDays }, (_, i) => (
            <GridItem key={i}>
              <Text fontSize="xs" textAlign="center">
                {i + 1}
              </Text>
            </GridItem>
          ))}
          {productionPlanList.records.map((record) => (
            <React.Fragment key={record.id}>
              <GridItem key={`${record.id}-title`}>
                <Text>{record.title}</Text>
              </GridItem>

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
    </Layout>
  );
};

export default ProductionPlanList;
