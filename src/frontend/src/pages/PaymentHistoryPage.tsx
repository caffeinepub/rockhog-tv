import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { usePaymentHistory, useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowDownLeft, ArrowUpRight, LogIn, Coins } from 'lucide-react';

export default function PaymentHistoryPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { received, sent, isLoading, error } = usePaymentHistory();

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatAmount = (amount: bigint) => {
    return `${Number(amount)} Bacon Cash`;
  };

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Log in to view your payment history</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={login}
              disabled={loginStatus === 'logging-in'}
              className="gap-2"
            >
              <LogIn className="w-4 h-4" />
              {loginStatus === 'logging-in' ? 'Logging in...' : 'Log In'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>Failed to load payment history</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Payment History</h1>
          <p className="text-muted-foreground">View your tips received and sent</p>
        </div>

        <Tabs defaultValue="received" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="received" className="gap-2">
              <ArrowDownLeft className="w-4 h-4" />
              Tips Received
            </TabsTrigger>
            <TabsTrigger value="sent" className="gap-2">
              <ArrowUpRight className="w-4 h-4" />
              Tips Sent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowDownLeft className="w-5 h-5 text-green-500" />
                  Tips Received
                </CardTitle>
                <CardDescription>
                  Tips you've received from viewers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!received || received.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Coins className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No tips received yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Channel</TableHead>
                          <TableHead>From</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Message</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {received.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="whitespace-nowrap">
                              {formatTimestamp(payment.timestamp)}
                            </TableCell>
                            <TableCell className="font-medium">
                              {payment.channelId}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {payment.sender.toString().slice(0, 8)}...
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="gap-1">
                                <Coins className="w-3 h-3" />
                                {formatAmount(payment.amount)}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {payment.message || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sent">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-blue-500" />
                  Tips Sent
                </CardTitle>
                <CardDescription>
                  Tips you've sent to streamers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!sent || sent.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Coins className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No tips sent yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Channel</TableHead>
                          <TableHead>To</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Message</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sent.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="whitespace-nowrap">
                              {formatTimestamp(payment.timestamp)}
                            </TableCell>
                            <TableCell className="font-medium">
                              {payment.channelId}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {payment.recipient.toString().slice(0, 8)}...
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="gap-1">
                                <Coins className="w-3 h-3" />
                                {formatAmount(payment.amount)}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {payment.message || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
