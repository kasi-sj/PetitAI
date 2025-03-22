"use client"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {  usePathname } from "next/navigation";
import React from 'react'

const Heading = () => {
    const path = usePathname()?.substring(1).split("/")
    return (
        <div>
        <Breadcrumb>
            <BreadcrumbList>
                {
                    path && path.map((tag, index) => (
                        <React.Fragment key={index}>
                            <BreadcrumbItem>
                                <BreadcrumbLink href={`/${path.slice(0, index + 1).join("/")}`}>{tag}</BreadcrumbLink>
                            </BreadcrumbItem>
                            {index < path.length - 1 && <BreadcrumbSeparator />}
                        </React.Fragment>
                    ))
                }
            </BreadcrumbList>
        </Breadcrumb>
        </div>
    )
}

export default Heading
