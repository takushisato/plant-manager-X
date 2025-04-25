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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
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
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          <Button size="sm" onClick={onOpen}>
            新規にグループを作成
          </Button>
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

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>新規メールグループ作成</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <Box w="100%">
                  <Text mb={1}>グループ名</Text>
                  <Input placeholder="グループ名を入力" />
                </Box>
                <Box w="100%">
                  <Text mb={1}>説明</Text>
                  <Textarea placeholder="グループの説明を入力" />
                </Box>
                <Button colorScheme="teal" w="100%">
                  作成
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Layout>
  );
};

export default MailCreate;
