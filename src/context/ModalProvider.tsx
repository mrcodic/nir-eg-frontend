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
  useEffect,
  useState,
} from "react";
import { FaSpinner } from "react-icons/fa";

type ModalContextType = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  setDialogContent: Dispatch<SetStateAction<ReactNode | undefined>>;
  setDialogContentProps: Dispatch<SetStateAction<DialogContentProps | null>>;
  /**
   * Adds a side element (rendered beside children).
   * Returns a disposer function to remove it manually.
   */
  addSideElement: (node: ReactNode) => () => void;
  removeSideElement: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | undefined>();
  const [dialogContentProps, setDialogContentProps] =
    useState<DialogContentProps | null>(null);

  // The "side element" to render beside children
  const [sideElement, setSideElement] = useState<ReactNode | undefined>();

  function resetModal() {
    setIsOpen(false);
    setModalContent(undefined);
    setDialogContentProps(null);
    setSideElement(undefined);
  }

  const closeModal = useCallback(() => {
    resetModal();
  }, []);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Add side element and return disposer so caller can remove it manually
  const addSideElement = useCallback((node: ReactNode) => {
    setSideElement(node);
    const disposer = () => setSideElement(undefined);
    return disposer;
  }, []);

  const removeSideElement = useCallback(() => {
    setSideElement(undefined);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setModalContent(undefined);
      setDialogContentProps(null);
      setSideElement(undefined);
    }
  }, [isOpen]);

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal,
        setDialogContent: setModalContent,
        setDialogContentProps,
        addSideElement,
        removeSideElement,
      }}
    >
      {children}
      {sideElement}

      {/* Global Modal */}
      <Dialog
        open={isOpen && !!modalContent}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setModalContent(undefined);
            setDialogContentProps(null);
            setSideElement(undefined);
          }
        }}
      >
        <DialogTitle />
        <DialogDescription />
        <DialogContent
          {...dialogContentProps}
          className={cn(
            "bg-white max-md:p-1! overflow-visible max-h-[calc(100vh-2rem)] overflow-y-auto",
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
              <div className="flex items-center justify-center size-full min-h-[400px]">
                <FaSpinner className="animate-spin text-primary-800 size-10" />
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
