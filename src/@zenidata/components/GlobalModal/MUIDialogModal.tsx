// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
// } from "@mui/material";
// import React from "react";

// interface Props {
//   open: boolean;
//   title: string;
//   options: React.ReactNode[];
//   closeModal: () => void;
//   children: React.ReactNode;
//   enableControl?: boolean;
// }

// const MUIDialogModal = ({
//   open,
//   title,
//   enableControl,
//   options,
//   closeModal,
//   children,
// }: Props) => {
//   const handleClose = (_: any, reason: string) => {
//     if (reason !== "backdropClick") {
//       closeModal();
//     }
//   };

//   const showOptions = (options: React.ReactNode[]) => {
//     return options.map((option, index) => {
//       const optionsIsString = typeof option === "string";
//       if (optionsIsString) {
//         return (
//           <Button
//             // variant={index === 0 ? "contained" : "outlined"}
//             key={index}
//             onClick={() =>
//               optionsIsString && index === options.length - 1 && closeModal()
//             }
//             color="error">
//             {option}
//           </Button>
//         );
//       }
//       return <React.Fragment key={index}>{option}</React.Fragment>;
//     });
//   };

//   return (
//     <Dialog
//       fullWidth
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="alert-dialog-title"
//       aria-describedby="alert-dialog-description">
//       <DialogTitle id="alert-dialog-title" fontSize={24}>
//         {title}
//       </DialogTitle>
//       <DialogContent>{children}</DialogContent>
//       {enableControl === true ||
//         (enableControl === undefined && (
//           <DialogActions>
//             {options.length > 0 ? (
//               showOptions(options)
//             ) : (
//               <Button onClick={closeModal} autoFocus>
//                 Fermer
//               </Button>
//             )}
//           </DialogActions>
//         ))}
//     </Dialog>
//   );
// };

// export default MUIDialogModal;
