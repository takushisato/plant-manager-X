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
import { MailGroupAndList } from "@/types/mail";
import { useState, useEffect, ReactNode } from "react";
import { useMailStore } from "@/hooks/useMailStore";
import { Column } from "@/types/common/generic-table";

const MailList = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMail, setSelectedMail] = useState<MailGroupAndList | null>(null);
  const { mailGroupList, getMailTableList, getMailGroupList } = useMailStore();

  useEffect(() => {
    getMailTableList();
    getMailGroupList();
  }, []);

  const columns: Column<Record<string, ReactNode>>[] = [
    { header: "メール送信日時", accessor: "sent_at" },
    { header: "送信先", accessor: "group_title" },
    { header: "メールタイトル", accessor: "title" },
  ];

  const tableData: Record<string, ReactNode>[] = mailGroupList.map((mail) => ({
    id: mail.history.id,
    group_title: mail.group_title,
    sent_at: mail.history?.sent_at?.slice(0, 10),
    title: mail.history?.title,
  }));

  /**
   * テーブルの行をクリックしたときの処理
   * 選択されたメールを表示する
   */
  const handleRowClick = (row: Record<string, ReactNode>) => {
    const mail = mailGroupList.find((m) => m.history.id === row.id);
    if (mail) {
      setSelectedMail(mail);
      onOpen();
    }
  };

  return (
    <Layout>
      <GenericTable columns={columns} data={tableData} onRowClick={handleRowClick} />

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
                <Text mb={2}>{selectedMail.history.sent_at?.slice(0, 10)}</Text>

                <Text fontWeight="bold">送信先</Text>
                <Text mb={2}>{selectedMail.group_title}</Text>

                <Text fontWeight="bold">タイトル</Text>
                <Text mb={2}>{selectedMail.history.title}</Text>

                <Text fontWeight="bold">メッセージ</Text>
                <Text whiteSpace="pre-wrap">{selectedMail.history.message}</Text>
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
