"use client"

import * as React from "react"
import { useState } from "react"
import {
    FileText,
    Plus,
    Save,
    Pencil,
    Send,
    X,
    CheckCircle2,
    Clock,
    AlertCircle,
    FileCheck,
    FileClock,
    RefreshCcw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
import { api } from "@/lib/api"
import { DocumentApproval, DocumentStatus } from "./types"

function getStatusBadge(status: DocumentStatus) {
    const config: Record<DocumentStatus, { className: string; icon: React.ReactNode }> = {
        Draft: {
            className: "bg-muted text-muted-foreground border-border",
            icon: <FileText className="size-3" />,
        },
        Submitted: {
            className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
            icon: <Send className="size-3" />,
        },
        "Auto approved": {
            className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
            icon: <FileCheck className="size-3" />,
        },
        Pending: {
            className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
            icon: <Clock className="size-3" />,
        },
        Approved: {
            className: "bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
            icon: <CheckCircle2 className="size-3" />,
        },
        Rejected: {
            className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
            icon: <AlertCircle className="size-3" />,
        },
    }

    const statusConfig = (config as Record<string, { className: string; icon: React.ReactNode }>)[status] ?? {
        className: "bg-muted text-muted-foreground border-border",
        icon: <FileText className="size-3" />,
    }

    const label = statusConfig === config.Draft && !Object.prototype.hasOwnProperty.call(config, status)
        ? status || "Unknown"
        : status

    return (
        <Badge variant="outline" className={statusConfig.className}>
            {statusConfig.icon}
            {label}
        </Badge>
    )
}

export function Dashboard() {
    const [documents, setDocuments] = useState<DocumentApproval[]>([])
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
    const [selectedDocument, setSelectedDocument] = useState<DocumentApproval | null>(null)
    const [isEditMode, setIsEditMode] = useState(true)

    React.useEffect(() => {
        api.getDocuments()
            .then((data) => {
                setDocuments(data);
                console.log("Fetched documents:", data);
            })
            .catch((error) => {
                console.error("Error in document loading:", error);
            });
    }, []);

    // Form state for create dialog
    const [formData, setFormData] = useState<DocumentApproval>({
        supplierName: "",
        amount: 0,
        date: "",
        status: "Draft",
        description: "",
    })

    const handleOpenCreate = () => {
        setFormData({
            supplierName: "",
            amount: 0,
            date: new Date().toISOString().split("T")[0],
            status: "Draft",
            description: "",
        })
        setIsEditMode(true)
        setCreateDialogOpen(true)
    }

    const handleRefresh = () => {
        api.getDocuments()
            .then((data) => {
                setDocuments(data);
                console.log("Fetched documents:", data);
            })
            .catch((error) => {
                console.error("Error in document loading:", error);
            });
    }


    const handleSave = () => {
        api.createDocument(formData)
            .then((res) => {
            if (!res.ok) throw new Error("Error en el servidor");
            return res.json();
        })
        .then((newDocument: DocumentApproval) => {
            setFormData(newDocument);
            setIsEditMode(false);
        })
        .catch((error) => {
            console.error("Error creating document:", error);
        });

        setIsEditMode(false)
    }

    const handleEdit = () => {
        setIsEditMode(true)
    }

    const handleSubmit = () => {
    if (!formData.id) {
        console.error("Document ID is missing. Cannot submit document.");
        return;
    }

    // 1. Llamamos a la API primero
    api.submitDocument(formData.id)
        .then((updatedDocFromServer) => {
            // 2. Si la API responde bien, actualizamos la lista de documentos
            // Usamos lo que devuelve el servidor porque el servidor calculó el estado real (PENDING_APPROVAL, etc.)
            setDocuments(prev => 
                prev.map(doc => doc.id === formData.id ? updatedDocFromServer : doc)
            );

            setCreateDialogOpen(false);
            setIsEditMode(true); 
            
            setFormData({
                id: undefined,
                supplierName: "",
                amount: 0,
                date: new Date().toISOString().split("T")[0],
                status: "Draft",
                description: "",
                approvalLevelRequired: undefined,
                currentApprovalStep: undefined
            });

            console.log("Documento enviado con éxito a SAP Workflow");
        })
        .catch((error) => {
            // Si algo falla, no cerramos el diálogo para que el usuario pueda reintentar
            console.error("Error al enviar el documento:", error);
            alert("No se pudo iniciar el workflow de aprobación. Revisa la conexión con el servidor.");
        });
        
        handleRefresh()
};

    const handleRowClick = (doc: DocumentApproval) => {
        setSelectedDocument(doc)
        setDetailsDialogOpen(true)
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "EUR",
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <header className="border-b bg-background">
                <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
                            <FileClock className="size-5 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold leading-none">BTP Document Approval Engine</h1>
                            <p className="text-xs text-muted-foreground">Enterprise Document Management</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl p-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Documents</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Manage and track document approval workflows
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Button variant={"secondary"} onClick={handleRefresh}>
                                <RefreshCcw className="size-4" />
                                Refresh
                            </Button>
                            <Button onClick={handleOpenCreate}>
                                <Plus className="size-4" />
                                Create
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>ID</TableHead>
                                    <TableHead>Supplier</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.map((doc) => (
                                    <TableRow
                                        key={doc.id}
                                        className="cursor-pointer"
                                        onClick={() => handleRowClick(doc)}
                                    >
                                        <TableCell className="font-medium">{doc.id}</TableCell>
                                        <TableCell>{doc.supplierName}</TableCell>
                                        <TableCell className="text-right font-mono">
                                            {formatCurrency(doc.amount)}
                                        </TableCell>
                                        <TableCell>{formatDate(doc.date)}</TableCell>
                                        <TableCell>{getStatusBadge(doc.status)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>

            {/* Create Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create Document</DialogTitle>
                        <DialogDescription>
                            {isEditMode
                                ? "Fill in the document details below."
                                : "Review your document details before submitting."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">

                        <div className="grid gap-2">
                            <Label htmlFor="proveedor">Supplier</Label>
                            <Input
                                id="proveedor"
                                value={formData.supplierName}
                                onChange={(e) =>
                                    setFormData({ ...formData, supplierName: e.target.value })
                                }
                                readOnly={!isEditMode}
                                disabled={!isEditMode}
                                placeholder="Enter supplier name"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="importe">Amount</Label>
                            <Input
                                id="importe"
                                type="number"
                                value={formData.amount || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                                }
                                readOnly={!isEditMode}
                                disabled={!isEditMode}
                                placeholder="0.00"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="fecha">Date</Label>
                            <Input
                                id="fecha"
                                type="date"
                                value={formData.date}
                                onChange={(e) =>
                                    setFormData({ ...formData, date: e.target.value })
                                }
                                readOnly={!isEditMode}
                                disabled={!isEditMode}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                readOnly={!isEditMode}
                                disabled={!isEditMode}
                                placeholder="Enter document description"
                            />
                        </div>

                    </div>

                    <DialogFooter className="gap-2">
                        {isEditMode ? (
                            <Button onClick={handleSave} disabled={!formData.supplierName || !formData.amount}>
                                <Save className="size-4" />
                                Save
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" onClick={handleEdit}>
                                    <Pencil className="size-4" />
                                    Edit
                                </Button>
                                <Button onClick={handleSubmit}>
                                    <Send className="size-4" />
                                    Submit
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Details Dialog */}
            <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Document Details</DialogTitle>
                        <DialogDescription>
                            View complete document information and approval status.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedDocument && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-1">
                                    <Label className="text-muted-foreground">ID</Label>
                                    <p className="font-medium">{selectedDocument.id}</p>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-muted-foreground">Status</Label>
                                    {getStatusBadge(selectedDocument.status)}
                                </div>
                            </div>

                            <div className="grid gap-1">
                                <Label className="text-muted-foreground">Proveedor (Supplier)</Label>
                                <p className="font-medium">{selectedDocument.supplierName}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-1">
                                    <Label className="text-muted-foreground">Importe (Amount)</Label>
                                    <p className="font-mono font-medium">
                                        {formatCurrency(selectedDocument.amount)}
                                    </p>
                                </div>
                                <div className="grid gap-1">
                                    <Label className="text-muted-foreground">Fecha (Date)</Label>
                                    <p className="font-medium">{formatDate(selectedDocument.date)}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <p className="mb-3 text-sm font-medium text-foreground">Approval Information</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-1">
                                        <Label className="text-muted-foreground">Approval Level Required</Label>
                                        <p className="font-medium">
                                            {selectedDocument.approvalLevelRequired ?? "N/A"}
                                        </p>
                                    </div>
                                    <div className="grid gap-1">
                                        <Label className="text-muted-foreground">Current Approval Step</Label>
                                        <p className="font-medium">
                                            {selectedDocument.currentApprovalStep ?? 0} of{" "}
                                            {selectedDocument.approvalLevelRequired ?? "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
                            <X className="size-4" />
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
