import { DefectCreateItem } from "@/types/defect";
import {
  Button,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  form: DefectCreateItem;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
};

const DefectCreateForm = ({ form, onChange, onSubmit }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const onClose = () => {
    setIsOpen(false);
    navigate("/defect");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
    setIsOpen(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>発生日</FormLabel>
          <Input
            type="date"
            name="occurred_at"
            value={form.occurred_at}
            onChange={onChange}
            id="occurred_at"
            data-testid="occurred_at"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>タイトル</FormLabel>
          <Input name="title" value={form.title} onChange={onChange} id="title" data-testid="title" />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>不具合詳細</FormLabel>
          <Textarea
            name="defect_detail"
            value={form.defect_detail}
            onChange={onChange}
            minHeight="600px"
            id="defect_detail"
            data-testid="defect_detail"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>対策の入力期限</FormLabel>
          <Input
            type="date"
            name="submission_deadline"
            value={form.submission_deadline}
            onChange={onChange}
            id="submission_deadline"
            data-testid="submission_deadline"
          />
        </FormControl>
        <FormControl>
          <FormLabel>作成者ID</FormLabel>
          <Input
            type="number"
            name="create_user"
            value={form.create_user}
            onChange={onChange}
            isDisabled
            id="create_user"
            data-testid="create_user"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>関連注文ID</FormLabel>
          <Input type="number" name="order" value={form.order} onChange={onChange} id="order" data-testid="order" />
        </FormControl>
        <Button
          type="submit"
          colorScheme="teal"
          isDisabled={
            !form.occurred_at || !form.title || !form.defect_detail || !form.submission_deadline || !form.order
          }
        >
          登録
        </Button>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>新規不具合の登録</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <p>不具合の新規追加が完了しました</p>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </form>
  );
};

export default DefectCreateForm;
