import { FolderStatus } from "./FolderModel";

export const displayFolderStatus = (
  status: FolderStatus,
  text: string = ""
) => {
  let classes = "";
  switch (status) {
    case "active":
      classes = "iz_text-success";
      break;
    case "archived":
      classes = "iz_text-warning";
      break;
  }
  return <span className={classes}>{text !== "" ? text : status}</span>;
};
