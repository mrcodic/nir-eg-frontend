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
  useMemo,
  useState,
} from "react";
import { FaSpinner } from "react-icons/fa";

type ModalContextType = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  setDialogContent: Dispatch<SetStateAction<ReactNode | undefined>>;
  setDialogContentProps: Dispatch<SetStateAction<DialogContentProps | null>>;
  addSideElement: (node: ReactNode) => () => void;
  removeSideElement: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | undefined>();
  const [dialogContentProps, setDialogContentProps] =
    useState<DialogContentProps | null>(null);
  const [sideElement, setSideElement] = useState<ReactNode | undefined>();

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const addSideElement = useCallback((node: ReactNode) => {
    setSideElement(node);
    return () => setSideElement(undefined);
  }, []);

  const removeSideElement = useCallback(() => {
    setSideElement(undefined);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      const tid = setTimeout(() => {
        setModalContent(undefined);
        setDialogContentProps(null);
        setSideElement(undefined);
      }, 50);
      return () => clearTimeout(tid);
    }
    return;
  }, [isOpen]);

  const values = useMemo(() => {
    return {
      isOpen,
      openModal,
      closeModal,
      setDialogContent: setModalContent,
      setDialogContentProps,
      addSideElement,
      removeSideElement,
    };
  }, [addSideElement, closeModal, isOpen, openModal, removeSideElement]);

  return (
    <ModalContext.Provider value={values}>
      {children}

      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          {sideElement}

          <DialogTitle />
          <DialogDescription />
          <DialogContent
            {...dialogContentProps}
            className={cn(
              "max-h-[calc(100vh-2rem)] overflow-visible overflow-y-auto bg-white max-md:p-2",
              dialogContentProps?.className,
            )}
            onPointerDownOutside={(e) => {
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
                <div className="flex size-full min-h-[400px] items-center justify-center">
                  <FaSpinner className="text-primary-800 size-10 animate-spin" />
                </div>
              }
            >
              {modalContent}
            </Suspense>
          </DialogContent>
        </Dialog>
      )}
    </ModalContext.Provider>
  );
};

export default memo(ModalProvider);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};
