import { Model, ModelStatic, FindOptions, CreateOptions, UpdateOptions, DestroyOptions } from 'sequelize';

export abstract class BaseRepository<T extends Model> {
  protected model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  async findAll(options?: FindOptions): Promise<T[]> {
    return this.model.findAll(options);
  }

  async findById(id: number, options?: FindOptions): Promise<T | null> {
    return this.model.findByPk(id, options);
  }

  async findOne(options: FindOptions): Promise<T | null> {
    return this.model.findOne(options);
  }

  async create(data: any, options?: CreateOptions): Promise<T> {
    return this.model.create(data, options);
  }

  async update(data: any, options: UpdateOptions) {
    return this.model.update(data, options);
  }

  async delete(id:string|number){
    const destroy = await this.model.findByPk(id)
    await destroy?.destroy()
    return true
  }

  async count(options?: FindOptions): Promise<number> {
    return this.model.count(options);
  }
}