import React, { useState, useEffect, useRef } from "react";
import {
  BackendDocumentData,
  Merchant,
  Address,
  Customer,
  BackendTransactionItem,
  BankDetails,
  BackendTax,
  BackendDiscount,
  TransactionItem,
  Tax,
  Discount,
  ReceiptData,
  PaymentMethod,
} from "../../../models/DocumentModel";

import "../DocumentDataForm.css";

// Import sub-components
import DocumentFormHeader from "../DocumentFormHeader";
import MerchantSection from "../MerchantSection";
import CustomerSection from "../CustomerSection";
import TransactionItemsSection from "../TransactionItemsSection";
import FinancialSummarySection from "../FinancialSummarySection";
import TaxesAndDiscountsSection from "../TaxesAndDiscountsSection";
import { ToggleSection } from "../ToggleSection";
import DocumentService from "../../../services/DocumentService";
import { DocumentDataFormProps } from "../../../models/DocumentModel";
import PaymentMethodComponent from "../../PaymentMethod";
import { ExportPopup, ExportPayload } from "../ExportPopup";
import { toast } from "react-hot-toast"; // Import toast
import Loader from "../../../../../@zenidata/components/UI/Loader";
import ConfirmationDialog from "../../../../../@zenidata/components/ConfirmationDialog";
import { useTranslation } from "react-i18next";

