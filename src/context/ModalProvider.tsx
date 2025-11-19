"use client";

import LoadingSpinner from "@/components/Loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
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

type ModalContextType = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  setDialogContent: Dispatch<SetStateAction<ReactNode | undefined>>;
  setOnCloseCallback: (callback: () => void) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>();
  const [onCloseCallback, setOnCloseCallback] = useState<(() => void) | null>(
    null
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
    if (onCloseCallback) {
      onCloseCallback();
      setOnCloseCallback(null);
    }
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
      }}
    >
      {children}

      {/* Global Modal */}
      <Dialog open={isOpen && !!modalContent} onOpenChange={setIsOpen}>
        <DialogTitle />
        <DialogDescription />
        <DialogContent
          className="modal-style bg-background max-md:p-1!"
          onPointerDownOutside={(e) => {
            // don't dismiss dialog when clicking a toast
            if (
              e.target instanceof Element &&
              e.target.closest("[data-toast]")
            ) {
              e.preventDefault();
            }
          }}
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center">
                <LoadingSpinner />
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
