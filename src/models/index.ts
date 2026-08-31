import { Clinic } from "./Clinic";
import { Warehouse } from "./Warehouse";
import { Medicine } from "./Medicine";
import { Inventory } from "./Inventory";
import { SupplyRequest } from "./SupplyRequest";

Clinic.hasMany(SupplyRequest, { foreignKey: "clinicId" });
SupplyRequest.belongsTo(Clinic, { foreignKey: "clinicId" });

Medicine.hasMany(SupplyRequest, { foreignKey: "medicineId" });
SupplyRequest.belongsTo(Medicine, { foreignKey: "medicineId" });

Warehouse.hasMany(SupplyRequest, { foreignKey: "warehouseId" });
SupplyRequest.belongsTo(Warehouse, { foreignKey: "warehouseId" });

Warehouse.hasMany(Inventory, { foreignKey: "warehouseId" });
Inventory.belongsTo(Warehouse, { foreignKey: "warehouseId" });

Medicine.hasMany(Inventory, { foreignKey: "medicineId" });
Inventory.belongsTo(Medicine, { foreignKey: "medicineId" });

export { Clinic, Warehouse, Medicine, Inventory, SupplyRequest };
