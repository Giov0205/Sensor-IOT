import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'sensor_data',
  timestamps: false, // ⛔️ Desactivamos createdAt/updatedAt automáticos
})
export class SensorData extends Model {
  @Column({ type: DataType.FLOAT, allowNull: false })
  declare voltage: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  declare timestamp: Date;
}
