export const formatFileSize = (sizeBit: number): string => {
  const sizeKb = sizeBit / 1024;
  const sizeMb = sizeKb / 1024;
  const sizeGo = sizeMb / 1024;

  if (sizeGo >= 1) {
    return `${sizeGo.toFixed(1)} Go`;
  } else if (sizeMb >= 1) {
    return `${sizeMb.toFixed(1)} Mb`;
  } else {
    return `${sizeKb.toFixed(1)} Kb`;
  }
};

export const downloadFile = (url: string, fileName?: string): void => {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName || url.split("/").pop() || "download";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};

export const downloadMultipleFiles = (
  urls: string[],
  fileNames?: string[]
): void => {
  urls.forEach((url, index) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download =
      fileNames?.[index] || url.split("/").pop() || `download_${index}`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  });
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0 en JS
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year}  ${hours}:${minutes}`;
};
