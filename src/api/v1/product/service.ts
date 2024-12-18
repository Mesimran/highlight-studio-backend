import Database from './database';
class MainProductService{
    
    static async create(data:any){
        return await Database.createProduct(data);
    }
    static async get(id: string) {
        return await Database.getProductById(id);
    }

    static async getAll() {
        return await Database.getAllProducts();
    }
    static async update(id: string, data:any){
        return await Database.updateProduct(id, data);
    }
    static async delete(id: string){
        return await Database.deleteProduct(id);
    }
}

export default MainProductService;