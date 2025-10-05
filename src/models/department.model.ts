import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, Index} from "typeorm";
import { Employee } from "../models/employee.model";

@Entity("departments")
export class Department {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true})
    @Index()
    name!: string;

    @CreateDateColumn()
    createdAt!: Date;

    // Relations
    @OneToMany(() => Employee, (employee) => employee.department)
    employees!: Employee[];
}