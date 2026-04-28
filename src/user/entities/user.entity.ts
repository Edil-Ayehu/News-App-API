import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
@PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 fullName: string;

 @Column({unique: true})
 email: string;

 @Column()
 password: string;

 @Column({type: 'text', nullable: true })
  refreshToken: string | null

  @Column({type: 'text', nullable: true })
  resetToken: string | null

  @Column({type: 'timestamp', nullable: true })
  resetTokenExpires: Date | null

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}