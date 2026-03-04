import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { RequestStatus } from "../../backend";
import { useGetMyWithdrawalRequests } from "../../hooks/useWithdrawalRequests";

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

export default function WithdrawalRequestsList() {
  const { data: requests = [], isLoading } = useGetMyWithdrawalRequests();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No withdrawal requests yet.</p>
        </CardContent>
      </Card>
    );
  }

  // Sort by timestamp descending (most recent first)
  const sortedRequests = [...requests].sort((a, b) =>
    Number(b.timestamp - a.timestamp),
  );

  return (
    <div className="space-y-4">
      {sortedRequests.map((request) => (
        <Card key={request.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-lg">
                  {Number(request.amount).toLocaleString()} Bacon Cash
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(
                    Number(request.timestamp) / 1000000,
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <Badge variant={getStatusBadgeVariant(request.status)}>
                {getStatusLabel(request.status)}
              </Badge>
            </div>
          </CardHeader>
          {(request.creatorNotes || request.adminNotes) && (
            <CardContent className="space-y-3">
              {request.creatorNotes && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Your Notes:
                  </p>
                  <p className="text-sm">{request.creatorNotes}</p>
                </div>
              )}
              {request.adminNotes && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Admin Notes:
                  </p>
                  <p className="text-sm">{request.adminNotes}</p>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
