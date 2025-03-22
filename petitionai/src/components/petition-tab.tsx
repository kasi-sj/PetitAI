import React from 'react'
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import PendingPetitionTable from './pending-petition-table'
import AllPetitionTable from './all-petition-table'

const PetitionTab = ({isAdmin}:{
  isAdmin? : true
}) => {
  return (
    <div>
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid grid-cols-2 w-1/2">
          <TabsTrigger value="All">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <PendingPetitionTable isAdmin={isAdmin} />
        </TabsContent>
        <TabsContent value="All">
          <AllPetitionTable isAdmin={isAdmin} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PetitionTab
