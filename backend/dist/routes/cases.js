"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Case_1 = __importDefault(require("../models/Case"));
const Client_1 = __importDefault(require("../models/Client"));
const router = express_1.default.Router();
// Get all cases
router.get('/', async (req, res) => {
    try {
        const cases = await Case_1.default.find().populate('clientId', 'name');
        res.json(cases);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Get case by ID
router.get('/:id', async (req, res) => {
    try {
        const caseItem = await Case_1.default.findById(req.params.id).populate('clientId');
        if (!caseItem) {
            return res.status(404).json({ message: 'Case not found' });
        }
        res.json(caseItem);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Create new case
router.post('/', async (req, res) => {
    try {
        const { clientId, title, description, stage, dateOfLoss, anteLitemRequired, anteLitemAgency, anteLitemDeadline } = req.body;
        // Verify client exists
        const client = await Client_1.default.findById(clientId);
        if (!client) {
            return res.status(400).json({ message: 'Client not found' });
        }
        const newCase = new Case_1.default({
            clientId,
            title,
            description,
            stage,
            dateOfLoss,
            anteLitemRequired,
            anteLitemAgency,
            anteLitemDeadline
        });
        const savedCase = await newCase.save();
        await savedCase.populate('clientId', 'name');
        res.status(201).json(savedCase);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Update case
router.put('/:id', async (req, res) => {
    try {
        const { clientId, title, description, stage, dateOfLoss, anteLitemRequired, anteLitemAgency, anteLitemDeadline } = req.body;
        // Verify client exists if clientId is being updated
        if (clientId) {
            const client = await Client_1.default.findById(clientId);
            if (!client) {
                return res.status(400).json({ message: 'Client not found' });
            }
        }
        const updatedCase = await Case_1.default.findByIdAndUpdate(req.params.id, {
            clientId,
            title,
            description,
            stage,
            dateOfLoss,
            anteLitemRequired,
            anteLitemAgency,
            anteLitemDeadline
        }, { new: true }).populate('clientId', 'name');
        if (!updatedCase) {
            return res.status(404).json({ message: 'Case not found' });
        }
        res.json(updatedCase);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Delete case
router.delete('/:id', async (req, res) => {
    try {
        const deletedCase = await Case_1.default.findByIdAndDelete(req.params.id);
        if (!deletedCase) {
            return res.status(404).json({ message: 'Case not found' });
        }
        res.json({ message: 'Case deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
