"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePetition = exports.updatePetition = exports.createPetition = exports.getPetitionById = exports.getAllPetitions = void 0;
const db_1 = require("../config/db");
const embedding_services_1 = require("./embedding.services");
// Get all petitions
const getAllPetitions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const petitions = yield db_1.prisma.petition.findMany();
    res.json(petitions);
});
exports.getAllPetitions = getAllPetitions;
// Get a single petition by ID
const getPetitionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const petition = yield db_1.prisma.petition.findUnique({
        where: { id }
    });
    res.json(petition);
});
exports.getPetitionById = getPetitionById;
// Create a new petition
const createPetition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fromUserId, organizationId, departmentId, subject, body, tag, priority, attachments } = req.body;
    const petition = yield db_1.prisma.petition.create({
        data: {
            fromUserId,
            organizationId,
            departmentId,
            subject,
            body,
            tag,
            priority: priority,
            attachments,
        }
    });
    console.log(petition);
    // const mostSimilarResult = await getMostSimilarEmbeddingResult(title+body , tag)
    const petitionEmbeddingResponse = yield (0, embedding_services_1.addPetitionEmbedding)({
        _id: petition.id,
        title: subject,
        description: body,
        tag: tag
    });
    res.json(Object.assign(Object.assign({}, petition), { 
        // mostSimilarResult: mostSimilarResult,
        petitionEmbedding: petitionEmbeddingResponse }));
});
exports.createPetition = createPetition;
// Update a petition
const updatePetition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    if (data.priority) {
        data.priority = data.priority;
    }
    const petition = yield db_1.prisma.petition.update({
        where: { id },
        data: Object.assign({}, req.body)
    });
    res.json(petition);
});
exports.updatePetition = updatePetition;
// Delete a petition
const deletePetition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const petition = yield db_1.prisma.petition.delete({
        where: { id }
    });
    const petitionEmbeddingDeleted = yield (0, embedding_services_1.deletePetitionEmbedding)(id);
    res.json(Object.assign(Object.assign({}, petition), { petitionEmbeddingDeleted }));
});
exports.deletePetition = deletePetition;
