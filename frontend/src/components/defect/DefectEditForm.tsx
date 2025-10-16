import { Box, Button, FormControl, FormLabel, Textarea, VStack, Text, Divider } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useDefectStore } from "@/hooks/useDefectStore";
import { DefectItem } from "@/types/defect";

type DefectItemProps = {
  defectItem: DefectItem;
};

const DefectEditForm = ({ defectItem }: DefectItemProps) => {
  const { updateSubmission } = useDefectStore();
  const [submission, setSubmission] = useState("");

  useEffect(() => {
    setSubmission(defectItem.submission || "");
  }, [defectItem.submission]);

  /**
   * 対策を申請する
   *
   * @param e
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSubmission(defectItem.id, submission);
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <Box>
          <Text fontWeight="bold" mt={4}>
            発生日
          </Text>
          <Text>{defectItem.occurred_at_raw}</Text>
        </Box>
        <Divider />
        <Box>
          <Text fontWeight="bold">関連注文ID</Text>
          <Text>{defectItem.order}</Text>
        </Box>
        <Divider />
        <Box>
          <Text fontWeight="bold">不具合詳細</Text>
          <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
            <Text whiteSpace="pre-wrap" minH="400px">
              {defectItem.defect_detail}
            </Text>
          </Box>
        </Box>
        <FormControl>
          <FormLabel>対策</FormLabel>
          <Textarea
            name="submission"
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
            minHeight="400px"
            isRequired
          />
        </FormControl>
        <Box>
          <Text fontWeight="bold">対策の入力期限</Text>
          <Text>{defectItem.submission_deadline_raw}</Text>
        </Box>
        <Button type="submit" colorScheme="teal" w="full" isDisabled={!submission}>
          対策を申請する
        </Button>
      </VStack>
    </Box>
  );
};

export default DefectEditForm;
