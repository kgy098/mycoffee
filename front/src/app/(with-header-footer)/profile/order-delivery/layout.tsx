"use client";
import React, { useEffect } from "react";
import { useHeaderStore } from "@/stores/header-store";

export default function OrderDeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader({
      title: "주문/배송 조회",
      showBackButton: true,
    });
  }, []);

  return (
    <>
      {children}
    </>
  );
}
