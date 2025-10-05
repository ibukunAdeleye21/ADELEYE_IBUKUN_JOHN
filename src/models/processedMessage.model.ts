import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique, Index} from "typeorm";


@Entity("processed_messages")
@Unique(["messageId"])
export class ProcessedMessage {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @Index({ unique: true })
    messageId!: string

    @CreateDateColumn()
    processedAt!: Date;
}
