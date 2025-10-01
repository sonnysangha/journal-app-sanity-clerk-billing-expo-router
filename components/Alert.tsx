import React from "react";
import { AlertDialog } from "tamagui"; // or '@tamagui/alert-dialog'

export default function Alert({
  title,
  description,
  onCancel,
  onConfirm,
}: {
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm?: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialog.Trigger onPress={onCancel}>{onCancel}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay />
        <AlertDialog.Content>
          <AlertDialog.Title>{title}</AlertDialog.Title>
          <AlertDialog.Description>{description}</AlertDialog.Description>
          <AlertDialog.Cancel />
          {onConfirm && (
            <AlertDialog.Action onPress={onConfirm}>
              {onConfirm}
            </AlertDialog.Action>
          )}
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
