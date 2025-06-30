// src/pages/Documents/DocumentModel.ts

// Interface representing the entire document as returned by the backend.
// src/pages/Documents/DocumentModel.ts

// Interface representing the entire document as returned by the backend.
export interface BackendDocument {
    id: number;
    name: string;
    document_type?: 'RECEIPT' | 'INVOICE' | 'PURCHASE_ORDER';
    file_url: string;
    corrected_data?: BackendDocumentData;
    folder: any;
    status: DocumentStatus;
    file_path: string;
    extracted_data: any;
    updated_by: number;
    updated_at: string;
    folder_id: number;
    size: number;
    extension: string;
    created_by: number;
    created_at: string;
    folder_name: string;
}

// Union type for corrected_data based on document type
export type BackendDocumentData = InvoiceData | ReceiptData;

// Invoice-specific data structure
export interface InvoiceData {
    is_invoice: true;
    currency?: string;
    currency_confidence?: number;
    customer?: Customer;
    delivery_details?: DeliveryDetails;
    discount_lines?: BackendDiscount[];
    invoice_confidence?: number;
    invoice_date?: string;
    invoice_due_date?: string;
    invoice_number?: string;
    issue_datetime?: string | null;
    lines?: BackendTransactionItem[];
    notes?: string | null;
    order_number?: string | null;
    payment_method?: PaymentMethod;
    shipping_metod?: string | null;
    promotion_codes?: any[];
    seller?: Seller;
    sub_total_amount?: number;
    shipping_amount?: number | null;
    tax_lines?: BackendTax[];
    total_amount?: number;
    tip: number | null;
}

// Receipt-specific data structure
export interface ReceiptData {
    is_receipt: true;
    barcode_data?: string | null;
    transaction_datetime?: string;
    cashier_id?: string | null;
    change_amount?: number | null;
    shipping_amount?: number | null;
    currency?: string;
    customer?: Customer;
    discount_lines?: BackendDiscount[];
    line_item_confidence?: number;
    lines?: BackendTransactionItem[];
    loyalty_info?: any | null;
    merchant?: Merchant;
    merchant_confidence?: number;
    payment_method?: PaymentMethod;
    promotion_codes?: any[];
    receipt_confidence?: number;
    receipt_number?: string;
    return_policy?: string | null;
    store_number?: string | null;
    sub_total_amount?: number;
    tax_lines?: BackendTax[];
    tendered_amount?: number | null;
    tip: number | null;
    total_amount?: number;
    total_before_tip?: number | null;
    bankDetails?: BankDetails;
    shipping_metod?: string | null;
    
}

// Common address structure with confidence
export interface Address {
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    address_confidence?: number;
}

// Customer information structure
export interface Customer {
    GST_number?: string | null;
    QST_number?: string | null;
    address?: Address;
    customer_confidence?: number;
    email?: string | null;
    fax?: string | null;
    name?: string;
    other_contact_info?: string | null;
    phone?: string | null;
    vat_number?: string | null;
    website?: string | null;
}

// Seller information structure (for invoices)
export interface Seller {
    GST_number?: string | null;
    QST_number?: string | null;
    address?: Address;
    email?: string | null;
    fax?: string | null;
    name?: string;
    other_contact_info?: string | null;
    phone?: string | null;
    registration_number?: string | null;
    seller_confidence?: number;
    vat_number?: string | null;
    website?: string | null;
}

// Merchant information structure (for receipts)
export interface Merchant {
    GST_number?: string | null;
    QST_number?: string | null;
    address?: Address;
    email?: string | null;
    fax?: string | null;
    name?: string;
    other_contact_info?: string | null;
    phone?: string | null;
    registration_number?: string | null;
    seller_confidence?: number;
    vat_number?: string | null;
    website?: string | null;
}

// Transaction line item structure
export interface BackendTransactionItem {
    description?: string;
    quantity?: number;
    unit_price?: number;
    amount?: number;
    line_confidence?: number;
}

// Tax information structure
export interface BackendTax {
    tax_name?: string;
    tax_rate?: number;
    tax_amount?: number;
    tax_confidence?: number;
    tax_base?: number | null;
}

// Discount information structure
export interface BackendDiscount {
    name?: string;
    amount?: number;
}

// Payment method details (for invoices)
export interface PaymentMethod {
    account_name?: string | null;
    account_number?: string | null;
    iban?: string | null;
    method_name?: string;
    payment_method_confidence?: number;
    swift_code?: string | null;
}

// Delivery details structure (for invoices)
export interface DeliveryDetails {
    delivery_address?: Address;
    delivery_confidence?: number;
    delivery_date?: string | null;
    tracking_number?: string | null;
}

// Remaining interfaces for form representation (if needed)
export interface TransactionItem {
    description: string;
    qty: number;
    unitPrice: string;
    price: string;
}

export interface FinancialSummary {
    subtotal?: string;
    taxes?: string;
    discounts?: string;
    total?: string;
    currency?: string;
    tendered?: string;
    change?: string;
}

export interface TaxesAndDiscounts {
    taxes: Tax[];
    discounts: Discount[];
}

export interface Tax {
    name: string;
    rate: string;
    amount: string;
}

export interface Discount {
    name: string;
    amount: string;
}

export interface PaymentAndDelivery {
    payment: string;
    delivery: string;
    creditCard: string;
    authCode: string;
    bankDetails: BankDetails;
}

export interface BankDetails {
    accountName?: string;
    ibanSwift?: string;
}

export interface DocumentDataFormProps {
  documentData: BackendDocumentData;
  documentId: number;
  documentType: string;
  onDataChange: (data: BackendDocumentData) => void;
  onProcessSuccess?: () => void;
}


// src/models/DocumentModel.js

// export default class Document {
//   constructor(
//     public id: number,
//     public status: DocumentStatus,
//     public file_path: string,
//     public extracted_data: Object,
//     public updated_by: number,
//     public updated_at: string,
//     public name: string,
//     public folder_id: string,
//     public corrected_data: Object,
//     public created_by: string,
//     public created_at: string,
//     public file_url: string
//   ) {}
// }

export  interface Document {
    id: number;
    status: DocumentStatus;
    file_path: string;
    extracted_data: any;
    document_type: string;
    updated_by: number;
    updated_at: string;
    name: string;
    folder_id: number;
    size: number;
    extension: string;
    corrected_data: any;
    created_by: number;
    created_at: string;
    file_url: string;
    folder_name: string;
  }
  export type DocumentStatus = "processed" | "completed" | "failed" | "pending";