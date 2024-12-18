import { IProduct } from "../../../../DB/interfaces/product";
import { productModel } from "../../../../DB/models/productModel";

class Database {
    static async createProduct(data: IProduct) {
        const newProduct = new productModel(data);
        return await newProduct.save();
    }

    static async getProductById(id: string) {
        return await productModel.findById(id);
    }

    static async getAllProducts() {
        return await productModel.find();
    }

    static async updateProduct(id: string, data: Partial<IProduct>) {
        const product = await productModel.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        Object.assign(product, data);
        return await product.save();
    }

    static async deleteProduct(id: string) {
        return await productModel.findByIdAndDelete(id);
    }
}

export default Database;