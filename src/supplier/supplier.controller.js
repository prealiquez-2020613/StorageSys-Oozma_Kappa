import Supplier from './supplier.model.js';

export const createSupplier = async (req, res) => {
    try {
        const supplier = new Supplier(req.body);
        await supplier.save();
        res.status(201).json({ message: 'Supplier created successfully', supplier });
    } catch (err) {
        res.status(500).json({ message: 'Error creating supplier', error: err });
    }
}

export const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Supplier.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Supplier not found' });
        res.json({ message: 'Supplier updated', updated });
    } catch (err) {
        res.status(500).json({ message: 'Error updating supplier', error: err });
    }
}

export const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Supplier.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Supplier not found' });
        res.json({ message: 'Supplier deleted', deleted });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting supplier', error: err });
    }
}

export const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find().populate('products', 'name category');
        res.json({ message: 'Suppliers retrieved', suppliers });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving suppliers', error: err });
    }
}

export const getSupplierById = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await Supplier.findById(id).populate('products', 'name category');
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        res.json({ message: 'Supplier found', supplier });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving supplier', error: err });
    }
}
