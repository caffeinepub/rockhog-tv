import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import type { UserProfile, WithdrawalRequest } from "../backend";
import { RequestStatus } from "../backend";
import AdminOnly from "../components/admin/AdminOnly";
import ProcessWithdrawalDialog from "../components/withdrawals/ProcessWithdrawalDialog";
import { useActor } from "../hooks/useActor";
import { useGetAllWithdrawalRequests } from "../hooks/useWithdrawalRequests";

function getStatusBadgeVariant(
  status: string,
): "default" | "secondary" | "destructive" {
  if (status === RequestStatus.pending) {
    return "secondary";
  }
  if (status === RequestStatus.approved) {
    return "default";
  }
  if (status === RequestStatus.rejected) {
    return "destructive";
  }
  return "secondary";
}

function getStatusLabel(status: string): string {
  if (status === RequestStatus.pending) {
    return "Pending";
  }
  if (status === RequestStatus.approved) {
    return "Approved";
  }
  if (status === RequestStatus.rejected) {
    return "Rejected";
  }
  return status;
}

function UserNameCell({ userId }: { userId: string }) {
  const { actor } = useActor();

  const { data: profile, isLoading } = useQuery<UserProfile | null>({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const principal = { toText: () => userId } as any;
        return actor.getUserProfile(principal);
      } catch {
        return null;
      }
    },
    enabled: !!actor,
  });

  if (isLoading) {
    return <Loader2 className="w-4 h-4 animate-spin" />;
  }

  return <span>{profile?.name || "Unknown User"}</span>;
}

export default function AdminWithdrawalRequestsPage() {
  const { data: allRequests = [], isLoading } = useGetAllWithdrawalRequests();
  const [processingRequest, setProcessingRequest] =
    useState<WithdrawalRequest | null>(null);
  const [processingAction, setProcessingAction] = useState<
    "approve" | "reject"
  >("approve");

  const handleApprove = (request: WithdrawalRequest) => {
    setProcessingRequest(request);
    setProcessingAction("approve");
  };

  const handleReject = (request: WithdrawalRequest) => {
    setProcessingRequest(request);
    setProcessingAction("reject");
  };

  // Sort by timestamp descending (most recent first)
  const sortedRequests = [...allRequests].sort((a, b) =>
    Number(b.timestamp - a.timestamp),
  );

  const pendingRequests = sortedRequests.filter(
    (r) => r.status === RequestStatus.pending,
  );
  const approvedRequests = sortedRequests.filter(
    (r) => r.status === RequestStatus.approved,
  );
  const rejectedRequests = sortedRequests.filter(
    (r) => r.status === RequestStatus.rejected,
  );

  return (
    <AdminOnly>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Withdrawal Requests</h1>
          <p className="text-muted-foreground">
            Manage creator payout requests
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList>
              <TabsTrigger value="pending">
                Pending ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedRequests.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejectedRequests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {pendingRequests.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">
                      No pending withdrawal requests.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Creator</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Notes</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              <UserNameCell
                                userId={request.requester.toText()}
                              />
                            </TableCell>
                            <TableCell>
                              {new Date(
                                Number(request.timestamp) / 1000000,
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {Number(request.amount).toLocaleString()} 🥓
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {request.creatorNotes || "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleApprove(request)}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject(request)}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="approved">
              {approvedRequests.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">
                      No approved withdrawal requests.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Approved Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Creator</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Admin Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {approvedRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              <UserNameCell
                                userId={request.requester.toText()}
                              />
                            </TableCell>
                            <TableCell>
                              {new Date(
                                Number(request.timestamp) / 1000000,
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {Number(request.amount).toLocaleString()} 🥓
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getStatusBadgeVariant(request.status)}
                              >
                                {getStatusLabel(request.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {request.adminNotes || "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="rejected">
              {rejectedRequests.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">
                      No rejected withdrawal requests.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Rejected Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Creator</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Admin Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rejectedRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              <UserNameCell
                                userId={request.requester.toText()}
                              />
                            </TableCell>
                            <TableCell>
                              {new Date(
                                Number(request.timestamp) / 1000000,
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {Number(request.amount).toLocaleString()} 🥓
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getStatusBadgeVariant(request.status)}
                              >
                                {getStatusLabel(request.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {request.adminNotes || "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}

        <ProcessWithdrawalDialog
          open={!!processingRequest}
          onOpenChange={(open) => !open && setProcessingRequest(null)}
          request={processingRequest}
          action={processingAction}
        />
      </div>
    </AdminOnly>
  );
}
