import { useGetAllBaconCashRequests, useFulfillBaconCashRequest } from '../hooks/useQueries';
import AdminOnly from '../components/admin/AdminOnly';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminBaconCashRequestsPage() {
  const { data: requests = [], isLoading } = useGetAllBaconCashRequests();
  const fulfillRequest = useFulfillBaconCashRequest();

  const handleFulfill = async (requestId: string) => {
    try {
      await fulfillRequest.mutateAsync(requestId);
      toast.success('Request fulfilled successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to fulfill request');
    }
  };

  return (
    <AdminOnly>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bacon Cash Requests</h1>
          <p className="text-muted-foreground">Manage and fulfill user purchase requests</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Requests</CardTitle>
            <CardDescription>
              {requests.filter(r => !r.completed).length} pending requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : requests.length === 0 ? (
              <p className="text-center text-muted-foreground py-16">No requests yet</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-mono text-xs">
                          {request.id.slice(0, 16)}...
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {request.user.toString().slice(0, 16)}...
                        </TableCell>
                        <TableCell className="font-semibold">
                          {Number(request.amount).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={request.completed ? 'default' : 'secondary'}>
                            {request.completed ? 'Completed' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {!request.completed && (
                            <Button
                              size="sm"
                              onClick={() => handleFulfill(request.id)}
                              disabled={fulfillRequest.isPending}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Fulfill
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminOnly>
  );
}

