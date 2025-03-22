"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";

const AddEntity = ({
  organizationName,
  entity,
  label,
  admin,
}: {
  organizationName: string | null;
  entity: string;
  label: string;
  admin?: boolean;
}) => {
  const router = useRouter();
  return (
    <div className="my-2">
      <Button
        onClick={() => {
          router.push(
            `/${
              admin ? "admin/" : ""
            }organization/${organizationName}/${entity}/add`
          );
        }}
      >
        Add {label}
      </Button>
    </div>
  );
};

export default AddEntity;
