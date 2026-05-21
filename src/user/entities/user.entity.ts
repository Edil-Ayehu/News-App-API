import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "../enums/role.enum";
import { ReadingHistory } from "src/articles/entities/reading-history.entity";

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
  
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role

  @OneToMany(() => ReadingHistory, (history) => history.user)
  readingHistories: ReadingHistory[]

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