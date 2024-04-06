'use client'

import { useStoreModal } from "@/hooks/use-store-modal";
import { useLayoutEffect } from "react";

const SetupPage = () => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useLayoutEffect(() => {
    if(!isOpen){
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
}

export default SetupPage;