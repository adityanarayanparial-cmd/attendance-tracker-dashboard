import { useState } from "react";
import { 
  Subject, 
  useMarkPresent, 
  useMarkAbsent,
  useUndoPresent,
  useUndoAbsent,
  useDeleteSubject,
  getGetSubjectsQueryKey,
  getGetDashboardSummaryQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { calculateGuidance } from "@/lib/guidance";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Check, X, Undo2 } from "lucide-react";
import { EditSubjectDialog } from "./edit-subject-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export function SubjectCard({ subject }: { subject: Subject }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const markPresent = useMarkPresent();
  const markAbsent = useMarkAbsent();
  const undoPresent = useUndoPresent();
  const undoAbsent = useUndoAbsent();
  const deleteSubject = useDeleteSubject();

  const guidance = calculateGuidance(subject);
  const isSafe = guidance.status === "Safe";
  const hasData = guidance.status !== "No Data";

  const handleInvalidate = () => {
    queryClient.invalidateQueries({ queryKey: getGetSubjectsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
  };

  const handleMarkPresent = () => {
    markPresent.mutate({ id: subject.id }, { onSuccess: handleInvalidate });
  };

  const handleMarkAbsent = () => {
    markAbsent.mutate({ id: subject.id }, { onSuccess: handleInvalidate });
  };

  const handleUndoPresent = () => {
    undoPresent.mutate(
      { id: subject.id },
      {
        onSuccess: () => {
          handleInvalidate();
          toast({ title: "Undone", description: "Removed 1 present mark." });
        },
        onError: () => {
          toast({ title: "Could not undo", variant: "destructive" });
        },
      }
    );
  };

  const handleUndoAbsent = () => {
    undoAbsent.mutate(
      { id: subject.id },
      {
        onSuccess: () => {
          handleInvalidate();
          toast({ title: "Undone", description: "Removed 1 absent mark." });
        },
        onError: () => {
          toast({ title: "Could not undo", variant: "destructive" });
        },
      }
    );
  };

  const handleDelete = () => {
    deleteSubject.mutate(
      { id: subject.id },
      {
        onSuccess: () => {
          handleInvalidate();
          setIsDeleteDialogOpen(false);
          toast({ title: "Subject deleted" });
        },
        onError: () => {
          toast({ title: "Error deleting subject", variant: "destructive" });
        }
      }
    );
  };

  return (
    <>
      <div className={`flex flex-col p-6 bg-card rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md ${hasData ? (isSafe ? 'border-primary/20 bg-primary/5' : 'border-destructive/20 bg-destructive/5') : 'border-border'}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-xl text-foreground truncate pr-4" title={subject.name}>{subject.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground font-mono">
                {subject.presentCount} / {guidance.total} Attended
              </span>
              {hasData && (
                <Badge variant={isSafe ? "default" : "destructive"} className="rounded-md font-mono text-xs">
                  {isSafe ? "Safe" : "At Risk"}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
              onClick={() => setIsEditDialogOpen(true)}
              data-testid={`button-edit-${subject.id}`}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-lg"
              onClick={() => setIsDeleteDialogOpen(true)}
              data-testid={`button-delete-${subject.id}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-5 flex-grow">
          <div className="flex justify-between text-sm mb-2 font-mono">
            <span className="text-foreground font-medium">{guidance.percentage.toFixed(1)}%</span>
            <span className="text-muted-foreground text-xs">Target: 75%</span>
          </div>
          <Progress 
            value={guidance.percentage} 
            className="h-3 bg-muted rounded-full"
            indicatorClassName={hasData ? (isSafe ? 'bg-primary' : 'bg-destructive') : 'bg-muted-foreground'}
          />
        </div>

        {/* Mark buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <Button 
            onClick={handleMarkPresent} 
            disabled={markPresent.isPending}
            data-testid={`button-present-${subject.id}`}
            className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm h-12"
          >
            <Check className="mr-2 h-5 w-5" /> Present
          </Button>
          <Button 
            onClick={handleMarkAbsent} 
            disabled={markAbsent.isPending}
            data-testid={`button-absent-${subject.id}`}
            className="rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-sm h-12"
          >
            <X className="mr-2 h-5 w-5" /> Absent
          </Button>
        </div>

        {/* Undo buttons — shown only when the respective count > 0 */}
        {(subject.presentCount > 0 || subject.absentCount > 0) && (
          <div className="grid grid-cols-2 gap-3 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndoPresent}
              disabled={subject.presentCount === 0 || undoPresent.isPending}
              data-testid={`button-undo-present-${subject.id}`}
              className="rounded-lg h-7 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 disabled:opacity-30 transition-colors"
            >
              <Undo2 className="mr-1 h-3 w-3" />
              Undo present ({subject.presentCount})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndoAbsent}
              disabled={subject.absentCount === 0 || undoAbsent.isPending}
              data-testid={`button-undo-absent-${subject.id}`}
              className="rounded-lg h-7 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-30 transition-colors"
            >
              <Undo2 className="mr-1 h-3 w-3" />
              Undo absent ({subject.absentCount})
            </Button>
          </div>
        )}
      </div>

      <EditSubjectDialog 
        subject={subject} 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subject</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {subject.name}? All attendance data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
