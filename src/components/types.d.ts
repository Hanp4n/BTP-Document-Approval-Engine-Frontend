export type DocumentApproval = {
    id?: number
    supplierName: string
    amount: number
    date: string
    status: DocumentStatus
    description?: string
    approvalLevelRequired?: number
    currentApprovalStep?: number
};

export type DocumentStatus = "DRAFT" | "SUBMITTED" | "AUTO_APPROVED" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED"
