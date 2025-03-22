import express from "express";
import cors from "cors";
import { PrismaClient, StatusEnum } from "@prisma/client";
import userRoutes from "./routes/user.routes";
import organizationRoutes from "./routes/organization.routes"
import departmentRoutes from "./routes/department.routes"
import organizationUserRoutes from "./routes/organization-user.routes";
import roleRoutes from "./routes/role.routes";
import petitionRoutes from "./routes/petition.routes";
import queueRoutes from "./routes/queue.routes";
import statusUpdateRoutes from "./routes/status-update.routes"
import { connectMongoDB } from "./config/db";
import { connectToQueue } from "./config/kafkaConfig";


const app = express();
connectMongoDB()
connectToQueue()

app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);
app.use("/organizations" , organizationRoutes)
app.use("/roles", roleRoutes)
app.use("/departments" , departmentRoutes)
app.use("/organization-users" , organizationUserRoutes)
app.use("/petitions", petitionRoutes)
app.use("/queues", queueRoutes)
app.use("/status-updates" , statusUpdateRoutes)

app.get("/", async (req, res) => {
  res.send("Petition Service API is working (3)");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