const ReceiptDataForm: React.FC<DocumentDataFormProps> = ({
  documentData,
  documentId,
  onDataChange,
  onProcessSuccess,
}) => {
  const { t: tCore } = useTranslation();
  const { t } = useTranslation("documents");
  // Early return if no data
  if (!documentData) {
    return null; // Or a loading indicator, etc.
  }

  const [formData, setFormData] = useState<BackendDocumentData>(
    documentData || ({} as ReceiptData)
  );
  const [showExportPopup, setShowExportPopup] = useState(false);

  // Toggles for open/close sections
  const [merchantOpen, setMerchantOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [transactionItemsOpen, setTransactionItemsOpen] = useState(false);
  const [financialSummaryOpen, setFinancialSummaryOpen] = useState(false);
  const [taxesAndDiscountsOpen, setTaxesAndDiscountsOpen] = useState(false);
  const [paymentAndDeliveryOpen, setPaymentAndDeliveryOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  // Inside the component, add these state variables
  const [isProcessing, setIsProcessing] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  useEffect(() => {
    setFormData(documentData as ReceiptData);
  }, [documentData]);

  // Add cleanup effect
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Add processing handler and polling logic
  const startProcessing = async () => {
    if (!documentId) return;

    try {
      setIsProcessing(true);
      await DocumentService.processDocuments([documentId]);
      startStatusPolling(documentId);
    } catch (error) {
      console.error("Error starting processing:", error);
      toast.error(t("documentProcessedFailed"));
      setIsProcessing(false);
    }
  };

  const startStatusPolling = (docId: number) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const { documents: statusUpdates } =
          await DocumentService.getProcessingStatus([docId]);
        const currentStatus = statusUpdates[0]?.status;

        if (currentStatus === "processed" || currentStatus === "failed") {
          stopPolling();
          setIsProcessing(false);

          if (currentStatus === "processed") {
            toast.success(t("documentProcessedSuccessfully"));
            // Refresh parent data
            if (onProcessSuccess) {
              onProcessSuccess();
            }
            // Update local form data
            const updatedDoc = await DocumentService.getDocumentById(docId);
            setFormData(updatedDoc.corrected_data);
          } else {
            toast.error(t("documentProcessedFailed"));
          }
        }
      } catch (error) {
        console.error("Error checking status:", error);
        stopPolling();
        setIsProcessing(false);
        toast.error(t("errorCheckingStatus"));
      }
    }, 5000);
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const handleConfirmExtraction = async () => {
    setShowConfirmationDialog(false);
    try {
      setIsProcessing(true);
      await DocumentService.processDocuments([documentId]);
      startStatusPolling(documentId);
    } catch (error) {
      console.error("Error starting processing:", error);
      toast.error(t("documentProcessedFailed"));
      setIsProcessing(false);
    }
  };

  const handleCancelExtraction = () => {
    setShowConfirmationDialog(false);
  };

  // In ReceiptDataForm component
  const handleExport = async (payload: ExportPayload) => {
    try {
      const response = await DocumentService.exportDocuments(payload);
      const extension = payload.format === "csv" ? "csv" : "xlsx"; // Map to correct extension
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `export-${documentId}.${extension}`; // Use mapped extension
      link.click();

      toast.success(t("ExportCompletedSuccessfully"));
    } catch (error) {
      console.error("Export failed:", error);
      toast.error(t("ExportFailed"));
    }
  };

  // --- Generic handleChange function ---
  const handleChange = <T, K extends keyof T>(obj: T, key: K, value: T[K]) => {
    return { ...obj, [key]: value };
  };

  // --- Higher-level update function that triggers parent's onDataChange ---
  const updateFormData = (newData: BackendDocumentData) => {
    setFormData(newData);
    onDataChange(newData);
  };

  // --- Merchant ---
  const handleMerchantChange = <K extends keyof Merchant>(
    key: K,
    value: Merchant[K]
  ) => {
    updateFormData({
      ...(formData as ReceiptData),
      merchant: handleChange(
        (formData as ReceiptData).merchant || {},
        key,
        value
      ),
    });
  };

  const handleAddressChange = <K extends keyof Address>(
    parentKey: "merchant" | "customer",
    key: K,
    value: Address[K]
  ) => {
    updateFormData({
      ...formData,
      [parentKey]: {
        ...formData[parentKey],
        address: handleChange(formData[parentKey]?.address || {}, key, value),
      },
    });
  };

  // --- Customer ---
  const handleCustomerChange = <K extends keyof Customer>(
    key: K,
    value: Customer[K]
  ) => {
    updateFormData({
      ...formData,
      customer: handleChange(formData.customer || {}, key, value),
    });
  };

  // --- Transaction Items ---
  const handleTransactionItemChange = (
    index: number,
    field: keyof BackendTransactionItem,
    value: any
  ) => {
    const newItems = [...(formData.lines || [])];
    newItems[index] = handleChange(newItems[index] || {}, field, value);
    updateFormData({ ...formData, lines: newItems });
  };

  const handleAddItem = () => {
    const newItems = [...(formData.lines || [])];
    newItems.push({});
    updateFormData({ ...formData, lines: newItems });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...(formData.lines || [])];
    newItems.splice(index, 1);
    updateFormData({ ...formData, lines: newItems });
  };

  // --- Financial Summary ---
  const handleFinancialSummaryChange = <K extends keyof ReceiptData>(
    key: K,
    value: ReceiptData[K]
  ) => {
    updateFormData({
      ...formData,
      [key]: value,
    });
  };

  // --- Taxes & Discounts ---
  type HandleTaxDiscountChange = {
    (
      section: "tax_lines",
      index: number,
      field: keyof BackendTax,
      value: any
    ): void;
    (
      section: "discount_lines",
      index: number,
      field: keyof BackendDiscount,
      value: any
    ): void;
  };

  const handleTaxDiscountChange: HandleTaxDiscountChange = (
    section,
    index,
    field,
    value
  ) => {
    if (section === "tax_lines") {
      const newItems: BackendTax[] = [...(formData.tax_lines || [])];
      newItems[index] = handleChange(
        newItems[index] || ({} as BackendTax),
        field as keyof BackendTax,
        value
      );
      updateFormData({ ...formData, tax_lines: newItems });
    } else {
      const newItems: BackendDiscount[] = [...(formData.discount_lines || [])];
      newItems[index] = handleChange(
        newItems[index] || ({} as BackendDiscount),
        field as keyof BackendDiscount,
        value
      );
      updateFormData({ ...formData, discount_lines: newItems });
    }
  };

  const handleAddTax = () => {
    const newItems = [...(formData.tax_lines || [])];
    newItems.push({});
    updateFormData({ ...formData, tax_lines: newItems });
  };

  const handleAddDiscount = () => {
    const newItems = [...(formData.discount_lines || [])];
    newItems.push({});
    updateFormData({ ...formData, discount_lines: newItems });
  };

  const handleRemoveTax = (index: number) => {
    const newItems = [...(formData.tax_lines || [])];
    newItems.splice(index, 1);
    updateFormData({ ...formData, tax_lines: newItems });
  };

  const handleRemoveDiscount = (index: number) => {
    const newItems = [...(formData.discount_lines || [])];
    newItems.splice(index, 1);
    updateFormData({ ...formData, discount_lines: newItems });
  };

  // --- Payment & Delivery ---
  const handlePaymentAndDeliveryChange = <K extends keyof ReceiptData>(
    key: K,
    value: ReceiptData[K]
  ) => {
    updateFormData({
      ...formData,
      [key]: value,
    });
  };

  const handlePaymentMethodChange = <K extends keyof PaymentMethod>(
    key: K,
    value: PaymentMethod[K]
  ) => {
    updateFormData({
      ...formData,
      payment_method: {
        ...((formData as ReceiptData).payment_method || {}), // Ensure existing values are retained
        [key]: value,
      },
    });
  };

  const handleBankDetailsChange = <K extends keyof BankDetails>(
    key: K,
    value: BankDetails[K]
  ) => {
    updateFormData({
      ...formData,
      bankDetails: handleChange(
        (formData as ReceiptData).bankDetails || {},
        key,
        value
      ),
    });
  };

  // --- Submitting / Actions ---
  const handleSubmit = async (action: string) => {
    console.log(`Submitting with action: ${action}`, formData);

    if (action === "save") {
      try {
        // 1) Call the service to update correctedData
        const updatedDocument =
          await DocumentService.updateDocumentCorrectedData(
            documentId,
            formData
          );
        console.log("Document updated successfully:", updatedDocument);

        // 2) Optionally, if needed, re-sync local state or inform parent
        // onDataChange(updatedDocument.correctedData ?? {});
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }

    // Other actions
    if (action === "approve") {
      // ...
    }
    if (action === "flag") {
      // ...
    }
    if (action === "export") {
      console.log("Document export successfully:");
      setShowExportPopup(true);
    }
    if (action === "process") {
      setShowConfirmationDialog(true);
      return;
    }
  };

  // --- Mapping data for child components ---
  const mapTransactionItems = (
    backendItems?: BackendTransactionItem[]
  ): TransactionItem[] => {
    if (!backendItems) return [];
    return backendItems.map((item) => ({
      description: item.description || "",
      qty: item.quantity || 0,
      unitPrice: item.unit_price?.toString() || "",
      price: item.amount?.toString() || "",
    }));
  };

  const mapTaxes = (backendItems?: BackendTax[]): Tax[] => {
    if (!backendItems) return [];
    return backendItems.map((item) => ({
      name: item.tax_name || "",
      rate: item.tax_rate?.toString() || "",
      amount: item.tax_amount?.toString() || "",
    }));
  };

  const mapDiscounts = (backendItems?: BackendDiscount[]): Discount[] => {
    if (!backendItems) return [];
    return backendItems.map((item) => ({
      name: item.name || "",
      amount: item.amount?.toString() || "",
    }));
  };

  // Pass to sub-components
  const mappedTransactionItems = mapTransactionItems(formData.lines);
  const mappedTaxes = mapTaxes(formData.tax_lines);
  const mappedDiscounts = mapDiscounts(formData.discount_lines);

  return (
    <div className="iz_doc-processing-right iz_position-relative">
      {/* 1) Header Section */}
      <DocumentFormHeader
        formData={formData as ReceiptData}
        updateFormData={updateFormData}
      />

      {/* 2) Merchant Section */}
      <MerchantSection
        formData={formData as ReceiptData}
        merchantOpen={merchantOpen}
        setMerchantOpen={setMerchantOpen}
        handleMerchantChange={handleMerchantChange}
        handleAddressChange={handleAddressChange}
      />

      {/* 3) Customer Section */}
      <CustomerSection
        formData={formData}
        customerOpen={customerOpen}
        setCustomerOpen={setCustomerOpen}
        handleCustomerChange={handleCustomerChange}
        handleAddressChange={handleAddressChange}
      />

      {/* 4) Transaction Items Section */}
      <TransactionItemsSection
        formData={formData}
        transactionItemsOpen={transactionItemsOpen}
        setTransactionItemsOpen={setTransactionItemsOpen}
        mappedTransactionItems={mappedTransactionItems}
        handleTransactionItemChange={handleTransactionItemChange}
        handleAddItem={handleAddItem}
        handleRemoveItem={handleRemoveItem}
      />

      {/* 5) Taxes & Discounts Section */}
      <TaxesAndDiscountsSection
        formData={formData}
        taxesAndDiscountsOpen={taxesAndDiscountsOpen}
        setTaxesAndDiscountsOpen={setTaxesAndDiscountsOpen}
        mappedTaxes={mappedTaxes}
        mappedDiscounts={mappedDiscounts}
        handleTaxDiscountChange={handleTaxDiscountChange}
        handleAddTax={handleAddTax}
        handleRemoveTax={handleRemoveTax}
        handleAddDiscount={handleAddDiscount}
        handleRemoveDiscount={handleRemoveDiscount}
      />

      {/* 6) Financial Summary Section */}
      <FinancialSummarySection
        formData={formData as ReceiptData}
        financialSummaryOpen={financialSummaryOpen}
        setFinancialSummaryOpen={setFinancialSummaryOpen}
        handleFinancialSummaryChange={handleFinancialSummaryChange}
      />

      {/* 7) Payment & Delivery Section */}
      {/* 7) Payment & Delivery Section */}
      <PaymentMethodComponent
        paymentMethod={(formData as ReceiptData).payment_method || {}}
        handlePaymentMethodChange={handlePaymentMethodChange}
        paymentOpen={paymentOpen}
        setPaymentOpen={setPaymentOpen}
      />
      {/* 8) Action Buttons */}
      <div className="iz_btns-actions iz_flex">
        {/* <button
          className="iz_btn iz_btn-submit iz_btn-white"
          type="button"
          onClick={() => handleSubmit('approve')}
        >
          Approve all
        </button>
        <button
          className="iz_btn iz_btn-submit iz_btn-white"
          type="button"
          onClick={() => handleSubmit('flag')}
        >
          Flag issues
        </button>*/}
        <button
          className="iz_btn iz_btn-submit iz_btn-white"
          type="button"
          onClick={() => handleSubmit("process")}>
          {t("documentView.extract")}
          {isProcessing && <Loader showText={false} size="small" />}
        </button>
        <button
          className="iz_btn iz_btn-submit iz_btn-primary"
          type="button"
          onClick={() => handleSubmit("export")}>
          {t("documentView.export")}
        </button>
      </div>

      {showExportPopup && (
        <ExportPopup
          documentIds={[documentId]}
          documentType="receipt"
          onClose={() => setShowExportPopup(false)}
          onExport={handleExport}
        />
      )}

      <ConfirmationDialog
        isOpen={showConfirmationDialog}
        title={t("documentView.receiptFormConfirmationModalTitle")}
        message={t("documentView.receiptFormConfirmationModalDescription")}
        onConfirm={handleConfirmExtraction}
        onCancel={handleCancelExtraction}
        confirmText={tCore("button.confirm")}
        cancelText={tCore("button.cancel")}
      />
    </div>
  );
};

export default ReceiptDataForm;
