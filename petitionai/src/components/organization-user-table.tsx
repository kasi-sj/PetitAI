"use client";
import { getOrganizationUsers } from "@/actions/organizationUser";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import React from "react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "next/navigation"
import { Input } from "./ui/input";
import SpinningProgress from "./spinning-progress";
import { BiShowAlt } from "react-icons/bi";

import { deleteOrganizationUser } from "@/actions/organizationUser";
import { MdDeleteOutline } from "react-icons/md";

import { CiEdit } from "react-icons/ci";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";

type OrganizationUser = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  role: {
    roleName: string;
  };
  reportTo: {
    name: string;
  } | null;
  department: {
    name: string;
  };
};

// type TOrgUserData = {
//     totalPages: number;
//     currentPage: number;
//     data: OrganizationUser[]
// }

const OrganizationUserTable = ({
  organizationName,
  type,
}: {
  organizationName: string;
  type: "OrganizationUser" | "Admin" | null;
}) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const {
    isPending,
    error,
    data: organizationUsersData,
  } = useQuery({
    queryKey: ["org-user-list", organizationName, pageNumber, search],
    queryFn: () => getOrganizationUsers(organizationName, pageNumber, search),
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await deleteOrganizationUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["org-user-list", organizationName],
        exact: false,
      });
      toast({
        title: "User deleted ",
        description: "User deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete user",
        description: "error : " + error.message,
      });
    },
  });

  const totalPages = organizationUsersData?.totalPages;
  const currentPage = organizationUsersData?.currentPage;
  const organizationUsers = organizationUsersData?.data;

  const isAdmin = type == "Admin";

  const doAction = async (
    organizationUser: OrganizationUser,
    action: string
  ) => {
    if (action == "view") {
      return router.push(`/admin/users/${organizationUser.id}`);
    }
    // return alert("Not implemented" + organizationUser + action);
    if (action == "delete") {
      deleteMutation.mutate(organizationUser.id);
    }
    if (action == "edit") {
      router.push(`/admin/users/edit?userId=${organizationUser.id}`);
    }
    // if(action == 'view'){
    //     router.push(`/organization/${organizationName}/organization-users/${organizationUser._id}/`)
    // }else{
    //     router.push(`/organization/${organizationName}/organization-users/${organizationUser._id}/edit`)
    // }
  };

  if (deleteMutation.isPending) {
    return (
      <div className="mt-14">
        <SpinningProgress size={8} />
      </div>
    );
  }

  // const isAdmin = type != "OrganizationUser";

  return (
    <div className="p-4 flex flex-col h-fit">
      <div className="w-full flex justify-between items-center">
        <Input
          onKeyDown={(event) => {
            if (event.key == "Enter") {
              setSearch(event.currentTarget.value);
              setPageNumber(1);
            }
          }}
          placeholder="Search.."
          className="max-w-sm"
        />
        {isAdmin && (
          <div className="float-right">
            <Link href={"/admin/users/add"}>
              <Button>Add user</Button>
            </Link>
          </div>
        )}
      </div>

      {isPending ? (
        <div className="flex justify-center items-center h-screen">
          <SpinningProgress size={8} />
        </div>
      ) : error ? (
        <div>{error.message}</div>
      ) : (
        <div className="flex ">
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>S.no</TableHead>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead className="w-[150px]">Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Report To</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizationUsers &&
                organizationUsers.map(
                  (organizationUser: OrganizationUser, index: number) => {
                    return (
                      <TableRow key={organizationUser.id}>
                        <TableCell className="font-medium">
                          {(currentPage - 1) * 10 + index + 1}
                        </TableCell>
                        <TableCell>{organizationUser?.name}</TableCell>
                        <TableCell>{organizationUser?.email}</TableCell>
                        <TableCell>
                          {organizationUser?.role?.roleName}
                        </TableCell>
                        <TableCell>
                          {organizationUser?.department?.name}
                        </TableCell>
                        <TableCell>
                          {organizationUser?.isActive ? "yes" : "no"}
                        </TableCell>
                        <TableCell>
                          {organizationUser?.reportTo?.name}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-row float-right">
                            <BiShowAlt
                              size={23}
                              className="m-1 cursor-pointer text-blue-500"
                              onClick={() => doAction(organizationUser, "view")}
                            />

                            <CiEdit
                              size={23}
                              className={`m-1 ${isAdmin
                                  ? "cursor-pointer text-blue-500"
                                  : " text-gray-400"
                                }`}
                              title={
                                !isAdmin
                                  ? "Not allowed for Organization User"
                                  : ""
                              }
                              onClick={() => {
                                if (isAdmin) {
                                  doAction(organizationUser, "edit");
                                }
                              }}
                            />

                            <MdDeleteOutline
                              size={23}
                              className={`m-1 ${isAdmin
                                  ? "cursor-pointer text-red-500 "
                                  : "text-gray-400"
                                }`}
                              title={
                                !isAdmin
                                  ? "Not allowed for Organization User"
                                  : "User will only be deleted if no petition is assigned to the user"
                              }
                              onClick={() => {
                                if (isAdmin)
                                  doAction(organizationUser, "delete");
                              }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Move pagination to bottom of the page */}
      <div className="mt-10 mr-10 flex justify-center  py-4">
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem onClick={() => setPageNumber(currentPage - 1)}>
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
              <PaginationItem onClick={() => setPageNumber(currentPage + 1)}>
                <PaginationNext />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default OrganizationUserTable;
