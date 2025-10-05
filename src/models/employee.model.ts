import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany, Index} from "typeorm";
import { Department } from "./department.model";
import { LeaveRequest } from "./leaveRequest.model";

@Entity('employees')
export class Employee {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({unique: true})
    @Index()
    email!: string;

    @CreateDateColumn()
    createdAt!: Date;

    // Relations
    @ManyToOne(() => Department, (department) => department.employees, { onDelete: "SET NULL" })
    @JoinColumn({ name: "departmentId" })  // this column will be the FK
    @Index()
    department!: Department;

    @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.employee)
    leaveRequests!: LeaveRequest[];
}