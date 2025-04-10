import { Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey, Default } from 'sequelize-typescript'

@Table({
    tableName: 'usuarios'
})

class Usuario extends Model {
    @Column({
        type: DataType.STRING(100)
    })
    declare nombre: string

    @Column({
        type: DataType.STRING(150)
    })
    declare email: string


    @Column({
        type: DataType.STRING(150)
    })
    declare password: string

    @Default('user')
    @Column({
        type: DataType.STRING(10)
    })
    declare role: string



}

export default Usuario