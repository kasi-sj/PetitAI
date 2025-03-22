"use client";
import { deleteRole, getUserRoles } from "@/actions/userRole";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import React, {  useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { BiShowAlt } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { Input } from "./ui/input";
import SpinningProgress from "./spinning-progress";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

type Role = {
  id: string;
  roleName: string;
  priority: number;
  _count: {
    organizationUsers: number;
  };
};

const UserRoleTable = ({
  organizationName,
  type,
}: {
  organizationName: string;
  type: "OrganizationUser" | "AdminUser" | null;
}) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const {
    isPending,
    error,
    data: userRoleData,
  } = useQuery({
    queryKey: ["org-user-role-list", organizationName, pageNumber, search],
    queryFn: () => getUserRoles(organizationName, pageNumber, search),
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (roleId: string) => {
      return await deleteRole(roleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["org-user-role-list", organizationName],
        exact: false,
      });

      toast({
        title: "UserRole Deleted",
        description: "User Role has been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete user Role ",
        description: "error : " + error.message,
      });
    },
  });

  const totalPages = userRoleData?.totalPages;
  const currentPage = userRoleData?.currentPage;
  const roles = userRoleData?.data;

  const doAction = (role: Role, action: string) => {
    if (action == "view") {
      return router.push(`/admin/user-roles/${role.id}`);
    }
    if (action == "delete") {
      if (role._count.organizationUsers > 0) {
        return toast({
          title: "Failed to delete user Role ",
          description:
            "User Role has users assigned to it , please remove users before deleting",
        });
      }
      deleteMutation.mutate(role.id);
    }
    // return alert("Not implemented" + role + action);
  };

  if (deleteMutation.isPending) {
    return (
      <div className="mt-14">
        <SpinningProgress size={8} />
      </div>
    );
  }

  const isAdmin = type === "AdminUser";
  // const isAdmin = true;

  return (
    <div className="p-10 flex flex-col justify- min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <Input
          onKeyDown={(event) => {
            if (event.key == "Enter") {
              setSearch(event.currentTarget.value);
              setPageNumber(1);
            }
          }}
          placeholder="Filter roles..."
          className="max-w-sm"
        />
        {isAdmin && (
          //   <AddEntity
          //     organizationName={organizationName}
          //     entity="user-role"
          //     label=" User Role"
          //     admin={isAdmin}
          //   />
          <Link href="/admin/user-roles/add">
            <Button>Add Role</Button>
          </Link>
        )}
      </div>

      {/* Table Section */}
      {isPending ? (
        <div className="flex-grow flex items-center justify-center">
          <SpinningProgress size={8} />
        </div>
      ) : error ? (
        <div className="text-red-500">{error.message}</div>
      ) : (
        <div className="flex-grow ">
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Role Id</TableHead>
                <TableHead>Role Name</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Users</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles?.map((role: Role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.id}</TableCell>
                  <TableCell>{role.roleName}</TableCell>
                  <TableCell>{role.priority}</TableCell>
                  <TableCell>{role._count.organizationUsers}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <BiShowAlt
                        size={23}
                        className="cursor-pointer text-blue-500"
                        onClick={() => doAction(role, "view")}
                      />
                      <MdDeleteOutline
                        size={23}
                        className={`${
                          isAdmin
                            ? "cursor-pointer text-red-500"
                            : "text-gray-400"
                        }`}
                        title={
                          !isAdmin ? "Not allowed for Organization User" : ""
                        }
                        onClick={() => {
                          if (isAdmin) doAction(role, "delete");
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination Section - Moved to Bottom */}
      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem
                onClick={() => setPageNumber(currentPage - 1)}
                className="cursor-pointer"
              >
                <PaginationPrevious />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink>{currentPage}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            {totalPages > currentPage && (
              <PaginationItem
                onClick={() => setPageNumber(currentPage + 1)}
                className="cursor-pointer"
              >
                <PaginationNext />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default UserRoleTable;
