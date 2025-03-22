"use client";
import {
  Table,
  TableBody,
  TableCaption,
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

import { MdDeleteOutline } from "react-icons/md";

import { CiEdit } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { deleteDepartment, getDepartments } from "@/actions/department";
import Link from "next/link";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";

type Department = {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  isRoot: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    petitions: number;
    users: number;
  };
};

// type TOrgUserData = {
//     totalPages: number;
//     currentPage: number;
//     data: OrganizationUser[]
// }

const DepartmentTable = ({
  organizationName,
  type,
}: {
  organizationName: string | null;
  type?: "OrganizationUser" | "AdminUser";
}) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const {
    isPending,
    error,
    data: departmentData,
  } = useQuery({
    queryKey: ["department-list", organizationName, pageNumber, search],
    queryFn: () => {
      console.log("organizationName", [organizationName]);
      return getDepartments(organizationName, pageNumber, search);
    },
  });

  const totalPages = departmentData?.totalPages;
  const currentPage = departmentData?.currentPage;
  const organizationUsers = departmentData?.data;

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (departmentId: string) => {
      return await deleteDepartment(departmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["department-list", organizationName],
        exact: false,
      });
      console.log("department deleted", ["department-list", organizationName]);

      toast({
        title: "Department Deleted",
        description: "Department has been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete department ",
        description: "error : " + error.message,
      });
    },
  });

  const doAction = (department: Department, action: string) => {
    if (action == "view") {
      return router.push(`/admin/departments/${department.id}`);
    }
    if (action == "delete") {
      deleteMutation.mutate(department.id);
    }

    if (action == "edit") {
      router.push(`/admin/departments/edit?departmentId=${department.id}`);
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
  const isAdmin = type != "OrganizationUser";

  return (
    <div className="w-full p-8">
      <div className="w-full mb-4 flex justify-between items-center ">
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
          <Link href="/admin/departments/add">
            <Button>Add Department</Button>
          </Link>
        )}
      </div>
      {isPending ? (
        <div className="flex justify-center items-center h-screen">
          <SpinningProgress size={8} />
        </div>
      ) : error ? (
        <div>{error.message}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.no</TableHead>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="w-[150px]">Description</TableHead>
              <TableHead>Root</TableHead>
              <TableHead>Petitions</TableHead>
              <TableHead>Users</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizationUsers &&
              organizationUsers.map(
                (organizationUser: Department, index: number) => {
                  return (
                    <TableRow
                      key={organizationUser.id}
                      onClick={() => {
                        // router.push(`/organization/${organizationName}/organization-users/${organizationUser._id}`)
                      }}
                    >
                      <TableCell className="font-medium">
                        {(currentPage - 1) * 10 + index + 1}
                      </TableCell>
                      <TableCell>{organizationUser?.name}</TableCell>
                      <TableCell>{organizationUser?.description}</TableCell>
                      <TableCell>
                        {organizationUser?.isRoot ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        {organizationUser?._count?.petitions}
                      </TableCell>
                      <TableCell>{organizationUser?._count?.users}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-row float-right">
                          <BiShowAlt
                            size={23}
                            className="m-1 cursor-pointer text-blue-500"
                            onClick={() => {
                              doAction(organizationUser, "view");
                            }}
                          />

                          <CiEdit
                            size={23}
                            className={`m-1 ${
                              isAdmin
                                ? "cursor-pointer text-orange-500"
                                : " text-gray-400"
                            }`}
                            title={
                              !isAdmin
                                ? "Not allowed for Organization User"
                                : ""
                            }
                            onClick={() => {
                              if (isAdmin) doAction(organizationUser, "edit");
                            }}
                          />

                          <MdDeleteOutline
                            size={23}
                            className={`m-1 ${
                              isAdmin
                                ? "cursor-pointer text-red-500 "
                                : "text-gray-400"
                            }`}
                            title={
                              !isAdmin
                                ? "Not allowed for Organization User"
                                : ""
                            }
                            onClick={() => {
                              if (isAdmin) doAction(organizationUser, "delete");
                            }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
          </TableBody>

          <TableCaption>
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem
                    onClick={() => {
                      setPageNumber(currentPage - 1);
                    }}
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
                    onClick={() => {
                      setPageNumber(currentPage + 1);
                    }}
                  >
                    <PaginationNext />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </TableCaption>
          <TableCaption>Organization departments.</TableCaption>
        </Table>
      )}
    </div>
  );
};

export default DepartmentTable;
