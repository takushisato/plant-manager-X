import { createPortal } from "react-dom";
import { useState, useCallback } from "react";
import { Spinner, Modal, ModalOverlay, ModalContent, Flex } from "@chakra-ui/react";

export const Loading = () => {
  const [isOpen, setIsOpen] = useState(false);

  const showLoading = useCallback(() => setIsOpen(true), []);
  const hideLoading = useCallback(() => setIsOpen(false), []);

  const LoadingOverlay = () => {
    if (!isOpen) return null;

    return createPortal(
      <Modal isOpen={isOpen} onClose={() => {}} isCentered>
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none">
          <Flex justifyContent="center" alignItems="center" minH="200px">
            <Spinner size="xl" thickness="4px" color="teal.400" />
          </Flex>
        </ModalContent>
      </Modal>,
      document.body
    );
  };

  return { showLoading, hideLoading, LoadingOverlay };
};
