"use client";

import { members } from "@wix/members";
import { products } from "@wix/stores";
import { useState } from "react";
import { Button } from "../ui/button";
import CreateReviewDialog from "./CreateReviewDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useSearchParams } from "next/navigation";

interface CreateReviewButtonProps {
  product: products.Product;
  loggedInMember: members.Member | null;
  memberAlreadyReviewed: boolean;
}

export default function CreateReviewButton({
  product,
  loggedInMember,
  memberAlreadyReviewed,
}: CreateReviewButtonProps) {
  const searchParams = useSearchParams();
  const [showDialog, setShowDialog] = useState(
    searchParams.get("createReview") === "true",
  );
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <>
      <Button onClick={() => setShowDialog(true)} disabled={!loggedInMember}>
        Leave a Review
      </Button>
      <CreateReviewDialog
        product={product}
        open={showDialog && !memberAlreadyReviewed && !!loggedInMember}
        onOpenChange={setShowDialog}
        onSubmitted={() => {
          setShowDialog(false);
          setShowConfirmation(true);
        }}
      />
      <ConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
      />
      <AlreadyReviewedDialog
        open={showDialog && memberAlreadyReviewed}
        onOpenChange={setShowDialog}
      />
    </>
  );
}

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ConfirmationDialog({ open, onOpenChange }: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="space-y-3">
          <DialogTitle>Submitted successfully!</DialogTitle>
          <DialogDescription>
            Thank you for your review! Your submission has been received
            successfully. It will be published and visible once it has been
            reviewed and approved by our team.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type AlreadyReviewedDialogProps = ConfirmationDialogProps;

function AlreadyReviewedDialog({
  open,
  onOpenChange,
}: AlreadyReviewedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="space-y-3">
          <DialogTitle>Review Already Submitted</DialogTitle>
          <DialogDescription>
            You&apos;ve already reviewed this product. Please note that each
            user can submit only one review per product. Thank you for sharing
            your feedback!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
