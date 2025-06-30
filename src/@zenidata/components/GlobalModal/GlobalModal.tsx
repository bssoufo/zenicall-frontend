import React, { ReactNode } from "react";
import CustomModal from "./CustomModal";

interface ModalProps {
  title: string;
  content: React.ReactNode;
  options?: React.ReactNode[];
  enableControl?: boolean;
}

export interface globalModalContextProps {
  globalModal: (
    title: string,
    content: React.ReactNode,
    options: React.ReactNode[],
    enableControl?: boolean
  ) => void;
  closeModal: () => void;
}

export const GlobalModalContext =
  React.createContext<globalModalContextProps | null>(null);

interface Props {
  children: React.ReactNode;
}

export const GlobalModalProvider = ({ children }: Props) => {
  const [modalProps, setModalProps] = React.useState<ModalProps | null>(null);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const context = React.useMemo<globalModalContextProps>(
    () => ({
      globalModal: (
        title: string,
        content: React.ReactNode,
        options: React.ReactNode[],
        enableControl?: boolean
      ) => {
        setModalProps({ title, content, options, enableControl });
        setIsOpen(true);
      },
      closeModal: () => {
        setIsOpen(false);
      },
    }),
    []
  );

  return (
    <>
      <GlobalModalContext.Provider value={context}>
        {modalProps && (
          <CustomModal
            title={modalProps.title}
            open={isOpen}
            options={modalProps.options ?? []}
            enableControl={modalProps.enableControl}>
            {modalProps.content}
          </CustomModal>
        )}
        {children}
      </GlobalModalContext.Provider>
    </>
  );
};

export const useGlobalModal = () => {
  const ctx = React.useContext(GlobalModalContext);
  if (!ctx) throw new Error("Cannot display modal.");
  return {
    closeModal: ctx.closeModal,
    globalModal: (
      title: string,
      children: ReactNode,
      options: React.ReactNode[],
      enableControl?: boolean
    ) => {
      ctx.globalModal(title, children, options, enableControl);
      return ctx.closeModal;
    },
  };
};
