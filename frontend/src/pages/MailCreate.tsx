import {
  Box,
  Button,
  Input,
  Textarea,
  VStack,
  Text,
  Heading,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import Layout from "@/layouts/Layout";
import { MailGroupList } from "@/types/mail";
import { useMailStore } from "@/hooks/useMailStore";
import { useEffect } from "react";

const MailCreate = () => {
  const {
    mailGroupList,
    getMailGroupList,
    selectedMailGroup,
    setSelectedMailGroup,
  } = useMailStore();

  useEffect(() => {
    getMailGroupList();
  }, []);

  const handleSelectedMailGroup = (mailGroup: MailGroupList) => {
    setSelectedMailGroup(mailGroup);
    console.log("選択中のグループ:", mailGroup);
  };

  const bgSelected = useColorModeValue("teal.100", "teal.700");

  return (
    <Layout>
      <Box maxW="600px" mx="auto" p={6}>
        <Heading size="md" mb={4}>
          メールグループの選択
        </Heading>
        <Stack spacing={2}>
          {mailGroupList.map((mailGroup) => (
            <Box
              key={mailGroup.id}
              p={3}
              borderWidth="1px"
              borderRadius="md"
              bg={selectedMailGroup?.id === mailGroup.id ? bgSelected : "white"}
              _hover={{ bg: "gray.50" }}
              cursor="pointer"
              onClick={() => handleSelectedMailGroup(mailGroup)}
            >
              {mailGroup.group_title}
            </Box>
          ))}
        </Stack>

        {selectedMailGroup && (
          <Box mt={8} p={4} borderWidth="1px" borderRadius="md">
            <Text fontWeight="bold" mb={4}>
              選択中のグループ: {selectedMailGroup.group_title}
            </Text>

            <VStack spacing={4} align="stretch">
              <Box>
                <Text mb={1}>タイトル</Text>
                <Input placeholder="メールタイトルを入力" />
              </Box>

              <Box>
                <Text mb={1}>本文</Text>
                <Textarea placeholder="メール本文を入力" rows={6} />
              </Box>

              <Button colorScheme="teal">送信</Button>
            </VStack>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default MailCreate;
