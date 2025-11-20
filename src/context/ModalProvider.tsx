"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DialogContentProps } from "@radix-ui/react-dialog";
import {
  createContext,
  Dispatch,
  memo,
  ReactNode,
  SetStateAction,
  Suspense,
  useCallback,
  useContext,
  useState,
} from "react";
import { FaSpinner } from "react-icons/fa";

type ModalContextType = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  setDialogContent: Dispatch<SetStateAction<ReactNode | undefined>>;
  setOnCloseCallback: (callback: () => void) => void;
  setDialogContentProps: Dispatch<SetStateAction<DialogContentProps>>;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>();
  const [onCloseCallback, setOnCloseCallback] = useState<(() => void) | null>(
    null
  );
  const [dialogContentProps, setDialogContentProps] =
    useState<DialogContentProps | null>(null);

  function resetModal() {
    setIsOpen(false);
    setModalContent(undefined);
    setOnCloseCallback(null);
    setDialogContentProps(null);
  }

  const closeModal = useCallback(() => {
    resetModal();
  }, [onCloseCallback]);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal,
        setDialogContent: setModalContent,
        setOnCloseCallback: (callback) => setOnCloseCallback(() => callback),
        setDialogContentProps,
      }}
    >
      {children}

      {/* Global Modal */}
      <Dialog open={isOpen && !!modalContent} onOpenChange={setIsOpen}>
        <DialogTitle />
        <DialogDescription />
        <DialogContent
          {...dialogContentProps}
          className={cn(
            "bg-background max-md:p-1!",
            dialogContentProps?.className
          )}
          onPointerDownOutside={(e) => {
            // don't dismiss dialog when clicking a toast
            if (
              e.target instanceof Element &&
              e.target.closest("[data-toast]")
            ) {
              e.preventDefault();
            }

            dialogContentProps?.onPointerDownOutside?.(e);
          }}
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center size-full">
                <FaSpinner className="animate-spin" />
              </div>
            }
          >
            {modalContent}
          </Suspense>
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  );
};

export default memo(ModalProvider);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};
