import * as React from "react";
import { GlobalModalContext, globalModalContextProps } from "./GlobalModal";
// import MUIDialogModal from "./MUIDialogModal";
import SimpleModal from "./SimpleModal";

interface Props {
  open: boolean;
  children: React.ReactNode;
  title: string;
  enableControl?: boolean;
  options: React.ReactNode[];
}

export default function CustomModal({
  open,
  children,
  title,
  enableControl,
  options,
}: Props) {
  const { closeModal } = React.useContext(
    GlobalModalContext
  ) as globalModalContextProps;

  return (
    <React.Fragment>
      <SimpleModal
        open={open}
        title={title}
        children={children}
        options={options}
        closeModal={closeModal}
        enableControl={enableControl}
      />
    </React.Fragment>
  );
}
