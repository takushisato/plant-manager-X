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
  Flex,
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
    sendMail,
    postMail,
    setPostMail,
  } = useMailStore();

  useEffect(() => {
    getMailGroupList();
  }, []);

  /*
   * メールグループを選択
   */
  const handleSelectedMailGroup = (mailGroup: MailGroupList) => {
    setSelectedMailGroup(mailGroup);
  };

  /*
   * メールを送信
   * storeで処理する形に実装
   */
  const handleSendMail = () => {
    sendMail();
  };

  const bgSelected = useColorModeValue("teal.100", "teal.700");

  return (
    <Layout>
      <Box maxW="600px" mx="auto" p={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">メールグループの選択</Heading>
          <Button size="sm">新規にグループを作成</Button>
        </Flex>
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
                <Input
                  placeholder="メールタイトルを入力"
                  value={postMail?.title}
                  onChange={(e) =>
                    setPostMail({
                      title: e.target.value,
                      message: postMail?.message || "",
                      group_id: selectedMailGroup.id,
                    })
                  }
                />
              </Box>

              <Box>
                <Text mb={1}>本文</Text>
                <Textarea
                  placeholder="メール本文を入力"
                  rows={6}
                  value={postMail?.message}
                  onChange={(e) =>
                    setPostMail({
                      title: postMail?.title || "",
                      message: e.target.value,
                      group_id: selectedMailGroup.id,
                    })
                  }
                />
              </Box>

              <Button colorScheme="teal" onClick={handleSendMail}>
                送信
              </Button>
            </VStack>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default MailCreate;
