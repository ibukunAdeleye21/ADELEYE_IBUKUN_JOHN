import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm";
import { Employee } from "./employee.model";

export enum LeaveStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

@Entity("leave_requests")
export class LeaveRequest {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "date" })
    startDate!: Date;

    @Column({ type: "date" })
    endDate!: Date;

    @Column({
        type: "enum",
        enum: LeaveStatus,
        default: LeaveStatus.PENDING,
    })
    @Index()
    status!: LeaveStatus;

    @CreateDateColumn()
    createdAt!: Date;

    // Relations
    @ManyToOne(() => Employee, (employee) => employee.leaveRequests, { onDelete: "CASCADE" })
    @JoinColumn({ name: "employeeId" })
    @Index()
    employee!: Employee;
}