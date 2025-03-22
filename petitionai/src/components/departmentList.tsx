import React from "react";

type Department = {
  _id: string;
  departmentName: string;
  departmentDescription?: string;
};

type Props = {
  organizationName: string;
};

const getDepartments = async (organizationName: string) => {
  "use server";
  const baseUrl = process.env.BACK_END_URL;
  console.log(`${baseUrl}/api/departments/organization-by-name/${organizationName}`);
  
  const response = await fetch(`${baseUrl}/api/departments/organization-by-name/${organizationName}`);
  if (!response.ok) throw new Error("Failed to fetch departments");
  
  return response.json();
};

const Departments = async ({ organizationName }: Props) => {
  const departments: Department[] = await getDepartments(organizationName);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{organizationName} - Departments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((department) => (
          <div key={department._id} className="p-4 border rounded-lg shadow hover:bg-gray-100">
            <h3 className="text-lg font-semibold">{department.departmentName}</h3>
            <p className="text-sm text-gray-600">{department.departmentDescription || "No description available"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Departments;
