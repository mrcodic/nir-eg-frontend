"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DialogContentProps } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";
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
import { useAuthContext } from "./auth-context";

type OpenModalOptions = {
  /**
   * Your existing behavior.
   * Example: bypass profile_completed check.
   */
  force?: boolean;

  /**
   * New behavior.
   * true = user cannot close the modal.
   * Only closeModal() can close it.
   */
  preventClose?: boolean;
};

type ModalContextType = {
  isOpen: boolean;
  preventClose: boolean;
  openModal: (options?: OpenModalOptions) => void;
  closeModal: () => void;
  setDialogContent: Dispatch<SetStateAction<ReactNode | undefined>>;
  setDialogContentProps: Dispatch<
    SetStateAction<(DialogContentProps & { hideClose?: boolean }) | null>
  >;
  addSideElement: (node: ReactNode) => () => void;
  removeSideElement: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

const ModalProvider = ({ children }: { children: ReactNode }) => {
  const { profile } = useAuthContext();

  const [isOpen, setIsOpen] = useState(false);
  const [preventClose, setPreventClose] = useState(false);

  const [modalContent, setModalContent] = useState<ReactNode | undefined>();
  const [dialogContentProps, setDialogContentProps] = useState<
    (DialogContentProps & { hideClose?: boolean }) | null
  >(null);
  const [sideElement, setSideElement] = useState<ReactNode | undefined>();

  const closeModal = useCallback(() => {
    setPreventClose(false);
    setIsOpen(false);
  }, []);

  const openModal = useCallback(
    (options?: OpenModalOptions) => {
      /**
       * Keep your old force behavior exactly as it is.
       */
      console.log(
        !options?.force &&
          (profile?.profile_completed === false ||
            !profile?.student_phone_verification),
      );
      if (
        !options?.force &&
        (profile?.profile_completed === false ||
          !profile?.student_phone_verification)
      )
        return;

      setPreventClose(Boolean(options?.preventClose));
      setIsOpen(true);
    },
    [profile?.profile_completed, profile?.student_phone_verification],
  );

  const addSideElement = useCallback((node: ReactNode) => {
    setSideElement(node);
    return () => setSideElement(undefined);
  }, []);

  const removeSideElement = useCallback(() => {
    setSideElement(undefined);
  }, []);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      /**
       * Block closing from:
       * - outside click
       * - ESC
       * - Radix/shadcn close button
       */
      if (!open && preventClose) return;

      setIsOpen(open);

      if (!open) {
        setPreventClose(false);
      }
    },
    [preventClose],
  );

  useEffect(() => {
    if (!isOpen) {
      const tid = setTimeout(() => {
        setModalContent(undefined);
        setDialogContentProps(null);
        setSideElement(undefined);
        setPreventClose(false);
      }, 50);

      return () => clearTimeout(tid);
    }

    return;
  }, [isOpen]);

  const values = useMemo(() => {
    return {
      isOpen,
      preventClose,
      openModal,
      closeModal,
      setDialogContent: setModalContent,
      setDialogContentProps,
      addSideElement,
      removeSideElement,
    };
  }, [
    isOpen,
    preventClose,
    openModal,
    closeModal,
    addSideElement,
    removeSideElement,
  ]);

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
            hideClose={preventClose || dialogContentProps?.hideClose}
            className={cn(
              "max-h-[calc(100vh-2rem)] overflow-visible overflow-y-auto bg-white max-md:p-2",

              /**
               * Hide default shadcn close X button when preventClose is true.
               */
              preventClose && "[&>button:last-child]:hidden",

              dialogContentProps?.className,
            )}
            onEscapeKeyDown={(e) => {
              if (preventClose) {
                e.preventDefault();
                return;
              }

              dialogContentProps?.onEscapeKeyDown?.(e);
            }}
            onPointerDownOutside={(e) => {
              if (preventClose) {
                e.preventDefault();
                return;
              }

              if (
                e.target instanceof Element &&
                e.target.closest("[data-toast]")
              ) {
                e.preventDefault();
              }

              if (
                e.target instanceof Element &&
                (e.target.closest("[data-radix-popover-content]") ||
                  e.target.closest("[data-popover-content]"))
              ) {
                e.preventDefault();
              }

              dialogContentProps?.onPointerDownOutside?.(e);
            }}
            onInteractOutside={(e) => {
              if (preventClose) {
                e.preventDefault();
                return;
              }

              dialogContentProps?.onInteractOutside?.(e);
            }}
          >
            <Suspense
              fallback={
                <div className="flex size-full min-h-[300px] items-center justify-center">
                  <Loader2 className="text-primary-800 size-10 animate-spin" />
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

  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  return context;
};
