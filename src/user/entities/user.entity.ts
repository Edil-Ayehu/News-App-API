import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

 @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatar: string;

  @ManyToMany(() => User)
  @JoinTable()
  following: User[];

 @Column({type: 'text', nullable: true })
  refreshToken: string | null

  @Column({type: 'text', nullable: true })
  resetOtp: string | null

  @Column({type: 'timestamp', nullable: true })
  resetOtpExpires: Date | null

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}