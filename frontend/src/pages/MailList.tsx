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
import { Mail, MailTable } from "@/types/mail";
import { useState, useEffect } from "react";
import { useMailStore } from "@/hooks/useMailStore";
import { Column } from "@/types/common/generic-table";

const MailList = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const { allMailList, allMailTableList, getMails, getMailTableList, getMailGroupList } = useMailStore();

  useEffect(() => {
    getMails();
    getMailTableList();
    getMailGroupList();
  }, []);

  const columns: Column<MailTable>[] = [
    { header: "メール送信日時", accessor: "created_at" },
    { header: "送信先", accessor: "posted_member" },
    { header: "メールタイトル", accessor: "title" },
  ];

  /**
   * テーブルの行をクリックしたときの処理
   * 選択されたメールを表示する
   */
  const handleRowClick = (row: MailTable) => {
    const mail = allMailList.find((m) => m.created_at === row.created_at && m.title === row.title);
    if (mail) {
      setSelectedMail(mail);
      onOpen();
    }
  };

  return (
    <Layout>
      <GenericTable columns={columns} data={allMailTableList} onRowClick={handleRowClick} />

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
