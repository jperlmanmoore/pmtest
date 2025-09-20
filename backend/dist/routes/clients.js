"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Client_1 = __importDefault(require("../models/Client"));
const router = express_1.default.Router();
// Get all clients
router.get('/', async (req, res) => {
    try {
        const clients = await Client_1.default.find();
        res.json(clients);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Get client by ID
router.get('/:id', async (req, res) => {
    try {
        const client = await Client_1.default.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(client);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Create new client
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, address, dateOfBirth, ssn } = req.body;
        const newClient = new Client_1.default({
            name,
            email,
            phone,
            address,
            dateOfBirth,
            ssn
        });
        const savedClient = await newClient.save();
        res.status(201).json(savedClient);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Update client
router.put('/:id', async (req, res) => {
    try {
        const { name, email, phone, address, dateOfBirth, ssn } = req.body;
        const updatedClient = await Client_1.default.findByIdAndUpdate(req.params.id, {
            name,
            email,
            phone,
            address,
            dateOfBirth,
            ssn
        }, { new: true });
        if (!updatedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(updatedClient);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Delete client
router.delete('/:id', async (req, res) => {
    try {
        const deletedClient = await Client_1.default.findByIdAndDelete(req.params.id);
        if (!deletedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json({ message: 'Client deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
