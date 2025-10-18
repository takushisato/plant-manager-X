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
  Checkbox,
} from "@chakra-ui/react";
import Layout from "@/layouts/Layout";
import { MailGroupAndList } from "@/types/mail";
import { useMailStore } from "@/hooks/useMailStore";
import { useEffect, useState } from "react";
import TooltipIcon from "@/components/common/TooltipIcon";
import { useAuthStore } from "@/hooks/useAuthStore";

const MailCreate = () => {
  const {
    sendMail,
    postMail,
    setPostMail,
    mailGroupList,
    getMailGroupList,
    createMailGroup,
    groupTitle,
    setGroupTitle,
    groupNote,
    setGroupNote,
  } = useMailStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgSelected = useColorModeValue("teal.100", "teal.700");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedMailGroup, setSelectedMailGroup] = useState<MailGroupAndList | null>(null);
  const { allUsers, getAllUsers } = useAuthStore();

  useEffect(() => {
    getMailGroupList();
    getAllUsers();
  }, []);

  /**
   * メールグループを選択
   * @param mailGroup メールグループ
   */
  const handleSelectedMailGroup = (mailGroup: MailGroupAndList) => {
    setSelectedMailGroup(mailGroup);
  };

  /**
   * メールを送信
   * storeで処理する形に実装
   */
  const handleSendMail = () => {
    if (!selectedMailGroup) return;
    sendMail(selectedMailGroup.id);
  };

  /**
   * ユーザーを選択
   * @param userId ユーザーID
   */
  const handleUserSelect = (userId: number) => {
    const user = allUsers.find((u) => u.id === userId);
    if (!user) return;

    setSelectedUsers(
      selectedUsers.some((u) => u === userId) ? selectedUsers.filter((u) => u !== userId) : [...selectedUsers, userId]
    );
  };

  /**
   * メールグループを作成
   */
  const handleCreateMailGroup = () => {
    if (!selectedUsers) return;
    createMailGroup(selectedUsers);
  };

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
              <Text fontWeight="bold">{mailGroup.group_title}</Text>
              <Text fontSize="sm" color="gray.600" mt={1}>
                {mailGroup.note}
              </Text>
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
                      mail_group_id: selectedMailGroup.id,
                    })
                  }
                  isRequired
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
                      mail_group_id: selectedMailGroup.id,
                    })
                  }
                  isRequired
                />
              </Box>

              <Button colorScheme="teal" onClick={handleSendMail} isDisabled={!postMail?.title || !postMail?.message}>
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
                  <Box as="span" display="inline-flex" alignItems="center">
                    <Text mb={1} mr={2}>
                      グループ名
                    </Text>
                    <TooltipIcon label="グループ名を入力してください" />
                  </Box>
                  <Input
                    placeholder="グループ名を入力"
                    value={groupTitle}
                    onChange={(e) => setGroupTitle(e.target.value)}
                    isRequired
                  />
                </Box>
                <Box w="100%">
                  <Box as="span" display="inline-flex" alignItems="center">
                    <Text mb={1} mr={2}>
                      説明
                    </Text>
                    <TooltipIcon label="グループの説明があれば入力してください" />
                  </Box>
                  <Textarea
                    placeholder="グループの説明を入力"
                    value={groupNote}
                    onChange={(e) => setGroupNote(e.target.value)}
                  />
                </Box>
                <Box w="100%">
                  <Text mb={2}>メンバー選択</Text>
                  <Stack spacing={2} maxH="200px" overflowY="auto">
                    {allUsers.map((user) => (
                      <Checkbox
                        key={user.id}
                        isChecked={selectedUsers.some((u) => u === user.id)}
                        onChange={() => handleUserSelect(user.id)}
                      >
                        {user.name}
                      </Checkbox>
                    ))}
                  </Stack>
                </Box>
                <Button
                  colorScheme="teal"
                  w="100%"
                  onClick={handleCreateMailGroup}
                  isDisabled={!selectedUsers.length || !groupTitle}
                >
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
