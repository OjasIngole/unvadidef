import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { format } from "date-fns";
import { Loader2, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DashboardView() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  // Fetch speeches
  const { data: speeches, isLoading: loadingSpeeches } = useQuery({
    queryKey: ['/api/speeches'],
    enabled: isOpen,
  });
  
  // Fetch research notes
  const { data: researchNotes, isLoading: loadingNotes } = useQuery({
    queryKey: ['/api/research-notes'],
    enabled: isOpen,
  });
  
  // Fetch recent activities (conversations)
  const { data: conversations, isLoading: loadingConversations } = useQuery({
    queryKey: ['/api/conversations'],
    enabled: isOpen,
  });

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary-600 dark:text-primary-400 px-3 py-1.5"
        >
          My Dashboard
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full md:max-w-md lg:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold text-gray-800 dark:text-white">My Dashboard</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6">
          {/* Recent Activities */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Recent Activities</h3>
            {loadingConversations ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !conversations || conversations.length === 0 ? (
              <Card>
                <CardContent className="py-4 text-center text-gray-500 dark:text-gray-400">
                  No recent activities found
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {conversations.slice(0, 3).map((conversation: any) => (
                  <Card key={conversation.id} className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <span className="material-icons text-primary-600 dark:text-primary-400 mr-3">chat</span>
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-white">{conversation.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {format(new Date(conversation.updatedAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
          
          {/* Saved Speeches */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Saved Speeches</h3>
            {loadingSpeeches ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !speeches || speeches.length === 0 ? (
              <Card>
                <CardContent className="py-4 text-center text-gray-500 dark:text-gray-400">
                  No speeches saved yet
                </CardContent>
              </Card>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Committee</TableHead>
                      <TableHead>Date Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {speeches.map((speech: any) => (
                      <TableRow key={speech.id}>
                        <TableCell className="font-medium">{speech.title}</TableCell>
                        <TableCell>{speech.committee || "—"}</TableCell>
                        <TableCell>{format(new Date(speech.createdAt), 'MMM d, yyyy')}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="link" size="sm" className="h-auto p-0 text-primary-600 dark:text-primary-400">Edit</Button>
                            <Button variant="link" size="sm" className="h-auto p-0 text-gray-600 dark:text-gray-400">Share</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </section>
          
          {/* Research Notes */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Research Notes</h3>
            {loadingNotes ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !researchNotes || researchNotes.length === 0 ? (
              <Card>
                <CardContent className="py-4 text-center text-gray-500 dark:text-gray-400">
                  No research notes saved yet
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {researchNotes.map((note: any) => (
                      <div key={note.id} className="py-3 px-4 flex items-start">
                        <span className="material-icons text-primary-600 dark:text-primary-400 mr-3">description</span>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 dark:text-white">{note.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {note.country && `Research on ${note.country}'s position`} 
                            {note.topic && note.country && ' on '} 
                            {note.topic}
                          </p>
                          <div className="flex mt-2 gap-1 flex-wrap">
                            {note.tags && note.tags.map((tag: string, i: number) => (
                              <Badge key={i} variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="ml-auto flex items-center">
                          <Button variant="ghost" size="sm" className="h-auto p-1">
                            <span className="material-icons text-[18px]">edit</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-auto p-1">
                            <span className="material-icons text-[18px]">delete</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
