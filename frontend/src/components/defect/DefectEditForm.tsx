import { Box, Button, Text, Textarea } from "@chakra-ui/react";
import { useState, useEffect } from "react";

type Props = {
  initialValue: string;
  onSubmit: (value: string) => void;
};

const DefectEditForm = ({ initialValue, onSubmit }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSave = () => {
    onSubmit(value);
    setIsEditing(false);
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" bg={isEditing ? "white" : "gray.50"}>
      {isEditing ? (
        <>
          <Textarea value={value} onChange={(e) => setValue(e.target.value)} minH="120px" />
          <Button mt={2} colorScheme="teal" onClick={handleSave}>
            更新
          </Button>
        </>
      ) : (
        <Text whiteSpace="pre-wrap" cursor="pointer" onClick={() => setIsEditing(true)}>
          {value || "（未入力）"}
        </Text>
      )}
    </Box>
  );
};

export default DefectEditForm;
