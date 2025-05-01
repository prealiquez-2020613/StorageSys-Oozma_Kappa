import Category from '../category/category.model.js';
import Product from '../products/product.model.js';

//Agregar Categoria
export const addCategory = async(req, res)=>{
    try{

        let data = req.body;
        let category = new Category(data);

        category.categoryStatus = true;

        await category.save()
        return res.send({succes : true, message: 'Category added successfully'});

    }catch(error){
        console.error(error)
        return res.status(500).send({ success: false, message: 'General error saving category', error});
    }
}

//Listar Categorías
export const allCategories = async (req, res) => {
    try {

        const categories = await Category.find();
        return res.send({ success: true, message: 'Categories retrieved successfully', categories });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: 'General Error', error });
    }
};


//Update Categoria
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(id, { name }, { new: true });

        if (!updatedCategory) {
            return res.status(404).send({ success: false, message: 'Category not found' });
        }

        return res.send({ success: true, message: 'Category updated successfully', category: updatedCategory });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: 'General Error', error });
    }
};


//Delete Categoría
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const categoryToDelete = await Category.findById(id);
        if (!categoryToDelete) {
            return res.status(404).send({ success: false, message: 'Category not found' });
        }

        if (categoryToDelete.name === process.env.CATEGORY_NAME) {
            return res.status(403).send({ success: false, message: 'You cannot delete the Default category' });
        }

        const defaultCategory = await Category.findOne({ name: process.env.CATEGORY_NAME });
        if (!defaultCategory) {
            return res.status(500).send({ success: false, message: 'Default category not found. Cannot reassign products.' });
        }

        await Product.updateMany(
            { category: id },
            { category: defaultCategory._id }
        );

        await Category.findByIdAndDelete(id);

        return res.send({ success: true, message: 'Category deleted successfully. Products reassigned to default category.' });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: 'General error deleting category', error });
    }
};