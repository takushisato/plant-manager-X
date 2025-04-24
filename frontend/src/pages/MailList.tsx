import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import Layout from "@/layouts/Layout";
import GenericTable from "@/components/common/GenericTable";
import { Column } from "@/types/common/generic-table";
import { Mail, MailTable } from "@/types/mail";
import { useState } from "react";

const MailList = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);

  const allMailList: Mail[] = [
    {
      created_at: "2021-01-01 10:00:00",
      posted_member: "山田太郎、山田花子、鈴木一郎",
      title: "テストメール1",
      message: "こんにちは1",
    },
    {
      created_at: "2021-01-01 11:00:00",
      posted_member: "山田太郎、山田花子、鈴木一郎",
      title: "テストメール2",
      message: "こんにちは2",
    },
    {
      created_at: "2021-01-01 11:00:00",
      posted_member: "山田太郎、山田花子、鈴木一郎",
      title: "テストメール3",
      message: "こんにちは3",
    },
  ];

  const columns: Column<MailTable>[] = [
    { header: "メール送信日時", accessor: "created_at" },
    { header: "送信先", accessor: "posted_member" },
    { header: "メールタイトル", accessor: "title" },
  ];

  const allMailTableList: MailTable[] = allMailList.map((mail) => ({
    created_at: mail.created_at,
    posted_member: mail.posted_member,
    title: mail.title,
  }));

  const handleRowClick = (row: MailTable) => {
    const mail = allMailList.find(
      (m) => m.created_at === row.created_at && m.title === row.title
    );
    if (mail) {
      setSelectedMail(mail);
      onOpen();
    }
  };

  return (
    <Layout>
      <GenericTable
        columns={columns}
        data={allMailTableList}
        onRowClick={handleRowClick}
      />

      {/* モーダル */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>メール詳細</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedMail && (
              <>
                <Text fontWeight="bold">送信日時</Text>
                <Text mb={2}>{selectedMail.created_at}</Text>

                <Text fontWeight="bold">送信先</Text>
                <Text mb={2}>{selectedMail.posted_member}</Text>

                <Text fontWeight="bold">タイトル</Text>
                <Text mb={2}>{selectedMail.title}</Text>

                <Text fontWeight="bold">メッセージ</Text>
                <Text whiteSpace="pre-wrap">{selectedMail.message}</Text>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={onClose}>
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
};

export default MailList;
