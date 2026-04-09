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

export type DocumentStatus = "Draft" | "Submitted" | "Auto approved" | "Pending" | "Approved" | "Rejected"
