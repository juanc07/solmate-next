"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/lib/api";
import { IUser } from "@/lib/interfaces"; // Import the IUser interface
import Layout from "@/components/custom/server/Layout";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UsersPage() {
  const { data: users, error, isLoading } = useQuery<IUser[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 10000,
  });

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
    <Layout>      
      <Table>
      <TableCaption className="caption-top">A list of users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user: IUser) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Layout>
  );
}
