"use client";

import { ReactNode } from "react";
import { PolicyCard as RawPolicyCard } from "@/types";
import PolicyCard from "./PolicyCard";

interface ConfirmDialogProps {
  open: boolean;
  onConfirm?: () => void;
  onCancel: () => void;
  card?: RawPolicyCard | null;
  children?: ReactNode;
  isConfirmButtons?: boolean;
}

export default function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  card,
  children,
  isConfirmButtons,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-60">
      <div className="bg-white p-6 rounded shadow-md w-[360px] max-w-[95%] text-center flex flex-col items-center gap-4">
        {/* カードがあれば表示 */}
        {card && <PolicyCard card={card} isSelected={false} />}

        {/* メッセージ */}
        {!isConfirmButtons && (
          <div className="text-base font-medium">{children ?? "このカードを選択しますか？"}</div>
        )}

        {/* ボタン群 */}
        <div className="mt-4 flex justify-center gap-4">
          {isConfirmButtons ? (
            <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              閉じる
            </button>
          ) : (
            <>
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                キャンセル
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                決定
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
